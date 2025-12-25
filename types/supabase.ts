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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      card_drafts: {
        Row: {
          content: string | null
          created_at: string | null
          envelope_id: string | null
          font_style: string | null
          id: string
          image: string | null
          music_id: string | null
          photos: Json
          recipient_email: string | null
          recipient_name: string | null
          sender_name: string | null
          signature_data: string | null
          stamp_id: string | null
          template_id: string | null
          text_align: string | null
          updated_at: string | null
          user_id: string
          // ✅ Step 4: Photo Frame support
          frame_id: string | null
          photo_slots: Json | null
          // ✅ Envelope customization
          envelope_pattern: string | null
          envelope_pattern_color: string | null
          envelope_pattern_intensity: number | null
          envelope_seal_design: string | null
          envelope_seal_color: string | null
          envelope_liner_pattern_type: string | null
          envelope_liner_color: string | null
          // ✅ Rich content support
          rich_content: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          envelope_id?: string | null
          font_style?: string | null
          id?: string
          image?: string | null
          music_id?: string | null
          photos?: Json
          recipient_email?: string | null
          recipient_name?: string | null
          sender_name?: string | null
          signature_data?: string | null
          stamp_id?: string | null
          template_id?: string | null
          text_align?: string | null
          updated_at?: string | null
          user_id: string
          // ✅ Step 4: Photo Frame support
          frame_id?: string | null
          photo_slots?: Json | null
          // ✅ Envelope customization
          envelope_pattern?: string | null
          envelope_pattern_color?: string | null
          envelope_pattern_intensity?: number | null
          envelope_seal_design?: string | null
          envelope_seal_color?: string | null
          envelope_liner_pattern_type?: string | null
          envelope_liner_color?: string | null
          // ✅ Rich content support
          rich_content?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          envelope_id?: string | null
          font_style?: string | null
          id?: string
          image?: string | null
          music_id?: string | null
          photos?: Json
          recipient_email?: string | null
          recipient_name?: string | null
          sender_name?: string | null
          signature_data?: string | null
          stamp_id?: string | null
          template_id?: string | null
          text_align?: string | null
          updated_at?: string | null
          user_id?: string
          // ✅ Step 4: Photo Frame support
          frame_id?: string | null
          photo_slots?: Json | null
          // ✅ Envelope customization
          envelope_pattern?: string | null
          envelope_pattern_color?: string | null
          envelope_pattern_intensity?: number | null
          envelope_seal_design?: string | null
          envelope_seal_color?: string | null
          envelope_liner_pattern_type?: string | null
          envelope_liner_color?: string | null
          // ✅ Rich content support
          rich_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_drafts_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "envelopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_drafts_music_id_fkey"
            columns: ["music_id"]
            isOneToOne: false
            referencedRelation: "music"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_drafts_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_drafts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_drafts_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "photo_frames"
            referencedColumns: ["id"]
          },
        ]
      }
      card_templates: {
        Row: {
          animation_type: string | null
          category: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          points_required: number | null
          preview_url: string | null
          thumbnail: string
        }
        Insert: {
          animation_type?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          points_required?: number | null
          preview_url?: string | null
          thumbnail: string
        }
        Update: {
          animation_type?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          points_required?: number | null
          preview_url?: string | null
          thumbnail?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          content: string
          created_at: string | null
          envelope_color: string | null
          envelope_id: string | null
          font_style: string | null
          id: string
          images: string[] | null
          music_id: string | null
          photos: string[] | null
          recipient_email: string | null
          recipient_name: string
          sender_name: string | null
          sent_at: string | null
          signature_data: string | null
          signature_url: string | null
          stamp_id: string | null
          status: string | null
          template_id: string | null
          text_effect: string | null
          user_id: string | null
          view_count: number | null
          wax_color: string | null
          // ✅ Step 4: Photo Frame support
          frame_id: string | null
          photo_slots: Json | null
          // ✅ Envelope customization
          envelope_pattern: string | null
          envelope_pattern_color: string | null
          envelope_pattern_intensity: number | null
          envelope_seal_design: string | null
          envelope_seal_color: string | null
          envelope_liner_pattern_type: string | null
          envelope_liner_color: string | null
          // ✅ Rich content support
          rich_content: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          envelope_color?: string | null
          envelope_id?: string | null
          font_style?: string | null
          id?: string
          images?: string[] | null
          music_id?: string | null
          photos?: string[] | null
          recipient_email?: string | null
          recipient_name: string
          sender_name?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signature_url?: string | null
          stamp_id?: string | null
          status?: string | null
          template_id?: string | null
          text_effect?: string | null
          user_id?: string | null
          view_count?: number | null
          wax_color?: string | null
          // ✅ Step 4: Photo Frame support
          frame_id?: string | null
          photo_slots?: Json | null
          // ✅ Envelope customization
          envelope_pattern?: string | null
          envelope_pattern_color?: string | null
          envelope_pattern_intensity?: number | null
          envelope_seal_design?: string | null
          envelope_seal_color?: string | null
          envelope_liner_pattern_type?: string | null
          envelope_liner_color?: string | null
          // ✅ Rich content support
          rich_content?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          envelope_color?: string | null
          envelope_id?: string | null
          font_style?: string | null
          id?: string
          images?: string[] | null
          music_id?: string | null
          photos?: string[] | null
          recipient_email?: string | null
          recipient_name?: string
          sender_name?: string | null
          sent_at?: string | null
          signature_data?: string | null
          signature_url?: string | null
          stamp_id?: string | null
          status?: string | null
          template_id?: string | null
          text_effect?: string | null
          user_id?: string | null
          view_count?: number | null
          wax_color?: string | null
          // ✅ Step 4: Photo Frame support
          frame_id?: string | null
          photo_slots?: Json | null
          // ✅ Envelope customization
          envelope_pattern?: string | null
          envelope_pattern_color?: string | null
          envelope_pattern_intensity?: number | null
          envelope_seal_design?: string | null
          envelope_seal_color?: string | null
          envelope_liner_pattern_type?: string | null
          envelope_liner_color?: string | null
          // ✅ Rich content support
          rich_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_envelope_id_fkey"
            columns: ["envelope_id"]
            isOneToOne: false
            referencedRelation: "envelopes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_music_id_fkey"
            columns: ["music_id"]
            isOneToOne: false
            referencedRelation: "music"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_stamp_id_fkey"
            columns: ["stamp_id"]
            isOneToOne: false
            referencedRelation: "stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "card_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_frame_id_fkey"
            columns: ["frame_id"]
            isOneToOne: false
            referencedRelation: "photo_frames"
            referencedColumns: ["id"]
          },
        ]
      }
      code_redemptions: {
        Row: {
          code_id: string | null
          id: string
          points_received: number
          redeemed_at: string | null
          user_id: string | null
        }
        Insert: {
          code_id?: string | null
          id?: string
          points_received: number
          redeemed_at?: string | null
          user_id?: string | null
        }
        Update: {
          code_id?: string | null
          id?: string
          points_received?: number
          redeemed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      envelopes: {
        Row: {
          color: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          points_required: number | null
          texture: string | null
          thumbnail: string
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_required?: number | null
          texture?: string | null
          thumbnail: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_required?: number | null
          texture?: string | null
          thumbnail?: string
        }
        Relationships: []
      }
      music: {
        Row: {
          category: string | null
          created_at: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          name: string
          points_required: number | null
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          points_required?: number | null
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_required?: number | null
          url?: string
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          tym: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          tym?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          tym?: number
        }
        Relationships: []
      }
      promo_code_uses: {
        Row: {
          id: string
          promo_code_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          promo_code_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          promo_code_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          expires_at: string
          id: string
          is_active: boolean | null
          max_uses: number
          points: number
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          max_uses: number
          points: number
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stamps: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          points_required: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
          points_required?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          points_required?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          points: number | null
          provider: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          points?: number | null
          provider?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          points?: number | null
          provider?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_card_view: { Args: { card_id: string }; Returns: undefined }
      use_promo_code: {
        Args: { p_code_id: string; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
