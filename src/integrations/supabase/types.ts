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
      blog_categories: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          is_published: boolean
          name_ar: string
          name_en: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_published?: boolean
          name_ar: string
          name_en: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_published?: boolean
          name_ar?: string
          name_en?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_ar: string | null
          author_bio_ar: string | null
          author_bio_en: string | null
          author_en: string | null
          author_role_ar: string | null
          author_role_en: string | null
          body: Json
          category_id: string | null
          cover_image_url: string | null
          created_at: string
          cta: Json | null
          excerpt_ar: string | null
          excerpt_en: string | null
          faq: Json
          id: string
          internal_links: Json
          keywords_ar: string[] | null
          keywords_en: string[] | null
          last_reviewed: string | null
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          published_at: string | null
          reading_minutes: number
          scheduled_unpublish_at: string | null
          section_summaries: Json
          slug: string
          sources: Json
          status: string
          table_of_contents_ar: Json
          table_of_contents_en: Json
          title_ar: string
          title_en: string
          tldr_ar: string[]
          tldr_en: string[]
          updated_at: string
        }
        Insert: {
          author_ar?: string | null
          author_bio_ar?: string | null
          author_bio_en?: string | null
          author_en?: string | null
          author_role_ar?: string | null
          author_role_en?: string | null
          body?: Json
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta?: Json | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          faq?: Json
          id?: string
          internal_links?: Json
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed?: string | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          published_at?: string | null
          reading_minutes?: number
          scheduled_unpublish_at?: string | null
          section_summaries?: Json
          slug: string
          sources?: Json
          status?: string
          table_of_contents_ar?: Json
          table_of_contents_en?: Json
          title_ar: string
          title_en: string
          tldr_ar?: string[]
          tldr_en?: string[]
          updated_at?: string
        }
        Update: {
          author_ar?: string | null
          author_bio_ar?: string | null
          author_bio_en?: string | null
          author_en?: string | null
          author_role_ar?: string | null
          author_role_en?: string | null
          body?: Json
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          cta?: Json | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          faq?: Json
          id?: string
          internal_links?: Json
          keywords_ar?: string[] | null
          keywords_en?: string[] | null
          last_reviewed?: string | null
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          published_at?: string | null
          reading_minutes?: number
          scheduled_unpublish_at?: string | null
          section_summaries?: Json
          slug?: string
          sources?: Json
          status?: string
          table_of_contents_ar?: Json
          table_of_contents_en?: Json
          title_ar?: string
          title_en?: string
          tldr_ar?: string[]
          tldr_en?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          post_id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          post_id: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          post_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "blog_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          form_name: string
          id: string
          is_archived: boolean
          is_read: boolean
          locale: string | null
          payload: Json
          source_page: string | null
        }
        Insert: {
          created_at?: string
          form_name: string
          id?: string
          is_archived?: boolean
          is_read?: boolean
          locale?: string | null
          payload: Json
          source_page?: string | null
        }
        Update: {
          created_at?: string
          form_name?: string
          id?: string
          is_archived?: boolean
          is_read?: boolean
          locale?: string | null
          payload?: Json
          source_page?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          highlights_ar: Json
          highlights_en: Json
          icon: string
          id: string
          intro_ar: string | null
          intro_en: string | null
          is_published: boolean
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image_url: string | null
          scheduled_publish_at: string | null
          scheduled_unpublish_at: string | null
          slug: string
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          icon?: string
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug: string
          sort_order?: number
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          icon?: string
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          city_ar: string
          city_en: string
          created_at: string
          description_ar: string | null
          description_en: string | null
          highlights_ar: Json
          highlights_en: Json
          id: string
          intro_ar: string | null
          intro_en: string | null
          is_published: boolean
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image_url: string | null
          region_ar: string | null
          region_en: string | null
          scheduled_publish_at: string | null
          scheduled_unpublish_at: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          city_ar: string
          city_en: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          region_ar?: string | null
          region_en?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          city_ar?: string
          city_en?: string
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          region_ar?: string | null
          region_en?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          filename: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          filename: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          filename?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          best_for_ar: string | null
          best_for_en: string | null
          created_at: string
          cta_href: string
          icon: string
          id: string
          includes_ar: Json
          includes_en: Json
          is_popular: boolean
          is_published: boolean
          name_ar: string
          name_en: string
          original_price_sar: number
          price_sar: number
          slug: string
          sort_order: number
          tagline_ar: string | null
          tagline_en: string | null
          updated_at: string
        }
        Insert: {
          best_for_ar?: string | null
          best_for_en?: string | null
          created_at?: string
          cta_href?: string
          icon?: string
          id?: string
          includes_ar?: Json
          includes_en?: Json
          is_popular?: boolean
          is_published?: boolean
          name_ar: string
          name_en: string
          original_price_sar?: number
          price_sar?: number
          slug: string
          sort_order?: number
          tagline_ar?: string | null
          tagline_en?: string | null
          updated_at?: string
        }
        Update: {
          best_for_ar?: string | null
          best_for_en?: string | null
          created_at?: string
          cta_href?: string
          icon?: string
          id?: string
          includes_ar?: Json
          includes_en?: Json
          is_popular?: boolean
          is_published?: boolean
          name_ar?: string
          name_en?: string
          original_price_sar?: number
          price_sar?: number
          slug?: string
          sort_order?: number
          tagline_ar?: string | null
          tagline_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          page_id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          page_id: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          page_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "page_revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          device: string | null
          id: number
          locale: string | null
          page_slug: string
          path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          device?: string | null
          id?: number
          locale?: string | null
          page_slug: string
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          device?: string | null
          id?: number
          locale?: string | null
          page_slug?: string
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          blocks: Json
          canonical_url: string | null
          created_at: string
          created_by: string | null
          id: string
          json_ld: Json | null
          keywords: string[] | null
          locale: string
          meta_description: string | null
          meta_title: string | null
          no_index: boolean
          og_image_url: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          parent_slug: string | null
          published_at: string | null
          scheduled_publish_at: string | null
          scheduled_unpublish_at: string | null
          slug: string
          status: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          json_ld?: Json | null
          keywords?: string[] | null
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          no_index?: boolean
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          parent_slug?: string | null
          published_at?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          blocks?: Json
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          json_ld?: Json | null
          keywords?: string[] | null
          locale?: string
          meta_description?: string | null
          meta_title?: string | null
          no_index?: boolean
          og_image_url?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          parent_slug?: string | null
          published_at?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      seo_audit_reports: {
        Row: {
          details: Json
          id: string
          ran_at: string
          summary: Json
          total_errors: number
          total_pages: number
          total_warnings: number
        }
        Insert: {
          details?: Json
          id?: string
          ran_at?: string
          summary?: Json
          total_errors?: number
          total_pages?: number
          total_warnings?: number
        }
        Update: {
          details?: Json
          id?: string
          ran_at?: string
          summary?: Json
          total_errors?: number
          total_pages?: number
          total_warnings?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          highlights_ar: Json
          highlights_en: Json
          icon: string
          id: string
          intro_ar: string | null
          intro_en: string | null
          is_published: boolean
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image_url: string | null
          scheduled_publish_at: string | null
          scheduled_unpublish_at: string | null
          slug: string
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          icon?: string
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug: string
          sort_order?: number
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          icon?: string
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          scheduled_publish_at?: string | null
          scheduled_unpublish_at?: string | null
          slug?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_blocks: {
        Row: {
          block_type: string
          created_at: string
          data: Json
          id: string
          key: string
          label: string
          locale: string | null
          updated_at: string
        }
        Insert: {
          block_type: string
          created_at?: string
          data?: Json
          id?: string
          key: string
          label: string
          locale?: string | null
          updated_at?: string
        }
        Update: {
          block_type?: string
          created_at?: string
          data?: Json
          id?: string
          key?: string
          label?: string
          locale?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          data: Json
          description: string | null
          id: string
          key: string
          label: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          key: string
          label: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          description?: string | null
          id?: string
          key?: string
          label?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      sub_industries: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          highlights_ar: Json
          highlights_en: Json
          id: string
          industry_id: string
          intro_ar: string | null
          intro_en: string | null
          is_published: boolean
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image_url: string | null
          slug: string
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          industry_id: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          slug: string
          sort_order?: number
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          industry_id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          slug?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_services: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          highlights_ar: Json
          highlights_en: Json
          id: string
          intro_ar: string | null
          intro_en: string | null
          is_published: boolean
          meta_description_ar: string | null
          meta_description_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          og_image_url: string | null
          service_id: string
          slug: string
          sort_order: number
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          service_id: string
          slug: string
          sort_order?: number
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          highlights_ar?: Json
          highlights_en?: Json
          id?: string
          intro_ar?: string | null
          intro_en?: string | null
          is_published?: boolean
          meta_description_ar?: string | null
          meta_description_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          og_image_url?: string | null
          service_id?: string
          slug?: string
          sort_order?: number
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_scheduled_publishing: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      page_status: "draft" | "published" | "archived"
      page_type:
        | "home"
        | "about"
        | "contact"
        | "service"
        | "service_sub"
        | "industry"
        | "industry_sub"
        | "location"
        | "case_studies"
        | "custom"
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
      app_role: ["admin", "editor", "viewer"],
      page_status: ["draft", "published", "archived"],
      page_type: [
        "home",
        "about",
        "contact",
        "service",
        "service_sub",
        "industry",
        "industry_sub",
        "location",
        "case_studies",
        "custom",
      ],
    },
  },
} as const
