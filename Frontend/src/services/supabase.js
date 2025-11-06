// Cliente de Supabase - Singleton simple
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar variables de entorno
if (!supabaseUrl || !supabaseKey) {
  console.error("[SUPABASE] ❌ Variables de entorno no configuradas");
  console.error("[SUPABASE] VITE_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error(
    "[SUPABASE] VITE_SUPABASE_ANON_KEY:",
    supabaseKey ? "✅" : "❌"
  );
}

// Crear UNA SOLA instancia de Supabase
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sb-auth-token",
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    },
  }
);

export default supabase;
