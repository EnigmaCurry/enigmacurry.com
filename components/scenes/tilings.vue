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
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 10},
    repeatX: {type: Number, default: 10},
    repeatY: {type: Number, default: 10},
    tileType: {type: String, default: 'hexagon'},
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
      if (type === 'triangle') {
        tilingFunc = this.$geometry.regularTilingGeometry.triangle
      } else if (type === 'square') {
        tilingFunc = this.$geometry.regularTilingGeometry.square
      } else if (type === 'hexagon') {
        tilingFunc = this.$geometry.regularTilingGeometry.hexagon
      }
      let tileGeometry = tilingFunc(repeatX, repeatY)
      tileGeometry.scale(scale, scale, scale)
      let material = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors, wireframe: false })
      let mesh = new Three.Mesh(tileGeometry, material)
      mesh.position.x = -1 * tileGeometry.boundingBox.max.x / 2
      mesh.position.y = -1 * tileGeometry.boundingBox.min.y / 2
      this.scene.add(mesh)      
    }
  }
}
</script>
