<template>
  <div v-bind:class="{ hideCursor: !cursorShown }">
    <div id="bg">
    </div>
    <music-player v-if="musicPlayerLoaded"/>
    <v-app dark id="app">
      <v-navigation-drawer
        v-model="drawerShown"
        hide-overlay
        clipped
        temporary
        app>
        <v-list>
          <v-list-tile>
          <v-btn flat icon>
            <v-icon @click="toggleDrawer" alt="close" title="close">close</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn flat icon alt="github" title="github" :href="`https://www.github.com/EnigmaCurry/enigmacurry.com`" target="_new">
            <v-icon>zmdi-hc-3x zmdi-github</v-icon>
         </v-btn>
         <v-btn flat icon alt="soundcloud" title="soundcloud" :href="`https://www.soundcloud.com/enigmacurry/tracks`" target="_new">
            <v-icon>zmdi-hc-3x zmdi-soundcloud</v-icon>
         </v-btn>
          </v-list-tile>
          <v-list-tile
            v-for="(item, i) in menuItems"
            :to="item.to"
            :key="i"
            router
            exact
            class="navIcon" >
            <v-list-tile-action>
              <img :src="item.img" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar
        clipped-left
        fixed
        app
        class="header"
        v-bind:class="[{ fadeIn: headerShown }, { fadeOut: !headerShown }]">
        <v-toolbar-side-icon @click="toggleDrawer" />
        <v-toolbar-title class="title" v-text="title"/>
        <v-spacer></v-spacer>
        <v-slider
          v-model="volume"
          v-if="music_player_show"
          color="white"
          class="volumeSlider"
          append-icon="volume_up"
          prepend-icon="volume_down">
        </v-slider>
        <v-btn icon v-bind:class="{ btnSelected: music_player_show }" @click="toggleMusicPlayer">
          <v-icon>queue_music</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content id="base-content">
        <v-container ref="content">
          <nuxt />
        </v-container>
      </v-content>
    </v-app>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-129894901-1');
    </script>
  </div>
</template>

<style scoped>
#bg {
  position: fixed;
  z-index: -20;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-color: #000;
}

#bg.fov-bearing {
  background-image: url(~assets/img/fractal/fov-bearing.1024.jpg);
}

#bg.nine-pow-cantor-general {
  background-image: url(~assets/img/fractal/9pow-cantor-general.iter-cantor.2048.jpg);
}

#bg.deepfield-halfoct-ngon4 {
  background-image: url(~assets/img/fractal/deepfield-halfoct-ngon4.gimp.jpg);
}

#bg.pare4Dolia-8 {
  background-image: url(~assets/img/fractal/pare4Dolia.8.1024.jpg);
}

#bg.pare4Dolia-pair-of-four-dull-olyas {
  background-image: url(~assets/img/fractal/pare4Dolia.pair-of-four-dull-olyas.2.1024.jpg);
}

#bg.green-ball {
  background-image: url(~assets/img/fractal/green-ball.5.1024.jpg);
}

#bg.mitosis {
  background-image: url(~assets/img/fractal/Mitosis.1024.jpg);
}

#bg.oceanic-network {
  background-image: url(~assets/img/fractal/oceanic-network.1080.jpg);
}

#bg.stair-stalks {
  background-image: url(~assets/img/fractal/stair-stalks.1080.jpg);
}

#bg.splash-grid {
  background-image: url(~assets/img/fractal/splash-grid.12.1080.jpg);
}

#bg.mutagon-4 {
  background-image: url(~assets/img/fractal/muta-gon.4.1024.jpg);
}

div#app {
  background: transparent;
}
.container {
  max-width: none;
}
#base-content {
  margin-bottom: 400px;
  z-index: -1;
}
.btnSelected {
  background-color: orange !important;
}
.fadeIn {
  opacity: 1;
  background-color: rgba(33,33,33, 0.5);
}
.fadeOut {
  opacity: 0;
  pointer-events: none !important;
}
.hideCursor {
  cursor: none;  
}
.header {
  z-index: 2;
  user-select: none;
}
.title {
  font-family: 'Doppio One' !important;
  line-height: 2 !important;
  font-size: 1.5em !important;
  padding-left: 0.5em;
}
.navIcon {
  padding-top: 10px;
}
.volumeSlider {
  padding-top: 20px;
  padding-right: 10px;
  max-width: 200px;
}
.v-navigation-drawer > .v-list .v-list__tile--active .v-list__tile__title {
  color: #3abafa;
}
</style>

<script>
import ActivityMonitor from '~/components/ActivityMonitor.vue'
import MusicPlayer from '~/components/MusicPlayer.vue'
import EventListener from '~/components/EventListener.vue'
import ScrollbarHideListener from '~/components/ScrollbarHideListener.vue'
import { mapState } from 'vuex'
import * as FullscreenPolyfill from 'fullscreen-api-polyfill'

