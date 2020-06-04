<template>
  <shadertoy-scene shader="shadertoy_kaleidoscope.glsl" iChannel0="bricks.png" iChannel1="clouds.png"  iChannel2="madim-vallis.2-side-down.ps.6.jpg" />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ShadertoyScene from '~/components/scenes/shadertoy.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ShadertoyScene},
}
</script>
