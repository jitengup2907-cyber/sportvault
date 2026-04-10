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
      academies: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          sport_focus: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          sport_focus?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          sport_focus?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      academy_members: {
        Row: {
          academy_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          academy_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          academy_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_members_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          academy_id: string
          clauses: string | null
          contract_text: string | null
          contract_type: string
          created_at: string
          created_by: string
          end_date: string | null
          id: string
          party_a: string
          party_b: string
          salary_amount: number | null
          salary_currency: string | null
          sport: string | null
          start_date: string | null
          status: string
          terms: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          clauses?: string | null
          contract_text?: string | null
          contract_type: string
          created_at?: string
          created_by: string
          end_date?: string | null
          id?: string
          party_a: string
          party_b: string
          salary_amount?: number | null
          salary_currency?: string | null
          sport?: string | null
          start_date?: string | null
          status?: string
          terms?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          clauses?: string | null
          contract_text?: string | null
          contract_type?: string
          created_at?: string
          created_by?: string
          end_date?: string | null
          id?: string
          party_a?: string
          party_b?: string
          salary_amount?: number | null
          salary_currency?: string | null
          sport?: string | null
          start_date?: string | null
          status?: string
          terms?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      finances: {
        Row: {
          academy_id: string
          amount: number
          category: string
          created_at: string
          created_by: string
          currency: string | null
          description: string | null
          id: string
          player_id: string | null
          status: string | null
          transaction_date: string
          type: string
        }
        Insert: {
          academy_id: string
          amount: number
          category: string
          created_at?: string
          created_by: string
          currency?: string | null
          description?: string | null
          id?: string
          player_id?: string | null
          status?: string | null
          transaction_date?: string
          type: string
        }
        Update: {
          academy_id?: string
          amount?: number
          category?: string
          created_at?: string
          created_by?: string
          currency?: string | null
          description?: string | null
          id?: string
          player_id?: string | null
          status?: string | null
          transaction_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "finances_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finances_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      injuries: {
        Row: {
          academy_id: string
          actual_return: string | null
          body_part: string | null
          created_at: string
          created_by: string
          expected_return: string | null
          id: string
          injury_date: string
          injury_type: string
          medical_clearance: boolean | null
          player_id: string | null
          player_name: string
          severity: string | null
          sport: string | null
          status: string
          treatment_notes: string | null
          updated_at: string
        }
        Insert: {
          academy_id: string
          actual_return?: string | null
          body_part?: string | null
          created_at?: string
          created_by: string
          expected_return?: string | null
          id?: string
          injury_date?: string
          injury_type: string
          medical_clearance?: boolean | null
          player_id?: string | null
          player_name: string
          severity?: string | null
          sport?: string | null
          status?: string
          treatment_notes?: string | null
          updated_at?: string
        }
        Update: {
          academy_id?: string
          actual_return?: string | null
          body_part?: string | null
          created_at?: string
          created_by?: string
          expected_return?: string | null
          id?: string
          injury_date?: string
          injury_type?: string
          medical_clearance?: boolean | null
          player_id?: string | null
          player_name?: string
          severity?: string | null
          sport?: string | null
          status?: string
          treatment_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "injuries_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "injuries_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_reports: {
        Row: {
          academy_id: string
          coach_id: string
          created_at: string
          formation: string | null
          id: string
          key_players: string | null
          match_date: string
          opponent_name: string
          possession: string | null
          report_text: string
          result: string
          score_opponent: string | null
          score_own: string | null
          sport: string
          tactical_notes: string | null
          team_name: string
          template_id: string | null
          tone: string | null
          venue: string | null
        }
        Insert: {
          academy_id: string
          coach_id: string
          created_at?: string
          formation?: string | null
          id?: string
          key_players?: string | null
          match_date?: string
          opponent_name: string
          possession?: string | null
          report_text: string
          result?: string
          score_opponent?: string | null
          score_own?: string | null
          sport: string
          tactical_notes?: string | null
          team_name: string
          template_id?: string | null
          tone?: string | null
          venue?: string | null
        }
        Update: {
          academy_id?: string
          coach_id?: string
          created_at?: string
          formation?: string | null
          id?: string
          key_players?: string | null
          match_date?: string
          opponent_name?: string
          possession?: string | null
          report_text?: string
          result?: string
          score_opponent?: string | null
          score_own?: string | null
          sport?: string
          tactical_notes?: string | null
          team_name?: string
          template_id?: string | null
          tone?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_reports_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          academy_id: string
          age: number | null
          created_at: string
          id: string
          name: string
          notes: string | null
          parent_email: string | null
          parent_phone: string | null
          position: string | null
          sport: string
          updated_at: string
        }
        Insert: {
          academy_id: string
          age?: number | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          position?: string | null
          sport: string
          updated_at?: string
        }
        Update: {
          academy_id?: string
          age?: number | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          parent_email?: string | null
          parent_phone?: string | null
          position?: string | null
          sport?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          academy_id: string
          coach_id: string
          created_at: string
          id: string
          period_label: string
          player_id: string | null
          player_name: string
          ratings: Json | null
          report_text: string
          report_type: string
          sport: string
          template_id: string | null
          tone: string | null
        }
        Insert: {
          academy_id: string
          coach_id: string
          created_at?: string
          id?: string
          period_label: string
          player_id?: string | null
          player_name: string
          ratings?: Json | null
          report_text: string
          report_type?: string
          sport: string
          template_id?: string | null
          tone?: string | null
        }
        Update: {
          academy_id?: string
          coach_id?: string
          created_at?: string
          id?: string
          period_label?: string
          player_id?: string | null
          player_name?: string
          ratings?: Json | null
          report_text?: string
          report_type?: string
          sport?: string
          template_id?: string | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_reports: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          player_name: string
          report_id: string
          share_token: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          player_name: string
          report_id: string
          share_token?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          player_name?: string
          report_id?: string
          share_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          academy_id: string
          created_at: string
          created_by: string
          end_date: string | null
          format: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          sport: string
          standings: Json | null
          start_date: string
          status: string
          teams: Json | null
        }
        Insert: {
          academy_id: string
          created_at?: string
          created_by: string
          end_date?: string | null
          format?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          sport: string
          standings?: Json | null
          start_date: string
          status?: string
          teams?: Json | null
        }
        Update: {
          academy_id?: string
          created_at?: string
          created_by?: string
          end_date?: string | null
          format?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          sport?: string
          standings?: Json | null
          start_date?: string
          status?: string
          teams?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          academy_id: string
          attendance: Json | null
          coach_id: string
          created_at: string
          drills: Json | null
          duration_minutes: number | null
          id: string
          notes: string | null
          objectives: string | null
          session_date: string
          sport: string
          title: string
        }
        Insert: {
          academy_id: string
          attendance?: Json | null
          coach_id: string
          created_at?: string
          drills?: Json | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          objectives?: string | null
          session_date?: string
          sport: string
          title: string
        }
        Update: {
          academy_id?: string
          attendance?: Json | null
          coach_id?: string
          created_at?: string
          drills?: Json | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          objectives?: string | null
          session_date?: string
          sport?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_academy_id_fkey"
            columns: ["academy_id"]
            isOneToOne: false
            referencedRelation: "academies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_academy_member: {
        Args: { _academy_id: string; _user_id: string }
        Returns: boolean
      }
      is_academy_owner: {
        Args: { _academy_id: string; _user_id: string }
        Returns: boolean
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
