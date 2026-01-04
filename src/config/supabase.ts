import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: verificar se as variáveis estão carregadas
if (import.meta.env.DEV) {
  console.log('🔍 Supabase Config:', {
    url: supabaseUrl ? '✅ Configurada' : '❌ Não configurada',
    key: supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada',
    enabled: !!(supabaseUrl && supabaseAnonKey)
  });
}

// Se não tiver as credenciais, retorna null (usa localStorage)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = supabase !== null;

if (import.meta.env.DEV && isSupabaseEnabled) {
  console.log('✅ Supabase habilitado e pronto para uso');
} else if (import.meta.env.DEV && !isSupabaseEnabled) {
  console.warn('⚠️ Supabase não está configurado - usando localStorage');
}

