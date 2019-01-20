<template>
  <shader-test />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ShaderTest from '~/components/scenes/shader-test.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ShaderTest},
}
</script>
