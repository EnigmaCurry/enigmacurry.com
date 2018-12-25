<template>
  <inversion />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Inversion from '~/components/scenes/inversion2.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { Inversion }
}
</script>
