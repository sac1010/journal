import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type Entry = {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type StickyNote = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
