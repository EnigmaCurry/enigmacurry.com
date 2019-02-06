const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'apple-mobile-web-app-title', content: 'EnigmaCurry' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Doppio+One' },
      { rel: 'apple-touch-icon', sizes:'57x57', href:'/apple-icon-57x57.png'},
      { rel: 'apple-touch-icon', sizes:'60x60', href:'/apple-icon-60x60.png'},
      { rel: 'apple-touch-icon', sizes:'72x72', href:'/apple-icon-72x72.png'},
      { rel: 'apple-touch-icon', sizes:'76x76', href:'/apple-icon-76x76.png'},
      { rel: 'apple-touch-icon', sizes:'114x114', href:'/apple-icon-114x114.png'},
      { rel: 'apple-touch-icon', sizes:'120x120', href:'/apple-icon-120x120.png'},
      { rel: 'apple-touch-icon', sizes:'144x144', href:'/apple-icon-144x144.png'},
      { rel: 'apple-touch-icon', sizes:'152x152', href:'/apple-icon-152x152.png'},
      { rel: 'apple-touch-icon', sizes:'180x180', href:'/apple-icon-180x180.png'},
      { rel:'icon', type:'image/png', sizes:'192x192',  href:'/android-icon-192x192.png'},
      { rel:'icon', type:'image/png', sizes:'32x32', href:'/favicon-32x32.png'},
      { rel:'icon', type:'image/png', sizes:'96x96', href:'/favicon-96x96.png'},
      { rel:'icon', type:'image/png', sizes:'16x16', href:'/favicon-16x16.png'},
      { rel:'manifest', href:'/manifest.json'},
    ],
    script: [
      { async: true, src: "https://www.googletagmanager.com/gtag/js?id=UA-129894901-1"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/components',
    '@/plugins/event-bus',
    '@/plugins/vuetify',
    '@/plugins/vue-threejs',
    '@/plugins/geometry',
    '@/plugins/textures',
    '@/plugins/penroseTextures',
    '@/plugins/penroseV1',
    '@/plugins/penroseV1Textures',
    '@/plugins/tilings',
    '@/plugins/graphics',
    '@/plugins/particles',
    '@/plugins/hexagons',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }

      // @see https://github.com/nuxt/nuxt.js/pull/3480#issuecomment-404150387
      config.output.globalObject = "this"

      // if (ctx.isClient) {
      //   //Web-workers work in client mode only:
      //   config.module.rules.push({
      //     test: /\.worker\.js$/,
      //     use: { loader:'worker-loader' },
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
}
