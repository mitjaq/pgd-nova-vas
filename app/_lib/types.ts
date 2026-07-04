export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          image_url: string | null;
          published_at: string;
          created_at: string;
          author: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          image_url?: string | null;
          published_at?: string;
          created_at?: string;
          author?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          image_url?: string | null;
          published_at?: string;
          created_at?: string;
          author?: string;
          published?: boolean;
        };
        Relationships: [];
      };
      interventions: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          location: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          date: string;
          location: string;
          type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          location?: string;
          type?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          url: string;
          caption: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          caption?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          caption?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          created_at?: string;
          read?: boolean;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          type: string;
          date: string;
          time_slot: string | null;
          name: string;
          email: string;
          phone: string;
          purpose: string;
          notes: string | null;
          status: string;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          date: string;
          time_slot?: string | null;
          name: string;
          email: string;
          phone: string;
          purpose: string;
          notes?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          date?: string;
          time_slot?: string | null;
          name?: string;
          email?: string;
          phone?: string;
          purpose?: string;
          notes?: string | null;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Intervention = Database["public"]["Tables"]["interventions"]["Row"];
export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
