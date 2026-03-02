-- KW Deals initial schema

-- Enum types
CREATE TYPE subscription_tier AS ENUM ('basic', 'featured', 'spotlight');
CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'canceled', 'incomplete',
  'incomplete_expired', 'past_due', 'unpaid', 'paused'
);
CREATE TYPE deal_status AS ENUM ('draft', 'active', 'expired', 'archived');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT,
  role          TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('viewer', 'admin', 'super_admin')),
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Categories
CREATE TABLE categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  icon           TEXT,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Businesses
CREATE TABLE businesses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  slug                    TEXT NOT NULL UNIQUE,
  description             TEXT,
  short_description       TEXT,
  category_id             UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  address                 TEXT,
  city                    TEXT DEFAULT 'Kitchener',
  latitude                DECIMAL(10,7),
  longitude               DECIMAL(10,7),
  phone                   TEXT,
  email                   TEXT,
  website_url             TEXT,
  booking_url             TEXT,
  google_maps_url         TEXT,
  hours                   JSONB,
  photos                  TEXT[] DEFAULT '{}',
  logo_url                TEXT,
  cover_image_url         TEXT,
  subscription_tier       subscription_tier DEFAULT 'basic',
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT true,
  is_new                  BOOLEAN NOT NULL DEFAULT false,
  is_staff_pick           BOOLEAN NOT NULL DEFAULT false,
  tags                    TEXT[] DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_tier ON businesses(subscription_tier);
CREATE INDEX idx_businesses_active ON businesses(is_active);
CREATE INDEX idx_businesses_tags ON businesses USING GIN(tags);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active businesses are viewable by everyone"
  ON businesses FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all businesses"
  ON businesses FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can insert businesses"
  ON businesses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update businesses"
  ON businesses FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can delete businesses"
  ON businesses FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Deals
CREATE TABLE deals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  deal_type       TEXT CHECK (deal_type IN ('percentage', 'bogo', 'fixed', 'freebie', 'special')),
  discount_value  TEXT,
  terms           TEXT,
  image_url       TEXT,
  status          deal_status NOT NULL DEFAULT 'draft',
  starts_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  click_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_deals_business ON deals(business_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_slug ON deals(slug);
CREATE INDEX idx_deals_featured ON deals(is_featured) WHERE is_featured = true;
CREATE INDEX idx_deals_expires ON deals(expires_at) WHERE status = 'active';

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active deals are viewable by everyone"
  ON deals FOR SELECT USING (
    status = 'active'
    AND (starts_at IS NULL OR starts_at <= now())
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY "Admins can view all deals"
  ON deals FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can insert deals"
  ON deals FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update deals"
  ON deals FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can delete deals"
  ON deals FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Subscriptions (mirrors Stripe)
CREATE TABLE subscriptions (
  id                     TEXT PRIMARY KEY,
  business_id            UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status                 subscription_status NOT NULL,
  price_id               TEXT NOT NULL,
  tier                   subscription_tier NOT NULL,
  quantity               INTEGER DEFAULT 1,
  cancel_at_period_end   BOOLEAN DEFAULT false,
  current_period_start   TIMESTAMPTZ NOT NULL,
  current_period_end     TIMESTAMPTZ NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at               TIMESTAMPTZ,
  canceled_at            TIMESTAMPTZ,
  trial_start            TIMESTAMPTZ,
  trial_end              TIMESTAMPTZ,
  metadata               JSONB DEFAULT '{}'
);

CREATE INDEX idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view subscriptions"
  ON subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Email subscribers
CREATE TABLE email_subscribers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT NOT NULL UNIQUE,
  name                TEXT,
  is_confirmed        BOOLEAN NOT NULL DEFAULT false,
  confirmation_token  TEXT UNIQUE,
  subscribed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at     TIMESTAMPTZ,
  source              TEXT DEFAULT 'website'
);

CREATE INDEX idx_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_subscribers_confirmed ON email_subscribers(is_confirmed) WHERE is_confirmed = true;

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view subscribers"
  ON email_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Analytics events
CREATE TABLE analytics_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  business_id   UUID REFERENCES businesses(id) ON DELETE SET NULL,
  deal_id       UUID REFERENCES deals(id) ON DELETE SET NULL,
  metadata      JSONB DEFAULT '{}',
  session_id    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_deal ON analytics_events(deal_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
