<template>
  <hexgrid-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import HexgridScene from '~/components/scenes/hexgrid.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { HexgridScene }
}
</script>
