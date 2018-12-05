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
import {shuffle, reject} from 'underscore'

export default {
  props: {
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 5},
    tileFrustrumSize: {type: Number, default: 10},
    speedX: {type: Number, default: 0.07},
    speedY: {type: Number, default: 0.03},
    speedRotation: {type: Number, default: 0.002},
    tileScale: {type: Number, default: 0.5}
  },
  data() {
    return {
      scene: new Three.Scene(),
      time: 0,
      tweenGroup: new TWEEN.Group(),
      tileTypes: ["truncatedTriHexagonal", "triangular", "square", "hexagonal", "snubSquare", "elongatedTriangular",
                  "truncatedSquare", "triHexagonal", "snubHexagonal1", "rhombiTriHexagonal",
                  "truncatedHexagonal"],
    }
  },
  created() {    
    this.containerGroup = new Three.Group()
    this.scene.add(this.containerGroup)
    this.materials = [
      new Three.MeshLambertMaterial({color: 0xababab}),
      new Three.MeshLambertMaterial({color: 0xf0f0f0}),
      new Three.MeshLambertMaterial({color: 0x343434}),
      new Three.MeshLambertMaterial({color: 'white'}),
    ]
    
    this.newTilingGroup()
    setInterval(this.newTilingGroup, 20000)
    
    let light = new Three.PointLight(0xffffff, 2, 8)
    light.position.z = 5
    light.position.y = 0
    this.scene.add(light)
    
    
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
  },
  methods: {
    animate() {
      this.tilingGroup.pan(this.speedX, this.speedY)
      this.containerGroup.rotation.z += this.speedRotation
      this.time += 0.01
    },
    newTilingGroup() {
      let tileType = this.tileTypes.shift()
      this.tileTypes.push(tileType)
      if(typeof(this.tilingGroup) != "undefined") {
        this.containerGroup.remove(this.tilingGroup.group)
      }
      let frustrum = {left: -this.tileFrustrumSize, right: this.tileFrustrumSize, top:this.tileFrustrumSize, bottom:-this.tileFrustrumSize}
      this.tilingGroup = new this.$tilings.TilingGroup({tileType, materials: this.materials, frustrum, showFrustrum: false})
      this.containerGroup.add(this.tilingGroup.group)
    }
  }
}
</script>
