import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Simple plugin to copy sw.js to dist root after build
function pwaPlugin() {
  return {
    name: 'copy-sw',
    closeBundle() {
      try {
        mkdirSync('dist', { recursive: true })
        copyFileSync(
          resolve(__dirname, 'public/sw.js'),
          resolve(__dirname, 'dist/sw.js')
        )
      } catch (e) {
        // sw.js is already handled by Vite's public folder copy
      }
    }
  }
}

export default defineConfig(({ mode }) => {
  const repoRoot = resolve(__dirname, '..')
  const env = loadEnv(mode, repoRoot, '')
  const backendTarget = env.VITE_BACKEND_TARGET || 'http://127.0.0.1:8000'

  return {
    envDir: repoRoot,
    plugins: [react(), pwaPlugin()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      host: true
    }
  }
})
