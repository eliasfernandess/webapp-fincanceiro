import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Para usar, crie uma conta gratuita em https://supabase.com
// e substitua estas variáveis pelas suas credenciais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Se não tiver as credenciais, retorna null (usa localStorage)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = supabase !== null;

