<template>
  <reuleaux-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ReuleauxScene from '~/components/scenes/reuleaux.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ReuleauxScene},
}
</script>
