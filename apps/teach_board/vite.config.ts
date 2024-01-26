import { rmSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'
import { URL } from 'url'
import eslintPlugin from 'vite-plugin-eslint'
import legacyPlugin from '@vitejs/plugin-legacy'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  rmSync('dist-electron', { recursive: true, force: true })
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG
  const env = loadEnv(mode, process.cwd())
  let plugins = null
  // 此处注意，加载的env均为string类型
  if (env.VITE_APP_IS_ELECTRON === 'true') {
    plugins = [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.jsx', 'src/**/*.ts']
        // cache: false
      }),
      legacyPlugin({
        targets: ['chrome 69'] // 需要兼容的目标列表，可以设置多个
      }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
              )
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {}
                )
              }
            }
          }
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {}
                )
              }
            }
          }
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer()
    ]
  } else {
    plugins = [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.jsx', 'src/**/*.ts']
        // cache: false
      }),
      legacyPlugin({
        targets: ['chrome 69'] // 需要兼容的目标列表，可以设置多个
      })
    ]
  }

  return {
    base: './',
    plugins,
    build: {
      target: 'esnext'
    },
    define: {
      'process.env': process.env
    },
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
        return {
          host: url.hostname,
          port: +url.port
        }
      })(),
    clearScreen: false,
    resolve: {
      alias: {
        // { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        // { find: '~common', replacement: fileURLToPath(new URL('../../common/', import.meta.url)) },
        '@': path.resolve(__dirname, './src'),
        // 'src': path.resolve(__dirname, 'src'),
        '~common': path.resolve(__dirname, '../../common/')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/css/global.less";'
        }
      }
    }
  }
})
