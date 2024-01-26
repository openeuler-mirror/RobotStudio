/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  // 目前env获得的值均为string
  readonly VITE_APP_IS_ELECTRON: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}