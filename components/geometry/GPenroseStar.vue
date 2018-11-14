<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: Math.PI}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
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
      this.mesh.geometry.translate(0, -1 * this.dartDimensions.gnomonBase, 0)
    }
  }
}
</script>
