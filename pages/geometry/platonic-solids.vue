<template>
  <platonic-solids />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PlatonicSolids from '~/components/scenes/platonic-solids.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {PlatonicSolids}
}
</script>
