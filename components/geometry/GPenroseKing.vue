<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" origin="top" />
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: 72 * (Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: -72 * (Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" origin="top" :rotation="{z: -36 * (Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" origin="top" :rotation="{z: 36 * (Math.PI/180)}"/>
  </g-mesh>
</template>

<script>
import GPenroseTile from '~/components/geometry/GPenroseTile.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseTile],
  mounted() {
    //Translate origin for rotation purposes:
    if (this.origin === "top") {
      this.mesh.geometry.translate(0, -1 * this.dartDimensions.gnomonSide, 0)      
    } else if (this.origin === "bottom") {
      this.mesh.geometry.translate(0, this.kiteDimensions.height, 0)      
    } else if (this.origin === "left") {
    } else if (this.origin === "right") {
    }
    // Draw edges after translation is applied
    this.drawEdges()    
  }
}
</script>
