// lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail-fast để tránh bug “lúc được lúc không” do thiếu env
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.'
  );
}

// Singleton: tránh tạo nhiều GoTrueClient trong cùng browser context
declare global {
  // eslint-disable-next-line no-var
  var __echo_supabase__: SupabaseClient | undefined;
}

export const supabase: SupabaseClient =
  globalThis.__echo_supabase__ ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Giữ stable key, tránh loạn nếu trước đó bạn từng đổi setup
      storageKey: 'echo-auth',
      detectSessionInUrl: true,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__echo_supabase__ = supabase;
}

// (Giữ nguyên phần db helper nếu bạn đang dùng)
// Nếu bạn đã có db helper cũ thì dán lại xuống dưới đây và sửa import supabase là được.
export const db = {
  async getUser(id: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    return { data, error };
  },

  async getUserCards(userId: string) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async createCard(card: any) {
    const { data, error } = await supabase.from('cards').insert([card]).select().single();
    return { data, error };
  },

  async getCard(id: string) {
    const { data, error } = await supabase.from('cards').select('*').eq('id', id).single();
    return { data, error };
  },

  async getTemplates() {
    const { data, error } = await supabase.from('card_templates').select('*').eq('is_active', true);
    return { data: data || [], error };
  },

  async getEnvelopes() {
    const { data, error } = await supabase.from('envelopes').select('*').eq('is_active', true);
    return { data: data || [], error };
  },

  async getStamps() {
    const { data, error } = await supabase.from('stamps').select('*').eq('is_active', true);
    return { data: data || [], error };
  },

  async getMusic() {
    const { data, error } = await supabase.from('music').select('*').eq('is_active', true);
    return { data: data || [], error };
  },
};
