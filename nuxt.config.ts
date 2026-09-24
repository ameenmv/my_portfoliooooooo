import glsl from 'vite-plugin-glsl'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

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
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/logo-ameen.svg' },
      ],
    },
  },
})
