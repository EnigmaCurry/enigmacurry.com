<template>
  <inversion />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Inversion from '~/components/scenes/inversion.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { Inversion }
}
</script>
