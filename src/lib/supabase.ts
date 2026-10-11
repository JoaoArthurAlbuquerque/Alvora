import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { authStorage } from "./authStorage";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!url || !chave) throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");

export const supabase = createClient<Database>(url, chave, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // lê o token do link de recuperação (implícito ou PKCE)
  },
});