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
  mounted() {
    if (this.origin === "top") {
      this.mesh.geometry.translate(0, 0, 0)
    }
    // Draw edges after translation is applied
    this.drawEdges()
  }
  
}
</script>