export default {
  mixins: [EventListener, ActivityMonitor, ScrollbarHideListener],
  components: {MusicPlayer},
  props: {
    activityTimeout: {type: Number, default: 10}
  },
  data() {
    return {
      headerShown: true,
      cursorShown: true,
      drawerShown: false,
      volumeBarShown: false,
      musicPlayerLoaded: false,
      volume: 100,
      title: 'EnigmaCurry',
      menuItems: [
        { img: require('~/assets/img/icons/seed-of-life.png'), title: 'Flower of Life', to: '/geometry/flower-of-life' },
        { img: require('~/assets/img/icons/icosahedron.png'), title: 'Platonic Solids', to: '/geometry/platonic-solids' }, 
        { img: require('~/assets/img/icons/pentagon.png'), title: 'Penrose', to: '/geometry/penrose' },
        //{ img: require('~/assets/img/icons/subdivision.png'), title: 'Penrose Rays', to: '/geometry/penrose-rays' },
        { img: require('~/assets/img/icons/epicycle.png'), title: 'Epicycles', to: '/geometry/epicycles' },
        { img: require('~/assets/img/icons/tilings.png'), title: 'Tilings', to: '/geometry/tilings' },
        { img: require('~/assets/img/icons/harmonograph.png'), title: 'Harmonograph', to: '/geometry/harmonograph' },
        { img: require('~/assets/img/icons/sri-yantra.png'), title: 'Sri Yantra', to: '/geometry/sri-yantra' },
        { img: require('~/assets/img/icons/circumferencia.png'), title: 'Circumferencia', to: '/geometry/circumferencia' },
        { img: require('~/assets/img/icons/particle-life.png'), title: 'Particle Life', to: '/geometry/particle-life' },
        { img: require('~/assets/img/icons/yoyo.png'), title: 'Yo Yo Verse', to: '/geometry/yoyoverse' },
        { img: require('~/assets/img/icons/pingpong.png'), title: 'Ping Pong Verse', to: '/geometry/pingpongverse' },
        { img: require('~/assets/img/icons/mandelbrot.png'), title: 'Mandelbrot', to: '/geometry/mandelbrot' },
        { img: require('~/assets/img/icons/hexgrid.png'), title: 'Hex Grid', to: '/geometry/hexgrid' },
        { img: require('~/assets/img/icons/reuleaux.png'), title: 'Reuleaux Triangle', to: '/geometry/reuleaux' }, 
        { img: require('~/assets/img/icons/pentultimate.png'), title: 'Pentultimate', to: '/geometry/pentultimate' },
        { img: require('~/assets/img/icons/the-iridule.png'), title: 'The Iridule', to: '/video/the-iridule' },
        { img: require('~/assets/img/icons/akashic-diffusion.png'), title: 'Akashic Diffusion', to: '/video/akashic-diffusion-carbon-collector-at-emerald-station' },
        { img: require('~/assets/img/icons/docetic-bodhisattva.png'), title: 'Docetic Bodhisattva', to: '/video/docetic-bodhisattva-his-noetic-body-sought-ya' },
        { img: require('~/assets/img/icons/no-minor-sea.png'), title: 'No Minor Sea', to: '/video/no-minor-sea' },
        { img: require('~/assets/img/icons/thorium.png'), title: 'Thorium', to: '/video/thorium' },
        { img: require('~/assets/img/icons/refraction.png'), title: 'Refraction', to: '/video/refraction' },
        { img: require('~/assets/img/icons/gambit.png'), title: 'Gambit', to: '/video/gambit' },
        { img: require('~/assets/img/icons/starburst.png'), title: 'Starburst', to: '/video/starburst' },
        { img: require('~/assets/img/icons/boxmerge.png'), title: 'Box Merge', to: '/video/boxmerge' },
        { img: require('~/assets/img/icons/tribulb.png'), title: 'Tribulb', to: '/video/tribulb' },
    ],
    }
  },
  computed: {
    ...mapState({
      user_active: state => state.ui.user_active,
      music_player_show: state => state.ui.music_player_show
    })
  },
  watch: {
    user_active(active) {
      if (active  || this.drawerShown || this.music_player_show) {
        this.headerShown = true
        this.cursorShown = true
      } else {
        this.headerShown = false
        this.cursorShown = false
      }
    },
    volume(volume) {
      this.$bus.$emit('music-volume-set', volume)
    }
  },
  methods: {
    toggleMusicPlayer() {
      this.musicPlayerLoaded = true
      this.$store.commit('ui/music_player_show', !this.music_player_show)
    },
    toggleDrawer() {
      this.$store.commit('ui/music_player_show', false)
      this.drawerShown = !this.drawerShown
    }
  },
  mounted() {
    document.addEventListener('dblclick', (e) => {
      if(e.clientY > 100 && e.clientX > 100) { //User has to click roughly center
        e.preventDefault()
        if(document.fullscreenElement) {
          document.exitFullscreen() 
        } else if (document.fullscreenEnabled) {
          document.body.requestFullscreen()
        } else {
          console.warn("Device doesn't support fullscreen")
        }
      }
    })
  }
}
</script>
