export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'guide'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'guide'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'guide'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          duration_days: number
          location: string
          image_url: string | null
          max_participants: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          duration_days: number
          location: string
          image_url?: string | null
          max_participants: number
          start_date: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          duration_days?: number
          location?: string
          image_url?: string | null
          max_participants?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          tour_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          participants: number
          total_price: number
          booking_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tour_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          participants: number
          total_price: number
          booking_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tour_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          participants?: number
          total_price?: number
          booking_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          tour_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tour_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tour_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      user_role: 'user' | 'admin' | 'guide'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    }
  }
}