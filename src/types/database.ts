export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          created_at: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
      };
      materials: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          image_url: string;
          thumbnail_url: string | null;
          source_url: string | null;
          category_id: string | null;
          width: number | null;
          height: number | null;
          file_size: number | null;
          is_favorite: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          image_url: string;
          thumbnail_url?: string | null;
          source_url?: string | null;
          category_id?: string | null;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          is_favorite?: boolean;
          metadata?: Json;
        };
        Update: Partial<Database['public']['Tables']['materials']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          cover_url: string | null;
          status: 'active' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          cover_url?: string | null;
          status?: 'active' | 'archived';
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      moodboards: {
        Row: {
          id: string;
          project_id: string | null;
          name: string;
          width: number;
          height: number;
          background_color: string;
          created_at: string;
          updated_at: string;
        };
      };
      canvas_states: {
        Row: {
          id: string;
          moodboard_id: string | null;
          state: Json;
          version: number;
          created_at: string;
          updated_at: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          material_id: string | null;
          user_id: string | null;
          analysis_type: 'full' | 'color' | 'typography' | 'layout';
          result: Json;
          summary: string | null;
          tags_suggested: string[] | null;
          created_at: string;
        };
      };
      daily_recommendations: {
        Row: {
          id: string;
          user_id: string | null;
          material_ids: string[];
          reason: string | null;
          recommendation_date: string;
          created_at: string;
        };
      };
    };
  };
}
