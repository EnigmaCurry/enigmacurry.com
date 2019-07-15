<template>
<video-player
  pause-music video="https://cdn.rymcg.tech/Video/Sierpinski-Mandalax-Zoom.2.gambit.8Mbps.mp4"/>
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
