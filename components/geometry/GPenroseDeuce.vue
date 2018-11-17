<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: -216*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: -144*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" origin="bottom" :translate="kiteTranslation" :rotation="{z: -252*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" origin="bottom" :translate="kiteTranslation" :rotation="{z: -108*(Math.PI/180)}"/>
  </g-mesh>
</template>

<script>
import GPenroseTile from '~/components/geometry/GPenroseTile.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseTile],
  props: {
    color: {type: String, default: "blue"}
  },
  mounted() {
    //Translate origin for rotation purposes:
    if (this.origin === "bottom") {
      this.mesh.geometry.translate(0, this.dartDimensions.gnomonSide + this.dartDimensions.gnomonBase, 0)
    }
    // Draw edges after translation is applied
    this.drawEdges()    
  }
}
</script>
