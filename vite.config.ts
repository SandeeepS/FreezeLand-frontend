import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Freezeland',
        short_name: 'Freezeland',
        description: 'Your Freezeland app description',
        theme_color: '#3367D6',
        icons: [
          {
            src: 'icons/penguine-192X192',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/penguine-512X512',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})