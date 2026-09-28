import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Vendor code rarely changes, so split it out: browsers keep it cached
        // across deploys and only re-download the small app chunk.
        codeSplitting: {
          groups: [
            { name: 'three', test: /[\\/]node_modules[\\/]three[\\/]/ },
            { name: 'react-three', test: /[\\/]node_modules[\\/](@react-three|three-stdlib|camera-controls|maath|troika-|zustand|its-fine|suspend-react)/ },
            { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
    // three.js alone is ~700 kB minified and can't be split further.
    chunkSizeWarningLimit: 800,
  },
})
