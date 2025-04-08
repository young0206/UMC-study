/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITR_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
