import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base URL untuk GitHub Pages — sesuaikan dengan nama repo/subfolder
  base: '/TicTacToe/visual-search-lab/',
})
