// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@pinia/nuxt',
    ],
    css: ['~/assets/styles/main.css'],
    devtools: {enabled: true}
})
