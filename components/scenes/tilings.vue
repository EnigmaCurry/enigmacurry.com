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
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 30},
    tileFrustrumSize: {type: Number, default: 10},
    speedX: {type: Number, default: 0.07},
    speedY: {type: Number, default: 0.03},
    speedRotation: {type: Number, default: 0.002},
    tileType: {type: String, default: null},
    tileScale: {type: Number, default: 0.5}
  },
  data() {
    let tileType = this.tileType
    if(tileType === null) {
      tileType = shuffle(Object.keys(this.$tilings.tilingGeometry))[0]
    }
    let tilingGroup = this.newTilingGroup(tileType, this.tileFrustrumSize)
    let startPos = tilingGroup.group.position.clone()
    return {
      scene: new Three.Scene(),
      tilingGroup,
      startPos,
      time: 0
    }
  },
  created() {
    this.containerGroup = new Three.Group()
    this.containerGroup.add(this.tilingGroup.group)
    this.scene.add(this.containerGroup)
  },
  methods: {
    animate() {
      this.tilingGroup.pan(this.speedX, this.speedY)
      this.containerGroup.rotation.z += this.speedRotation
      this.time += 0.01
    },
    newTilingGroup(tileType, frustrumSize) {
      let tilingGroup = new this.$tilings.TilingGroup({tileType, frustrum:{left: -frustrumSize, right: frustrumSize, top:frustrumSize, bottom:-frustrumSize}})
      return tilingGroup
    }
  }
}
</script>
