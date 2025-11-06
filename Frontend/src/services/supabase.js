// Cliente de Supabase configurado
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[SUPABASE] Error: Variables de entorno no configuradas');
  console.error('[SUPABASE] VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('[SUPABASE] VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

export default supabase;

