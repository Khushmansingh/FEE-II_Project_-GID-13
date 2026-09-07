import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
  console.warn('Supabase URL or Anon Key is missing or invalid. Please add them to your .env file.');
  supabaseUrl = 'https://placeholder.supabase.co';
  supabaseAnonKey = 'placeholder';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
