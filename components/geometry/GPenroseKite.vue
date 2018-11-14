<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="kite" :origin="origin" :width="width"/>
    <g-wireframe-material wire-color="#fff"/>
  </g-mesh>
</template>

<script>
import * as Three from 'three'
import { Object3D, Mesh } from 'vue-threejs'

export default {
  name: 'g-penrose-kite',
  mixins: [Object3D],
  props: {
    width: {type: Number, default: 1},
    origin: {type: String, default: "top"}, //top, bottom, left, right
  },
  provide () {
    return { meshParent: this }
  },
  mounted() {
  }
}
</script>
