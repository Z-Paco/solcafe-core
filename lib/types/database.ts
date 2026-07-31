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
          display_name: string | null;
          username: string | null;
          bio: string | null;
          avatar_url: string | null;
          primary_role: string | null;
          secondary_role: string | null;
          role_level: number | null;
          role_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          primary_role?: string | null;
          secondary_role?: string | null;
          role_level?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          username?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          primary_role?: string | null;
          secondary_role?: string | null;
          role_level?: number | null;
          role_id?: number | null;
          updated_at?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          description: string;
          slug: string;
          content_type: "art" | "engineering" | "news";
          image_url: string | null;
          user_id: string;
          published: boolean;
          tags: string[] | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          slug: string;
          content_type: "art" | "engineering" | "news";
          image_url?: string | null;
          user_id: string;
          published?: boolean;
          tags?: string[] | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          slug?: string;
          content_type?: "art" | "engineering" | "news";
          image_url?: string | null;
          user_id?: string;
          published?: boolean;
          tags?: string[] | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
}
