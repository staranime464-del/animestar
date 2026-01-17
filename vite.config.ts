 // vite.config.ts - RENDER COMPATIBLE VERSION
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Render पर PWA disabled करें, simple config use करें
  const plugins = [react()];
  
  // Only add PWA in development or if explicitly enabled
  if (mode === 'development' || env.VITE_ENABLE_PWA === 'true') {
    try {
      const { VitePWA } = require('vite-plugin-pwa');
      plugins.push(
        VitePWA({
          registerType: 'autoUpdate',
          manifest: {
            name: 'Animestar - Anime & Movies',
            short_name: 'Animestar',
            description: 'Download and watch anime in Hindi for free',
            theme_color: '#8B5CF6',
            background_color: '#0a0c1c',
            display: 'standalone',
            icons: [
              {
                src: '/favicon.ico',
                sizes: '64x64',
                type: 'image/x-icon'
              }
            ]
          }
        })
      );
      console.log('✅ PWA plugin loaded');
    } catch (error) {
      console.log('⚠️ PWA plugin not available, continuing without it');
    }
  }
  
  return {
    server: {
      port: 5173,
      host: true,
    },
    plugins,
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __VITE_API_BASE__: JSON.stringify(env.VITE_API_BASE || 'http://localhost:3000/api'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'components'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['react-hot-toast', 'swiper', 'axios']
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['bcryptjs']
    }
  };
});