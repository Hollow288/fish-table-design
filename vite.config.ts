import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: '@types/auto-imports.d.ts',
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ],
      dirs: ['src/api/**'],
      vueTemplate: true // 支持在 Vue 模版中使用
    }),
    Components({
      dts: '@types/components.d.ts',
      resolvers: [NaiveUiResolver()],
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView']
        }
      ],
      directives: true, // 自动导入指令
      globs: ['src/components/*/index.vue']
    }),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
})