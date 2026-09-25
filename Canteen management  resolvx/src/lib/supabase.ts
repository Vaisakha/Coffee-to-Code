import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://buugcsqgkiunejllxpqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dWdjc3Fna2l1bmVqbGx4cHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDUyMzksImV4cCI6MjEwNTcyMTIzOX0.Ai5oBn7N_6fW97eOPafn0E0-4TJuIzN-wpd4XjrqOkg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
