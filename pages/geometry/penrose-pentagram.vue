<template>
  <penrose-pentagram-fractal />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PenrosePentagramFractal from '~/components/scenes/penrose-pentagram-fractal.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { PenrosePentagramFractal }
}
</script>
