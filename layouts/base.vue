<template>
  <div v-bind:class="{ hideCursor: !cursorShown }">
    <div id="bg">
    </div>
    <music-player v-if="musicPlayerLoaded"/>
    <v-app dark>
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
  background-image: url(~assets/img/fractal/fov-bearing.1024.jpg);
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
</style>

<script>
import ActivityMonitor from '~/components/ActivityMonitor.vue'
import MusicPlayer from '~/components/MusicPlayer.vue'
import EventListener from '~/components/EventListener.vue'
import ScrollbarHideListener from '~/components/ScrollbarHideListener.vue'
import { mapState } from 'vuex'

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
      musicPlayerLoaded: false,
      title: 'EnigmaCurry',
      menuItems: [
        { img: require('~/assets/img/icons/seed-of-life.png'), title: 'Flower of Life', to: '/geometry/flower-of-life' },
        { img: require('~/assets/img/icons/icosahedron.png'), title: 'Platonic Solids', to: '/geometry/platonic-solids' }
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
  }
}
</script>
