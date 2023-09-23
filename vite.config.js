// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { sassPlugin } from 'esbuild-sass-plugin'

// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}
  let vuetifyOptions = {
    autoImport: true,
  }
  if (['prod', 'production'].includes(process.env.VITE_APP_ENV.toLowerCase())) {
    vuetifyOptions.styles = {
      configFile: 'src/styles/settings.scss',
    }
  }
  return defineConfig({
    build: {
      minify: false,
    },
    cacheDir: '.cache',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import url("https://cdn.jsdelivr.net/npm/segoe-fonts@1.0.1/segoe-fonts.min.css");
          `
        }
      }
    },
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify(vuetifyOptions),
    ],
    define: {
      'process.env': {},
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      host: true,
      port: 3000,
    },
    optimizeDeps: {
      extensions: [".scss", ".sass"],
      esbuildOptions: {
        plugins: [
          sassPlugin({
            type: "style",
            // Setting `logger.warn` to no-op is a workaround for
            // https://github.com/sass/sass/issues/3065#issuecomment-868302160.
            // Since `optimizeDeps` is only processing third party dependencies and only during dev,
            // we don't care about *any* deprecation warnings. The `quietDeps` SASS option doesn't work.
            logger: { warn() {} },
          }),
        ],
      },
    },
  })
}
