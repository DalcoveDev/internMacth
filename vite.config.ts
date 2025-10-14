import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Make environment variables available in the browser
      __APP_ENV__: JSON.stringify(env)
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react'],
            charts: ['recharts']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts']
    }
  }
})