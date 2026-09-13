// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr:false,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt', '@nuxtjs/color-mode','@vueuse/nuxt'],

    imports: {
      dirs: [
        'composables',
        'composables/**',
        'stores',
      ],
    },
  
    // Also auto-import from requests/constants subfolders
    components: true,
 
  

  srcDir:'src',
  css: ['~/assets/css/main.css',
    'swiper/css',
    'swiper/css/pagination',
    // 'vue-sonner/style.css',
  ],
  
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css' }

        // { rel: 'icon', type: 'image/x-icon', href: '/Asset18.png' }, // For the standard favicon
        // { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }, // Example for other formats
        // { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }, // For iOS devices
      ],
      script: [
        {
          // This runs BEFORE the page renders - prevents flash of wrong theme
          innerHTML: `
            (function() {
              try {
                var stored = localStorage.getItem('theme');
                var html = document.documentElement;
                if (stored === 'dark') {
                  html.classList.add('dark');
                  html.classList.remove('light');
                  html.setAttribute('data-theme', 'dark');
                } else {
                  html.classList.add('light');
                  html.classList.remove('dark');
                  html.setAttribute('data-theme', 'light');
                }
              } catch (e) {
                document.documentElement.classList.add('light');
              }
            })();
          `,
          type: 'text/javascript',
        }
      ],
      htmlAttrs: {
        class: 'light',
        'data-theme': 'light',
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        'http://localhost:5000/api/v1',
      appName: 'CoinSquare Wealth',
    },
  },

  
})