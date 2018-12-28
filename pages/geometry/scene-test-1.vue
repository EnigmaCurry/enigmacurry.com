<template>
  <scene-test-1 />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import SceneTest1 from '~/components/scenes/scene-test-1.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {SceneTest1},
  created() {
  },
}
</script>
