<template>
  <ping-pong-verse />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PingPongVerse from '~/components/scenes/pingpongverse.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {PingPongVerse},
}
</script>
