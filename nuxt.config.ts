import tailwindcss from '@tailwindcss/vite'

const authEnabled = Boolean(process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NUXT_CLERK_SECRET_KEY)

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  modules: [
    'shadcn-nuxt',
    '@vite-pwa/nuxt',
    ...(authEnabled ? [[
      '@clerk/nuxt',
      {
        publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        signInFallbackRedirectUrl: '/submit',
        signUpFallbackRedirectUrl: '/submit',
      },
    ] as [string, Record<string, unknown>]] : []),
  ],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  shadcn: { prefix: '', componentDir: './app/components/ui' },
  runtimeConfig: {
    tursoDatabaseUrl: '',
    tursoAuthToken: '',
    postAuthorSecret: '',
    public: { authEnabled },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'HorribleHosts — Better trips start with honest stories',
      meta: [
        { name: 'theme-color', content: '#b74527' },
        { name: 'description', content: 'Read honest, publicly anonymous Airbnb and Vrbo guest experiences. Free to browse. Sign in to share your story.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },
  routeRules: {
    '/api/**': { headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } },
    '/**': { headers: { 'referrer-policy': 'strict-origin-when-cross-origin', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' } },
  },
  pwa: {
    registerType: 'prompt',
    includeAssets: ['favicon.svg', 'icons/*.png', 'offline.html'],
    manifest: {
      name: 'HorribleHosts — Honest guest stories',
      short_name: 'HorribleHosts',
      description: 'Publicly anonymous Airbnb and Vrbo guest experiences.',
      theme_color: '#b74527',
      background_color: '#faf9f6',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,png,svg,ico,woff2}'],
      navigateFallback: '/offline.html',
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [],
      cleanupOutdatedCaches: true,
    },
  },
})
