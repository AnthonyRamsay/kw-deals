export type SubscriptionTier = "basic" | "featured" | "spotlight";
export type DealStatus = "draft" | "active" | "expired" | "archived";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "unpaid"
  | "paused";
export type UserRole = "viewer" | "admin" | "super_admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          email?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category_id: string;
          address: string | null;
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          phone: string | null;
          email: string | null;
          website_url: string | null;
          booking_url: string | null;
          google_maps_url: string | null;
          hours: Record<string, { open: string; close: string } | null> | null;
          photos: string[];
          logo_url: string | null;
          cover_image_url: string | null;
          subscription_tier: SubscriptionTier;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          is_active: boolean;
          is_new: boolean;
          is_staff_pick: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category_id: string;
          address?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          booking_url?: string | null;
          google_maps_url?: string | null;
          hours?: Record<string, { open: string; close: string } | null> | null;
          photos?: string[];
          logo_url?: string | null;
          cover_image_url?: string | null;
          subscription_tier?: SubscriptionTier;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          is_active?: boolean;
          is_new?: boolean;
          is_staff_pick?: boolean;
          tags?: string[];
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string;
          address?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          booking_url?: string | null;
          google_maps_url?: string | null;
          hours?: Record<string, { open: string; close: string } | null> | null;
          photos?: string[];
          logo_url?: string | null;
          cover_image_url?: string | null;
          subscription_tier?: SubscriptionTier;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          is_active?: boolean;
          is_new?: boolean;
          is_staff_pick?: boolean;
          tags?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      deals: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          slug: string;
          description: string | null;
          deal_type: string | null;
          discount_value: string | null;
          terms: string | null;
          image_url: string | null;
          status: DealStatus;
          starts_at: string | null;
          expires_at: string | null;
          is_featured: boolean;
          click_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          slug: string;
          description?: string | null;
          deal_type?: string | null;
          discount_value?: string | null;
          terms?: string | null;
          image_url?: string | null;
          status?: DealStatus;
          starts_at?: string | null;
          expires_at?: string | null;
          is_featured?: boolean;
          click_count?: number;
        };
        Update: {
          business_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          deal_type?: string | null;
          discount_value?: string | null;
          terms?: string | null;
          image_url?: string | null;
          status?: DealStatus;
          starts_at?: string | null;
          expires_at?: string | null;
          is_featured?: boolean;
          click_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "deals_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          business_id: string;
          status: SubscriptionStatus;
          price_id: string;
          tier: SubscriptionTier;
          quantity: number;
          cancel_at_period_end: boolean;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
          ended_at: string | null;
          canceled_at: string | null;
          trial_start: string | null;
          trial_end: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id: string;
          business_id: string;
          status: SubscriptionStatus;
          price_id: string;
          tier: SubscriptionTier;
          quantity?: number;
          cancel_at_period_end?: boolean;
          current_period_start: string;
          current_period_end: string;
          ended_at?: string | null;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          status?: SubscriptionStatus;
          tier?: SubscriptionTier;
          cancel_at_period_end?: boolean;
          current_period_start?: string;
          current_period_end?: string;
          ended_at?: string | null;
          canceled_at?: string | null;
          metadata?: Record<string, unknown>;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          }
        ];
      };
      email_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          is_confirmed: boolean;
          confirmation_token: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          is_confirmed?: boolean;
          confirmation_token?: string | null;
          source?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          is_confirmed?: boolean;
          confirmation_token?: string | null;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          business_id: string | null;
          deal_id: string | null;
          metadata: Record<string, unknown>;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          business_id?: string | null;
          deal_id?: string | null;
          metadata?: Record<string, unknown>;
          session_id?: string | null;
        };
        Update: {
          event_type?: string;
          metadata?: Record<string, unknown>;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "analytics_events_deal_id_fkey";
            columns: ["deal_id"];
            isOneToOne: false;
            referencedRelation: "deals";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      subscription_tier: SubscriptionTier;
      deal_status: DealStatus;
      subscription_status: SubscriptionStatus;
    };
  };
}
