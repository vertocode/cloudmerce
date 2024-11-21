import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify']
  },
  modules: [
    '@unlok-co/nuxt-stripe',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  runtimeConfig: {
    stripe: {
      key: process.env.STRIPE_SECRET_KEY
    },
    public: {
      apiUrl: process.env.API_URL,
      emailjsServiceId: process.env.EMAILJS_SERVICE_ID,
      emailjstemplateId: process.env.EMAILJS_TEMPLATE_ID,
      emailjsuserId: process.env.EMAILJS_USER_ID,
      stripe: {
        key: process.env.STRIPE_PUBLISHABLE_KEY
      },
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;',
          api: 'modern-compiler'
        }
      }
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
