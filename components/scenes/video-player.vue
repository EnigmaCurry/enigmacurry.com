<template> 
   <g-scene :obj="scene" antialias>
    <g-camera name="main" ref="camera" orthographic/>
    <g-grid :divisions="20" :size="20" v-if="showGrid"/>
    <animation :fn="animate" />
    <div class="video-player">
      <div v-if="playbackPrevented" id="clickme" class="overlay"><button class="button play"></button></div>
      <video loop height="100%" width="100%" ref="video" >
      <source :src="video" type="video/mp4">
      Your browser does not support video
      </video>
    </div>
  </g-scene>
</template>

<style scoped>
.overlay{
    background: #333;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.2);
}
.video-player {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
.button.play {
  box-sizing: border-box;
  width: 74px;
  height: 74px;
  border-style: solid;
  border-width: 37px 0px 37px 74px;
  border-color: transparent transparent transparent #ffffff;
}
</style>


<script>
import * as Three from 'three'
import BackgroundImage from '~/components/BackgroundImage.vue'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    backgroundAlpha: {type: Number, default: 0},    
    showGrid: {type: Boolean, default: false},
    video: {type: String }
  },
  data() {
    return {
      scene: new Three.Scene(),
      playbackPrevented: false
    }
  },
  methods: {
    animate(tt) {
    },    
    onClick(e) {
      this.$refs.video.play()
      this.playbackPrevented = false
    }
  },
mounted() {
    var promise = this.$refs.video.play()
    if (promise !== undefined) {
      promise.then(_ => {
        this.playbackPrevented = false
      }).catch(error => {
        this.playbackPrevented = true
      })
    }
    document.addEventListener('click', this.onClick)
    if (this.pauseMusic) {
      this.$bus.$emit('music-pause')
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClick)
    this.$bus.$emit('music-resume')
  }
}
</script>
