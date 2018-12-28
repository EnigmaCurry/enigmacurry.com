<template>
  <scene-test-2 />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import SceneTest2 from '~/components/scenes/scene-test-2.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {SceneTest2}
}
</script>
