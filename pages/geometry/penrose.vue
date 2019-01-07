<template>
  <penrose />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Penrose from '~/components/scenes/penrose.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { Penrose }
}
</script>
