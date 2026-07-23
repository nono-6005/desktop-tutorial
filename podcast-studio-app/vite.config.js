import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built output is served directly by GitHub Pages under /desktop-tutorial/podcast-studio/,
// so use a relative base and build straight into the sibling podcast-studio/ directory.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../podcast-studio',
    emptyOutDir: true,
  },
})
