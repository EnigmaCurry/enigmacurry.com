<template>
  <graph-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import GraphScene from '~/components/scenes/graph.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {GraphScene},
}
</script>
