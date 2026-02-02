export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: [
    'select2/dist/css/select2.min.css'
  ],

  runtimeConfig: {
    openWeatherApiKey: '8d043095074d440b50496d98cf888ec9' // Nuxt injectera la valeur depuis .env
  }
})
