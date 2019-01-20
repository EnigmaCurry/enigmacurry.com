<template>
  <g-renderer>
    <base-layout header music-player />
  </g-renderer>
</template>

<script>
import GRenderer from '~/components/geometry/GRenderer.vue'
import BaseLayout from '~/layouts/base.vue'

export default {
  components: {GRenderer, BaseLayout},
}
</script>
