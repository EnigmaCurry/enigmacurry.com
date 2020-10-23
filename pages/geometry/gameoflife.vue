<template>
  <shadertoy-scene shader="shadertoy_gameoflife.glsl"/>
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
