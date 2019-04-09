<template>
<div ref="content" class="musicPlayer" v-bind:class="[{ musicFadeIn: music_player_show }, { musicFadeOut: !music_player_show }]">
  <iframe id="soundcloud" width="100%" :height="getHeight()" scrolling="no" frameborder="no" :src="embed_url"></iframe>
</div>
</template>

<style scoped>
.musicPlayer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -2;
}
.musicFadeIn {
  opacity: 0.85;
  z-index: 2;
}
.musicFadeOut {
  opacity: 0;
  pointer-events: none !important;  
}
</style>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import qs from 'qs'
import EventListener from '~/components/EventListener.vue'

export default {
  mixins: [EventListener],
  props: {
    maxHeight: {type: Number, default: 400},
    minHeight: {type: Number, default: 200},
    baseURL: {type: String, default: "https://w.soundcloud.com/player/"},
    url: {type: String, default: "https://api.soundcloud.com/playlists/619307016?secret_token=s-GE5ly"},
    color: {type: String, default: "#ff5500"},
    hide_related: {type: Boolean, default: true},
    show_comments: {type: Boolean, default: false},
    show_user: {type: Boolean, default: true},
    show_reposts: {type: Boolean, default: false},
    show_teaser: {type: Boolean, default: true}
  },
  computed: {
    ...mapState({
      music_player_show: state => state.ui.music_player_show
    }),
    embed_url: function() {
      let query = {url:this.url,
                   color:this.color,
                   hide_related: this.hide_related,
                   show_comments: this.show_comments,
                   show_user: this.show_user,
                   show_reposts: this.show_reposts,
                   show_teaser: this.show_teaser}
      return this.baseURL + "?" + qs.stringify(query)
    },
  },
  methods: {
    loadPlayerAPI() {
      let script = document.createElement("script")
      let head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
      script.src = "https://w.soundcloud.com/player/api.js"
      script.onload = script.onreadystatechange = () => {
        if(!script.readyState || /loaded|complete/.test( script.readyState ) ) {
          script.onload = script.onreadystatechange = null
          this.soundcloudAPI = SC.Widget(document.getElementById('soundcloud'))
        }
      }
      head.insertBefore(script, head.firstChild)
    },
    getHeight() {
      return window.innerHeight - 64
    },
    setVolume(volume) {
      if (typeof(this.soundcloudAPI != "undefined")) {
        this.soundcloudAPI.setVolume(volume)
      }
    },
    pause() {
      if (typeof(this.soundcloudAPI != "undefined")) {
        this.soundcloudAPI.getPosition((pos) => {
          if(pos > 0) {
            this.soundcloudAPI.pause()
          }
        })
      }
    },
    resume() {
      if (typeof(this.soundcloudAPI != "undefined")) {
        this.soundcloudAPI.getPosition((pos) => {
          if(pos > 0) {
            this.soundcloudAPI.play()
          }
        })
      }
    }
  },
  created() {
    console.log("Soundcloud embed_url: "+this.embed_url)
    this.addEventListener(window, 'resize', () => {
      this.$forceUpdate()
    })
    this.loadPlayerAPI()
    this.$bus.$on('music-volume-set', volume => {
      this.setVolume(volume)
    })
    this.$bus.$on('music-pause', () => {
      this.pause()
    })
    this.$bus.$on('music-resume', () => {
      this.resume()
    })
    console.log(this.soundcloudAPI)
  }
}
</script>
