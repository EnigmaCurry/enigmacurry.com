<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="kite" :origin="origin" />
  </g-mesh>
</template>
  
  <script>
import * as Three from 'three'
import GPenroseTile from '~/components/geometry/GPenroseTile.vue'

export default {
  name: 'g-penrose-kite',
  mixins: [GPenroseTile],
  props: {
    color: {type: String, default: "red"},
  },
  mounted() {
    // Draw edges after translation is applied
    this.drawEdges()
  }
}
</script>
