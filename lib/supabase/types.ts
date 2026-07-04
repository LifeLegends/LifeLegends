/**
 * PLACEHOLDER hand-written types shaped like the tables in SDD §7.4.
 *
 * Once the real Supabase project exists, replace this entire file with
 * the generated output of:
 *   supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 *
 * Nothing elsewhere should be edited when that swap happens — every
 * Supabase call in the app imports `Database` from this one file.
 */

export interface Database {
  public: {
    Tables: {
      legends: {
        Row: {
          id: string;
          slug: string;
          name: string;
          role_tags: string[];
          era_start: number | null;
          era_end: number | null;
          tagline: string | null;
          summary: string | null;
          body: string | null;
          hero_image_path: string | null;
          category_id: string | null;
          status: 'draft' | 'published';
          featured: boolean;
          view_count: number;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['legends']['Row']>;
        Update: Partial<Database['public']['Tables']['legends']['Row']>;
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          cover_image_path: string | null;
        };
        Insert: Partial<Database['public']['Tables']['categories']['Row']>;
        Update: Partial<Database['public']['Tables']['categories']['Row']>;
      };
      timeline_events: {
        Row: {
          id: string;
          legend_id: string;
          year: number;
          title: string;
          description: string | null;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['timeline_events']['Row']>;
        Update: Partial<Database['public']['Tables']['timeline_events']['Row']>;
      };
      quotes: {
        Row: {
          id: string;
          legend_id: string;
          text: string;
          context: string | null;
        };
        Insert: Partial<Database['public']['Tables']['quotes']['Row']>;
        Update: Partial<Database['public']['Tables']['quotes']['Row']>;
      };
      gallery_images: {
        Row: {
          id: string;
          legend_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['gallery_images']['Row']>;
        Update: Partial<Database['public']['Tables']['gallery_images']['Row']>;
      };
      page_views: {
        Row: {
          id: string;
          legend_id: string;
          date: string;
          count: number;
        };
        Insert: Partial<Database['public']['Tables']['page_views']['Row']>;
        Update: Partial<Database['public']['Tables']['page_views']['Row']>;
      };
    };
  };
}
