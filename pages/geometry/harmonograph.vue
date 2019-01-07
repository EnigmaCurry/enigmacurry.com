<template>
  <harmonograph />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Harmonograph from '~/components/scenes/harmonograph.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { Harmonograph }
}
</script>
