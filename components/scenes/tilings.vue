<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :divisions="10" v-if="showGrid"/>

    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

export default {
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: true},
    zoom: {type: Number, default: 20},
    repeatX: {type: Number, default: 10},
    repeatY: {type: Number, default: 10},
    tileType: {type: String, default: 'trianglesSquares1'},
    tileScale: {type: Number, default: 1}
  },
  data() {
    return {
      scene: new Three.Scene()
    }
  },
  created() {
    this.tiling(this.tileType, this.repeatX, this.repeatY, this.tileScale)
  },
  methods: {
    tiling(type, repeatX, repeatY, scale=1) {
      let tilingFunc
      if (type === 'triangles') {
        tilingFunc = this.$geometry.regularTilingGeometry.triangles
      } else if (type === 'squares') {
        tilingFunc = this.$geometry.regularTilingGeometry.squares
      } else if (type === 'hexagons') {
        tilingFunc = this.$geometry.regularTilingGeometry.hexagons
      } else if (type === 'hexagonsTriangles') {
        tilingFunc = this.$geometry.semiRegularTilingGeometry.hexagonsTriangles
      } else if (type === 'trianglesSquares1') {
        tilingFunc = this.$geometry.semiRegularTilingGeometry.trianglesSquares1
      }
      let tileGeometry = tilingFunc(repeatX, repeatY)
      tileGeometry.scale(scale, scale, scale)
      let material = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors, wireframe: false })
      let mesh = new Three.Mesh(tileGeometry, material)
      this.scene.add(mesh)      
    }
  }
}
</script>
