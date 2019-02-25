# EnigmaCurry.com

This is the source for my website at [enigmacurry.com](https://www.enigmacurry.com).

Feel free to copy (I do.), but make it your own.

## Architecture

 * [Nuxt.js](https://nuxtjs.org/) - A [Vue.js](https://vuejs.org/) static
   website builder. This does everything I ever wanted
   [blogofile](https://github.com/enigmacurry/blogofile) (my old blog engine) to
   do, and more. Moving to Javascript makes sense to me, given the huge
   advantage of web browser ubiquity and function.
 * [Three.js](https://threejs.org/) - A full abstration of
   [WebGL](https://en.wikipedia.org/wiki/WebGL) in Javascript.
 * [vue-threejs](https://github.com/fritx/vue-threejs) - This was the most well
   developed set of Vue.js components for Three.js that I found. I have heavily
   modified this base and included it in
   [components/geometry](components/geometry)
 * See the [LICENSE](LICENSE) for a full list of credits.

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```



For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
