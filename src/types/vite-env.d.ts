/// <reference types="vite/client" />

// Extend the ImportMeta interface to include env property
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  // Add other VITE_* environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}