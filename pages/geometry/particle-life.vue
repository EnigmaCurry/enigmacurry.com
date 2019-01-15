<template>
  <particle-life />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import ParticleLife from '~/components/scenes/particle-life.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {ParticleLife},
}
</script>
