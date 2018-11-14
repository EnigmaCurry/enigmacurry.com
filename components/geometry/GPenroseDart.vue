<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" :origin="origin" />
  </g-mesh>
</template>

<script>
import * as Three from 'three'
import GPenroseTile from '~/components/geometry/GPenroseTile.vue'

export default {
  name: 'g-penrose-dart',
  mixins: [GPenroseTile],
}
</script>
