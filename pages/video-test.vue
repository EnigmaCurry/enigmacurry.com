<template>
  <video-test-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import VideoTestScene from '~/components/scenes/video-test.vue'

export default {
  layout: 'default',
  mixins: [ScrollbarHide],
  components: {VideoTestScene},
}
</script>
