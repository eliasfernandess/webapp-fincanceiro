import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: verificar se as variáveis estão carregadas (sempre logar)
console.log('🔍 Supabase Config:', {
  url: supabaseUrl ? '✅ Configurada' : '❌ Não configurada',
  urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'vazio',
  key: supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada',
  keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'vazio',
  enabled: !!(supabaseUrl && supabaseAnonKey),
  envMode: import.meta.env.MODE
});

// Se não tiver as credenciais, retorna null (usa localStorage)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = supabase !== null;

if (isSupabaseEnabled) {
  console.log('✅ Supabase habilitado e pronto para uso');
} else {
  console.warn('⚠️ Supabase não está configurado - usando localStorage');
  console.warn('💡 Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas no Vercel');
}

