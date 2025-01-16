import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
// eslint-disable-next-line import/default
import eslint from 'vite-plugin-eslint'
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isCoverage = process.argv.includes('--coverage')

const allowSourceMaps = isProduction || isCoverage

export default defineConfig({
  appType: 'mpa',
  envDir: './env',
  build: {
    outDir: 'build',
    sourcemap: allowSourceMaps,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        idp: resolve(__dirname, 'idp/index.html')
      }
    }
  },
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(serve) {
        serve.middlewares.use((req, res, next) => {
          if (req.headers.accept?.includes('text/html')) {
            if (req.url.startsWith('/idp')) {
              req.url = '/idp/index.html'
            } else {
              req.url = '/src/index.html'
            }
          }

          next()
        })
      }
    },
    react(),
    ...(isTest || isCoverage ? [] : [eslint({ fix: true, emitError: true, exclude: [/virtual:/, /node_modules/] })]),
    ...(isProduction
      ? [
          sentryVitePlugin({
            org: 'arteli',
            project: 'arteli-app',
            telemetry: false
          })
        ]
      : [])
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/vitest-setup.ts',
    coverage: {
      include: ['src/**/*', 'idp/**/*'],
      exclude: [
        'idp/mocks/*',
        'src/mocks/*',
        'src/*.d.ts',
        'idp/*.d.ts',
        'src/*-env.ts',
        'idp/*-env.ts',
        'src/main.tsx',
        'idp/main.tsx',
        'src/utils/analytics.ts',
        'src/components/App/*',
        'idp/components/App/*'
      ],
      reporter: ['text', 'json', 'html'],
      all: true,
      statements: 95,
      branches: 90,
      functions: 75,
      lines: 95
    }
  },
  server: {
    port: 3000,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      $: fileURLToPath(new URL('./idp', import.meta.url))
    }
  }
})
