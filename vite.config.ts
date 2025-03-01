import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    viteCompression({
      // Optional: Compress only video files
      filter: /\.(mp4|webm)$/i,
      // Use gzip for compression
      algorithm: 'gzip',
      // Don't delete the original files
      deleteOriginFile: false
    })
  ],
  // Configure asset handling
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.webp', '**/*.gif'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate videos into their own chunks
          if (id.includes('videos/')) {
            return 'videos';
          }
        }
      }
    }
  }
})
