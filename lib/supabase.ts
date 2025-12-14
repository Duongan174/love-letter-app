import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Database helper functions
export const db = {
  // USERS
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // CARDS
  async getUserCards(userId: string) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async createCard(card: any) {
    const { data, error } = await supabase
      .from('cards')
      .insert([card])
      .select()
      .single();
    return { data, error };
  },

  async getCard(id: string) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // TEMPLATES
  async getTemplates() {
    const { data, error } = await supabase
      .from('card_templates')
      .select('*')
      .eq('is_active', true);
    return { data: data || [], error };
  },

  // ENVELOPES
  async getEnvelopes() {
    const { data, error } = await supabase
      .from('envelopes')
      .select('*')
      .eq('is_active', true);
    return { data: data || [], error };
  },

  // STAMPS
  async getStamps() {
    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .eq('is_active', true);
    return { data: data || [], error };
  },

  // MUSIC
  async getMusic() {
    const { data, error } = await supabase
      .from('music')
      .select('*')
      .eq('is_active', true);
    return { data: data || [], error };
  },
};