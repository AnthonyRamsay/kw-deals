-- KW Deals Demo Seed Data
-- 8 realistic Kitchener-Waterloo businesses with deals

-- First, grab category IDs
DO $$
DECLARE
  cat_food UUID;
  cat_retail UUID;
  cat_services UUID;
  cat_entertainment UUID;
  cat_new UUID;
  biz_settlement UUID;
  biz_burrito UUID;
  biz_yeti UUID;
  biz_uptown UUID;
  biz_glow UUID;
  biz_dtk UUID;
  biz_escape UUID;
  biz_boardroom UUID;
BEGIN
  SELECT id INTO cat_food FROM categories WHERE slug = 'food-and-drink';
  SELECT id INTO cat_retail FROM categories WHERE slug = 'retail';
  SELECT id INTO cat_services FROM categories WHERE slug = 'services';
  SELECT id INTO cat_entertainment FROM categories WHERE slug = 'entertainment';
  SELECT id INTO cat_new FROM categories WHERE slug = 'new-openings';

  -- ============================================
  -- BUSINESSES
  -- ============================================

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'Settlement Co. Coffee', 'settlement-co-coffee',
    'Settlement Co. is a specialty coffee roaster and café in the heart of Uptown Waterloo. We source single-origin beans from small farms around the world and roast them in-house weekly. Our cozy space features exposed brick, local art on the walls, and the best espresso in KW. Whether you''re grabbing a quick flat white or settling in for a few hours of remote work, we''ve got you covered.',
    'Specialty coffee roaster & café in Uptown Waterloo',
    cat_food, '27 King St N', 'Waterloo', '(519) 555-0101', 'hello@settlementco.ca', 'https://settlementco.ca', 'https://maps.google.com/?q=27+King+St+N+Waterloo+ON',
    '{"monday": {"open": "7:00 AM", "close": "6:00 PM"}, "tuesday": {"open": "7:00 AM", "close": "6:00 PM"}, "wednesday": {"open": "7:00 AM", "close": "6:00 PM"}, "thursday": {"open": "7:00 AM", "close": "8:00 PM"}, "friday": {"open": "7:00 AM", "close": "8:00 PM"}, "saturday": {"open": "8:00 AM", "close": "6:00 PM"}, "sunday": {"open": "8:00 AM", "close": "4:00 PM"}}'::jsonb,
    ARRAY['coffee', 'cafe', 'uptown', 'waterloo', 'specialty', 'roaster'],
    'spotlight', true, false, true
  ) RETURNING id INTO biz_settlement;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'KW Burrito Boys', 'kw-burrito-boys',
    'Massive burritos, fresh ingredients, and big flavours. KW Burrito Boys has been serving up the best Mexican-inspired eats in downtown Kitchener since 2019. Everything is made fresh daily — our salsas, guac, and slow-cooked meats. Voted best burrito in KW three years running.',
    'Massive burritos & fresh Mexican eats in DTK',
    cat_food, '180 King St W', 'Kitchener', '(519) 555-0102', 'eat@kwburritoboys.ca', 'https://kwburritoboys.ca', 'https://maps.google.com/?q=180+King+St+W+Kitchener+ON',
    '{"monday": {"open": "11:00 AM", "close": "9:00 PM"}, "tuesday": {"open": "11:00 AM", "close": "9:00 PM"}, "wednesday": {"open": "11:00 AM", "close": "9:00 PM"}, "thursday": {"open": "11:00 AM", "close": "10:00 PM"}, "friday": {"open": "11:00 AM", "close": "10:00 PM"}, "saturday": {"open": "11:00 AM", "close": "10:00 PM"}, "sunday": {"open": "12:00 PM", "close": "8:00 PM"}}'::jsonb,
    ARRAY['burritos', 'mexican', 'dtk', 'kitchener', 'lunch', 'dinner'],
    'basic', true, false, false
  ) RETURNING id INTO biz_burrito;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'The Yeti Snowboard Shop', 'the-yeti-snowboard-shop',
    'The Yeti is KW''s only independent snowboard and ski shop. We carry top brands like Burton, Jones, and Salomon, plus a curated selection of streetwear. Our staff are all riders who can help you find the perfect setup. We also offer board tuning, waxing, and binding mounts in our on-site workshop.',
    'Independent snowboard & ski shop with expert staff',
    cat_retail, '95 King St S', 'Waterloo', '(519) 555-0103', 'ride@theyetikw.ca', 'https://theyetikw.ca', 'https://maps.google.com/?q=95+King+St+S+Waterloo+ON',
    '{"monday": {"open": "10:00 AM", "close": "6:00 PM"}, "tuesday": {"open": "10:00 AM", "close": "6:00 PM"}, "wednesday": {"open": "10:00 AM", "close": "6:00 PM"}, "thursday": {"open": "10:00 AM", "close": "8:00 PM"}, "friday": {"open": "10:00 AM", "close": "8:00 PM"}, "saturday": {"open": "10:00 AM", "close": "5:00 PM"}, "sunday": {"open": "12:00 PM", "close": "4:00 PM"}}'::jsonb,
    ARRAY['snowboard', 'ski', 'winter', 'sports', 'retail', 'waterloo'],
    'featured', true, false, true
  ) RETURNING id INTO biz_yeti;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'Uptown Market Vintage', 'uptown-market-vintage',
    'Uptown Market Vintage is a carefully curated vintage and thrift store in Uptown Waterloo. We specialize in 80s and 90s streetwear, band tees, denim, and unique home décor. New inventory drops every weekend. Follow us on Instagram @uptownmarketvintage for first dibs on new arrivals.',
    'Curated vintage & thrift in Uptown Waterloo',
    cat_retail, '16 Erb St W', 'Waterloo', '(519) 555-0104', 'shop@uptownmarketvintage.ca', 'https://uptownmarketvintage.ca', 'https://maps.google.com/?q=16+Erb+St+W+Waterloo+ON',
    '{"monday": "closed", "tuesday": {"open": "11:00 AM", "close": "6:00 PM"}, "wednesday": {"open": "11:00 AM", "close": "6:00 PM"}, "thursday": {"open": "11:00 AM", "close": "7:00 PM"}, "friday": {"open": "11:00 AM", "close": "7:00 PM"}, "saturday": {"open": "10:00 AM", "close": "5:00 PM"}, "sunday": {"open": "12:00 PM", "close": "4:00 PM"}}'::jsonb,
    ARRAY['vintage', 'thrift', 'clothing', 'retro', 'uptown', 'waterloo'],
    'basic', true, false, false
  ) RETURNING id INTO biz_uptown;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, booking_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'Glow Beauty Studio', 'glow-beauty-studio',
    'Glow Beauty Studio offers premium skincare treatments, massage therapy, and beauty services in a serene Victoria Park-area space. Our team of licensed estheticians and RMTs use only clean, cruelty-free products. From relaxing facials to deep tissue massage, we help you look and feel your best. Book online — new clients get a complimentary skin consultation.',
    'Premium skincare, massage & beauty near Victoria Park',
    cat_services, '55 Queen St S', 'Kitchener', '(519) 555-0105', 'book@glowbeautykw.ca', 'https://glowbeautykw.ca', 'https://glowbeautykw.ca/book',
    'https://maps.google.com/?q=55+Queen+St+S+Kitchener+ON',
    '{"monday": {"open": "9:00 AM", "close": "7:00 PM"}, "tuesday": {"open": "9:00 AM", "close": "7:00 PM"}, "wednesday": {"open": "9:00 AM", "close": "7:00 PM"}, "thursday": {"open": "9:00 AM", "close": "8:00 PM"}, "friday": {"open": "9:00 AM", "close": "8:00 PM"}, "saturday": {"open": "10:00 AM", "close": "5:00 PM"}, "sunday": "closed"}'::jsonb,
    ARRAY['beauty', 'skincare', 'massage', 'facial', 'spa', 'kitchener'],
    'featured', true, false, false
  ) RETURNING id INTO biz_glow;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, booking_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'DTK Barbershop', 'dtk-barbershop',
    'Old-school barbershop vibes with modern cuts. DTK Barbershop has been the go-to spot for fades, beard trims, and hot towel shaves in downtown Kitchener since 2021. Walk-ins welcome, but booking ahead guarantees your spot. Cash and card accepted.',
    'Classic barbershop with modern cuts in DTK',
    cat_services, '44 Gaukel St', 'Kitchener', '(519) 555-0106', 'cuts@dtkbarbershop.ca', 'https://dtkbarbershop.ca', 'https://dtkbarbershop.ca/book',
    'https://maps.google.com/?q=44+Gaukel+St+Kitchener+ON',
    '{"monday": "closed", "tuesday": {"open": "9:00 AM", "close": "6:00 PM"}, "wednesday": {"open": "9:00 AM", "close": "6:00 PM"}, "thursday": {"open": "9:00 AM", "close": "7:00 PM"}, "friday": {"open": "9:00 AM", "close": "7:00 PM"}, "saturday": {"open": "8:00 AM", "close": "4:00 PM"}, "sunday": "closed"}'::jsonb,
    ARRAY['barbershop', 'haircut', 'fade', 'beard', 'dtk', 'kitchener'],
    'basic', true, false, false
  ) RETURNING id INTO biz_dtk;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, booking_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'Grand River Escape Rooms', 'grand-river-escape-rooms',
    'Grand River Escape Rooms features 5 uniquely themed rooms ranging from beginner to expert difficulty. Perfect for date nights, team building, or friend hangouts. Our rooms use a mix of physical puzzles, tech-driven locks, and immersive storytelling. Average escape rate: 42%. Think you can beat it? Groups of 2-8 players.',
    'Immersive escape rooms for groups of 2-8',
    cat_entertainment, '283 Duke St W', 'Kitchener', '(519) 555-0107', 'play@grandriverescape.ca', 'https://grandriverescape.ca', 'https://grandriverescape.ca/book',
    'https://maps.google.com/?q=283+Duke+St+W+Kitchener+ON',
    '{"monday": "closed", "tuesday": {"open": "4:00 PM", "close": "10:00 PM"}, "wednesday": {"open": "4:00 PM", "close": "10:00 PM"}, "thursday": {"open": "4:00 PM", "close": "10:00 PM"}, "friday": {"open": "2:00 PM", "close": "11:00 PM"}, "saturday": {"open": "10:00 AM", "close": "11:00 PM"}, "sunday": {"open": "10:00 AM", "close": "8:00 PM"}}'::jsonb,
    ARRAY['escape room', 'entertainment', 'games', 'date night', 'team building', 'kitchener'],
    'spotlight', true, false, true
  ) RETURNING id INTO biz_escape;

  INSERT INTO businesses (id, name, slug, description, short_description, category_id, address, city, phone, email, website_url, google_maps_url, hours, tags, subscription_tier, is_active, is_new, is_staff_pick)
  VALUES (
    gen_random_uuid(), 'The Boardroom Cafe', 'the-boardroom-cafe',
    'Just opened in January 2026! The Boardroom Cafe combines great coffee, local craft beer, and a library of over 800 board games. Pay $5 per person for unlimited play time, or grab a monthly membership for $15. We host weekly game nights (Tuesdays), trivia (Thursdays), and D&D sessions (Saturdays). Full food menu coming soon — for now we serve snacks, coffee, and drinks.',
    'Board game café with 800+ games — just opened!',
    cat_new, '130 King St W', 'Kitchener', '(519) 555-0108', 'play@theboardroomkw.ca', 'https://theboardroomkw.ca', 'https://maps.google.com/?q=130+King+St+W+Kitchener+ON',
    '{"monday": "closed", "tuesday": {"open": "4:00 PM", "close": "11:00 PM"}, "wednesday": {"open": "4:00 PM", "close": "11:00 PM"}, "thursday": {"open": "4:00 PM", "close": "11:00 PM"}, "friday": {"open": "2:00 PM", "close": "12:00 AM"}, "saturday": {"open": "11:00 AM", "close": "12:00 AM"}, "sunday": {"open": "11:00 AM", "close": "9:00 PM"}}'::jsonb,
    ARRAY['board games', 'cafe', 'coffee', 'beer', 'new', 'dtk', 'kitchener'],
    'featured', true, true, false
  ) RETURNING id INTO biz_boardroom;

  -- ============================================
  -- DEALS
  -- ============================================

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_settlement, '15% Off Any Latte', '15-off-any-latte',
    'Try our signature house-roasted lattes at 15% off. Choose from classic, oat milk, lavender, or seasonal specials. Valid for hot or iced.',
    'percentage', '15%', 'One per customer per visit. Cannot be combined with other offers. Show this deal on your phone at checkout.',
    'active', now(), now() + interval '30 days', true
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_burrito, 'Buy 1 Get 1 Free Tuesdays', 'bogo-tuesdays-burrito',
    'Every Tuesday, buy any regular burrito and get a second one free. Bring a friend, bring your appetite. Valid for dine-in and takeout.',
    'bogo', 'BOGO', 'Valid Tuesdays only. Second burrito must be equal or lesser value. Dine-in or takeout.',
    'active', now(), now() + interval '30 days', false
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_yeti, '20% Off All Winter Gear', '20-off-winter-gear-yeti',
    'End-of-season blowout! Get 20% off all snowboards, skis, boots, bindings, and outerwear. Shop in-store for the best selection.',
    'percentage', '20%', 'In-store only. While supplies last. Cannot be combined with other promotions.',
    'active', now(), now() + interval '30 days', true
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_uptown, '$10 Off Purchases Over $50', '10-off-50-uptown-vintage',
    'Spend $50 or more on vintage finds and get $10 off your total. New inventory every weekend — come treasure hunt with us.',
    'fixed', '$10', 'Minimum purchase of $50 before tax. One per customer. Cannot be combined with other offers.',
    'active', now(), now() + interval '30 days', false
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_glow, 'Free Facial with Any Massage', 'free-facial-with-massage-glow',
    'Book any 60 or 90-minute massage and receive a complimentary express facial (valued at $45). The ultimate relaxation combo.',
    'freebie', 'Free facial', 'Must book massage of 60 minutes or longer. Mention KW Deals when booking. Subject to availability.',
    'active', now(), now() + interval '30 days', true
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_dtk, 'First Haircut 50% Off', 'first-cut-50-off-dtk',
    'New to DTK Barbershop? Get your first haircut at half price. Includes consultation, cut, and hot towel finish.',
    'percentage', '50%', 'New customers only. Must mention KW Deals when booking or at check-in. One per customer.',
    'active', now(), now() + interval '30 days', false
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_escape, '$5 Off Per Person Weekdays', '5-off-weekday-escape-rooms',
    'Beat the weekend rush and save! Get $5 off per person on any escape room booked Tuesday through Friday. All 5 rooms available.',
    'fixed', '$5/person', 'Valid Tuesday–Friday only. Must book online using code KWDEALS. Groups of 2-8.',
    'active', now(), now() + interval '30 days', true
  );

  INSERT INTO deals (business_id, title, slug, description, deal_type, discount_value, terms, status, starts_at, expires_at, is_featured)
  VALUES (
    biz_boardroom, 'Grand Opening: Free Coffee with Board Game Rental', 'grand-opening-free-coffee-boardroom',
    'Celebrate our grand opening! Get a free drip coffee or tea with any board game table rental. Over 800 games to choose from — from classics to the latest releases.',
    'freebie', 'Free coffee', 'One free drip coffee or tea per paid table rental ($5/person). Valid during grand opening month.',
    'active', now(), now() + interval '30 days', true
  );

END $$;
