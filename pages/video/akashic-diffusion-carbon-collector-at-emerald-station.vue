<template>
  <video-player pause-music video="https://cdn.rymcg.tech/Video/Akashic-Diffusion-Carbon-Collector-at-Emerald-Station.mp4"/>
</template>

<style scoped>
video {
  pointer-events: auto;
}
</style>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import VideoPlayer from '~/components/scenes/video-player.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {VideoPlayer},
}
</script>
