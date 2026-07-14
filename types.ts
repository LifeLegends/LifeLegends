/**
 * Hand-written types matching the actual schema created by
 * supabase/migrations/0001_init.sql through 0006_full_biography.sql.
 *
 * Once the real Supabase project exists, this can be replaced with the
 * generated output of:
 *   supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 * Nothing elsewhere needs to change when that swap happens — every
 * Supabase call in the app imports `Database` from this one file.
 */

export interface Database {
  public: {
    Tables: {
      biographies: {
        Row: {
          id: string;
          slug: string;
          name: string;
          roles: string[];
          birth_year: number | null;
          death_year: number | null;
          nationality: string | null;
          profession: string | null;
          tagline: string | null;
          intro: string | null;
          full_biography: string | null;
          hero_image_path: string | null;
          hero_image_alt: string | null;
          hero_image_caption: string | null;
          thumbnail_path: string | null;
          overview_title: string | null;
          overview: string[];
          stats: { value: number | string; label: string }[];
          featured: boolean;
          view_count: number;
          status: 'draft' | 'published';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['biographies']['Row']>;
        Update: Partial<Database['public']['Tables']['biographies']['Row']>;
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          cover_image_path: string | null;
          cover_image_alt: string | null;
          sort_order: number;
          status: 'active' | 'disabled';
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          og_image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['categories']['Row']>;
        Update: Partial<Database['public']['Tables']['categories']['Row']>;
      };
      biography_categories: {
        Row: {
          biography_id: string;
          category_id: string;
          is_primary: boolean;
        };
        Insert: Partial<Database['public']['Tables']['biography_categories']['Row']>;
        Update: Partial<Database['public']['Tables']['biography_categories']['Row']>;
      };
      timeline_events: {
        Row: {
          id: string;
          biography_id: string;
          year: number;
          title: string;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['timeline_events']['Row']>;
        Update: Partial<Database['public']['Tables']['timeline_events']['Row']>;
      };
      achievements: {
        Row: {
          id: string;
          biography_id: string;
          counter: string;
          title: string;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['achievements']['Row']>;
        Update: Partial<Database['public']['Tables']['achievements']['Row']>;
      };
      quotes: {
        Row: {
          id: string;
          biography_id: string;
          text: string;
          attribution: string;
          featured: boolean;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['quotes']['Row']>;
        Update: Partial<Database['public']['Tables']['quotes']['Row']>;
      };
      gallery_images: {
        Row: {
          id: string;
          biography_id: string;
          storage_path: string;
          alt_text: string;
          caption: string | null;
          title: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['gallery_images']['Row']>;
        Update: Partial<Database['public']['Tables']['gallery_images']['Row']>;
      };
      facts: {
        Row: {
          id: string;
          biography_id: string;
          summary: string;
          expand: string;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['facts']['Row']>;
        Update: Partial<Database['public']['Tables']['facts']['Row']>;
      };
      sources: {
        Row: {
          id: string;
          biography_id: string;
          name: string;
          description: string | null;
          url: string | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['sources']['Row']>;
        Update: Partial<Database['public']['Tables']['sources']['Row']>;
      };
      seo_metadata: {
        Row: {
          id: string;
          biography_id: string;
          meta_title: string | null;
          meta_description: string | null;
          canonical_path: string | null;
          og_image_path: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['seo_metadata']['Row']>;
        Update: Partial<Database['public']['Tables']['seo_metadata']['Row']>;
      };
      users: {
        Row: {
          id: string;
          display_name: string | null;
          role: 'admin' | 'editor';
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['users']['Row']>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      bookmarks: {
        Row: {
          user_id: string;
          biography_id: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['bookmarks']['Row']>;
        Update: Partial<Database['public']['Tables']['bookmarks']['Row']>;
      };
      page_views: {
        Row: {
          id: string;
          biography_id: string;
          viewed_on: string;
          count: number;
        };
        Insert: Partial<Database['public']['Tables']['page_views']['Row']>;
        Update: Partial<Database['public']['Tables']['page_views']['Row']>;
      };
      tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['tags']['Row']>;
        Update: Partial<Database['public']['Tables']['tags']['Row']>;
      };
      biography_tags: {
        Row: {
          biography_id: string;
          tag_id: string;
        };
        Insert: Partial<Database['public']['Tables']['biography_tags']['Row']>;
        Update: Partial<Database['public']['Tables']['biography_tags']['Row']>;
      };
    };
  };
}
