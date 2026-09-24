import glsl from 'vite-plugin-glsl'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'vercel',
  },

  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

  i18n: {
    locales: [
      { code: 'en', language: 'en', dir: 'ltr', file: 'en.json', name: 'English' },
      { code: 'ar', language: 'ar', dir: 'rtl', file: 'ar.json', name: 'العربية' },
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: '../i18n/locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'en',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/variables.css',
  ],

  vite: {
    plugins: [glsl()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#1f1d1d' },
        { name: 'author', content: 'Ameen Mohamed' },
        // OG
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Ameen Mohamed' },
        { property: 'og:title', content: 'Ameen Mohamed — Front-End Engineer' },
        { property: 'og:description', content: 'Front-End Engineer specializing in Vue.js, Nuxt.js, real-time systems, and interactive web experiences.' },
        { property: 'og:url', content: 'https://ameeen.me' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Ameen Mohamed — Front-End Engineer' },
        { name: 'twitter:description', content: 'Front-End Engineer specializing in Vue.js, Nuxt.js, real-time systems, and interactive web experiences.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/logo-ameen.svg' },
        { rel: 'canonical', href: 'https://ameeen.me' },
      ],
    },
  },
})
