<template>
  <video-player video="https://spee.ch/@EnigmaCurry:9/AkashicDiffusion-CarbonCollectoratEmeraldStation.mp4"/>
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
