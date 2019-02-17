<template>
  <constant-width-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ConstantWidthScene from '~/components/scenes/constant-width.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ConstantWidthScene},
}
</script>
