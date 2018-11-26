<template>
  <penrose-rays />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PenroseRays from '~/components/scenes/penrose-rays.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { PenroseRays }
}
</script>
