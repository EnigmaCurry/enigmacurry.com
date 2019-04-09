<template> 
   <g-scene :obj="scene" antialias>
    <g-camera name="main" ref="camera" orthographic/>
    <g-grid :divisions="20" :size="20" v-if="showGrid"/>
    <animation :fn="animate" />
    <div class="video-player">
      <video autoplay loop height="100%" width="100%" ref="video" >
      <source :src="video" type="video/mp4">
      Your browser does not support video
      </video>
    </div>
  </g-scene>
</template>

<style scoped>
.video-player {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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
    video: {type: String },
  },
  data() {
    return {
      scene: new Three.Scene(),
    }
  },
  methods: {
    animate(tt) {
    },    
    onClick(e) {
      this.$refs.video.play()
    }
  },
  mounted() {
    document.addEventListener('click', this.onClick)
    this.$bus.$emit('music-pause')
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClick)
    this.$bus.$emit('music-resume')
  }
}
</script>
