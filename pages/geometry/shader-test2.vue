<template>
  <shader-test2 />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ShaderTest2 from '~/components/scenes/shader-test2.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ShaderTest2},
}
</script>
