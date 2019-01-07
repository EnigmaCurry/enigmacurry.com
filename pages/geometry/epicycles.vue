<template>
  <epicycles />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Epicycles from '~/components/scenes/epicycles.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { Epicycles }
}
</script>
