import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '')
  
  // Debug: mostrar variáveis durante o build
  if (process.env.VERCEL || mode === 'production') {
    console.log('🔍 Verificando variáveis no build:')
    console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? '✅ Presente' : '❌ Ausente')
    console.log('VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Ausente')
    console.log('Todas as variáveis VITE_:', Object.keys(env).filter(k => k.startsWith('VITE_')).join(', '))
  }

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Plano Financeiro',
          short_name: 'PlanoFin',
          description: 'Aplicação completa de planejamento financeiro',
          theme_color: '#3b82f6',
          icons: []
        },
        strategies: 'generateSW',
        workbox: {
          globPatterns: ['**/*.{js,css,html}']
        }
      })
    ],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})

