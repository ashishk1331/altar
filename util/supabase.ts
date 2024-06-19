import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.EXPO_PUBLIC_API_URL || "",
  process.env.EXPO_PUBLIC_ANON_KEY || "",
);
