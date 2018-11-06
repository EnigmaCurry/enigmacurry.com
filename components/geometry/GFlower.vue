<template>
<div>
  <mesh name="GFlower">
    <g-geometry type="Box" :args="[10, 3]" />
    <g-geometry type="Circle" :args="[unitRadius, circleSegments]" />
    <g-geometry type="Box" :args="[10, 13]" />
    <g-wireframe-material wire-color="#fff"/>
  </mesh>
</div>
</template>

<script>
import * as Three from 'three'

export default {
  name: "g-flower",
  props: {
    unitRadius: {type: Number, default: 1},
    circleSegments: {type: Number, default: 64},
    levels: {type: Number, default: 1}
  },
  methods: {
    flowerPattern() {
      return this.$geometry.flowerPattern(new Three.Vector3(0,0,0), this.unitRadius, this.levels)
    }
  }
}
</script>
