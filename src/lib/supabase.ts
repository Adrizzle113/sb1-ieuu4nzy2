import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid VITE_SUPABASE_URL format');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  // Add better error handling and retries
  db: {
    schema: 'public'
  }
});

// Add a health check function to verify connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('tours').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};