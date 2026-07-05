export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          auth_uid: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          auth_uid?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          customer_id: string | null
          guest_count: number | null
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          nights: number | null
          notes: string | null
          source: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          villa_id: string
          villa_name: string | null
          whatsapp_message: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          customer_id?: string | null
          guest_count?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          nights?: number | null
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          villa_id: string
          villa_name?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          customer_id?: string | null
          guest_count?: number | null
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          nights?: number | null
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          villa_id?: string
          villa_name?: string | null
          whatsapp_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          favorite_villa_id: string | null
          id: string
          last_booking_at: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          total_bookings: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          favorite_villa_id?: string | null
          id?: string
          last_booking_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          total_bookings?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          favorite_villa_id?: string | null
          id?: string
          last_booking_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          total_bookings?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_favorite_villa_id_fkey"
            columns: ["favorite_villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_cover: boolean
          sort_order: number
          villa_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_cover?: boolean
          sort_order?: number
          villa_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_cover?: boolean
          sort_order?: number
          villa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          },
        ]
      }
      owners: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["owner_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["owner_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["owner_status"]
          updated_at?: string
        }
        Relationships: []
      }
      villas: {
        Row: {
          bathrooms: number | null
          bedrooms: number | null
          booking_notes: string | null
          capacity: number
          category: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          description: string | null
          facilities: Json | null
          featured_order: number | null
          google_maps: string | null
          id: string
          is_featured: boolean
          location: string | null
          meta_description: string | null
          minimum_stay: number | null
          name: string
          og_image_url: string | null
          owner_id: string | null
          price: number
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["villa_status"]
          updated_at: string
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          booking_notes?: string | null
          capacity: number
          category?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          description?: string | null
          facilities?: Json | null
          featured_order?: number | null
          google_maps?: string | null
          id?: string
          is_featured?: boolean
          location?: string | null
          meta_description?: string | null
          minimum_stay?: number | null
          name: string
          og_image_url?: string | null
          owner_id?: string | null
          price: number
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["villa_status"]
          updated_at?: string
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          booking_notes?: string | null
          capacity?: number
          category?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          description?: string | null
          facilities?: Json | null
          featured_order?: number | null
          google_maps?: string | null
          id?: string
          is_featured?: boolean
          location?: string | null
          meta_description?: string | null
          minimum_stay?: number | null
          name?: string
          og_image_url?: string | null
          owner_id?: string | null
          price?: number
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["villa_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "villas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      website_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string | null
          guest_city: string | null
          guest_name: string
          id: string
          rating: number | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
          villa_id: string | null
          villa_name: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          guest_city?: string | null
          guest_name: string
          id?: string
          rating?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          villa_id?: string | null
          villa_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          guest_city?: string | null
          guest_name?: string
          id?: string
          rating?: number | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          villa_id?: string | null
          villa_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_villa_id_fkey"
            columns: ["villa_id"]
            isOneToOne: false
            referencedRelation: "villas"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          published_at: string | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_by_email: {
        Args: { user_email: string }
        Returns: {
          admin_id: string
          admin_name: string
          admin_role: Database["public"]["Enums"]["admin_role"]
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      link_admin_auth: {
        Args: { admin_id: string; auth_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "superadmin" | "admin"
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "new"
        | "pending_confirmation"
        | "checked_in"
      owner_status: "active" | "inactive"
      villa_status: "active" | "inactive" | "draft" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["superadmin", "admin"],
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "new",
        "pending_confirmation",
        "checked_in",
      ],
      owner_status: ["active", "inactive"],
      villa_status: ["active", "inactive", "draft", "archived"],
    },
  },
} as const
