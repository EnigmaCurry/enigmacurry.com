<template>
  <g-mesh>
    <g-penroseV1-geometry proto-tile="dart" origin="top" />
    <g-penroseV1-geometry proto-tile="kite" origin="left" />
    <g-penroseV1-geometry proto-tile="kite" origin="right" />
    <g-penroseV1-geometry proto-tile="kite" origin="left" :rotation="{z: 216 * (Math.PI/180)}"/>
    <g-penroseV1-geometry proto-tile="kite" origin="right" :rotation="{z: 144 * (Math.PI/180)}"/>
  </g-mesh>
</template>

<script>
import GPenroseTile from '~/components/geometry/penrose-v1/GPenroseTile.vue'
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
