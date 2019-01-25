<template>
  <mandelbrot />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Mandelbrot from '~/components/scenes/mandelbrot.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {Mandelbrot},
}
</script>
