<template>
  <rectangular />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Rectangular from '~/components/scenes/rectangular.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {Rectangular},
}
</script>
