<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" origin="bottom" :rotation="{z: Math.PI}"/>
    <g-penrose-geometry proto-tile="kite" origin="left" :rotation="{z: 216 * (Math.PI/180)}" />
    <g-penrose-geometry proto-tile="kite" origin="right" :rotation="{z: 144 * (Math.PI/180)}" />
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
      this.mesh.geometry.translate(0, this.dartDimensions.gnomonBase, 0)
    } else if (this.origin === "left") {
      // WARNING: Eyeballed
      this.mesh.geometry.translate(0.809019, 0.587785, 0)
    } else if (this.origin === "right") {
      // WARNING: Eyeballed
      this.mesh.geometry.translate(-0.809019, 0.587785, 0)
    } 
  }
}
</script>
