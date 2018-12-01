<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :size="100" :divisions="100" v-if="showGrid"/>
      <animation :fn="animate" :speed="0.01"/>
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
    repeatX: {type: Number, default: 2},
    repeatY: {type: Number, default: 2},
    speedX: {type: Number, default: 1},
    speedY: {type: Number, default: 0},
    tileType: {type: String, default: 'snubSquare'},
    tileScale: {type: Number, default: 0.5}
  },
  data() {
    let mesh = this.tilingMesh(this.tileType, this.repeatX, this.repeatY, this.tileScale)
    let startPos = mesh.position.clone()
    return {
      scene: new Three.Scene(),
      mesh,
      startPos,
      time: 0
    }
  },
  created() {
    this.mesh.geometry.computeBoundingBox()
    this.scene.add(this.mesh)
  },
  methods: {
    animate() {
      //this.mesh.position.x = this.startPos.x - (this.time * this.speedX % this.tiling.period.x)
      //this.mesh.position.y = this.startPos.y - (this.time * this.speedY % this.tiling.period.y)
      this.time += 0.01
    },
    tilingMesh(type, repeatX, repeatY, scale=1) {
      let tilingFunc = this.$geometry.tilingGeometry[this.tileType]
      
      this.tiling = tilingFunc(repeatX, repeatY)
      this.tiling.geometry.scale(scale, scale, scale)
      // this.tiling.period.x *= scale 
      // this.tiling.period.y *= scale 
      let material = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors, wireframe: false })
      let mesh = new Three.Mesh(this.tiling.geometry, material)
      return mesh
    }
  }
}
</script>
