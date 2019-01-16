<template>
  <g-renderer :showStats="showStats">
    <base-layout header music-player />
  </g-renderer>
</template>

<script>
import GRenderer from '~/components/geometry/GRenderer.vue'
import BaseLayout from '~/layouts/base.vue'

export default {
  components: {GRenderer, BaseLayout},
  data() {
    return {
      showStats: process.env.NODE_ENV === 'development'
    }
  }
}
</script>
