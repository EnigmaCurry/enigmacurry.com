<template>
  <div v-bind:class="{ hideCursor: !cursorShown }">
    <div id="bg">
    </div>
    <music-player v-if="musicPlayerLoaded"/>
    <v-app dark id="app">
      <v-navigation-drawer
        v-model="drawerShown"
        mini-variant
        hide-overlay
        clipped
        temporary
        app>
        <v-list>
          <v-list-tile>
          <v-btn flat icon>
            <v-icon @click="toggleDrawer">close</v-icon>
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

div#app {
  background: transparent;
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
        { img: require('~/assets/img/icons/yoyo.png'), title: 'yoyoverse', to: '/geometry/yoyoverse' },
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
