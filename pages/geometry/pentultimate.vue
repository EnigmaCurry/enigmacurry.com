<template>
  <pentultimate-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PentultimateScene from '~/components/scenes/pentultimate.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {PentultimateScene},
}
</script>
