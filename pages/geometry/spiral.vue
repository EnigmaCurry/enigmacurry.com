<template>
  <spiral />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Spiral from '~/components/scenes/spiral.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {Spiral},
}
</script>
