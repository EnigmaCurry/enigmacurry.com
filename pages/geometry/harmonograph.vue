<template>
  <harmonograph />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Harmonograph from '~/components/scenes/harmonograph.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { Harmonograph }
}
</script>
