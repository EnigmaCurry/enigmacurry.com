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
import Visibility from 'visibilityjs'

export default {
  props: {
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 5},
    tileFrustrumSize: {type: Number, default: 10},
    speedX: {type: Number, default: 0.01},
    speedY: {type: Number, default: 0.03},
    speedRotation: {type: Number, default: 0.002},
  },
  data() {
    return {
      scene: new Three.Scene(),
      time: 0,
      tweenGroup: new TWEEN.Group(),
      backgroundTileTypes: ["truncatedTriHexagonal", "triangular", "square", "hexagonal", "snubSquare",
                            "elongatedTriangular", "truncatedSquare", "triHexagonal", "snubHexagonal1",
                            "rhombiTriHexagonal"],
      foregroundTileTypes: ["triangular", "square", "hexagonal", "snubSquare", "elongatedTriangular",
                            "truncatedSquare", "triHexagonal", "snubHexagonal1", "rhombiTriHexagonal",
                            "truncatedTriHexagonal"],
    }
  },
  created() {    
    this.containerGroup = new Three.Group()
    this.scene.add(this.containerGroup)
    this.backgroundMaterials = [
      new Three.MeshLambertMaterial({color: 0xababab}),
      new Three.MeshLambertMaterial({color: 0xfa3a3a}), 
      new Three.MeshLambertMaterial({color: 0xf0f0f0}),
      new Three.MeshLambertMaterial({color: 'white'}),
    ]
    this.foregroundMaterials = [
      new Three.MeshLambertMaterial({color: 0xababab, transparent: true, opacity: 0.5}),
      new Three.MeshLambertMaterial({color: 0x3a3afa, transparent: true, opacity: 0.5}), 
      new Three.MeshLambertMaterial({color: 0xf0ffff, transparent: true, opacity: 0.5}),
      new Three.MeshLambertMaterial({color: 'white', transparent: true, opacity: 0.5}),
    ]
    
    this.newBackgroundTilingGroup()
    this.newForegroundTilingGroup()
    Visibility.every(20000, () => {
      this.newForegroundTilingGroup()
      this.newBackgroundTilingGroup()
    })
    
    let light = new Three.PointLight(0xffffff, 4, 8)
    light.position.z = 5
    light.position.y = 0
    this.scene.add(light)
    
    
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
  },
  methods: {
    animate() {
      this.backgroundTilingGroup.pan(this.speedX, this.speedY)
      this.containerGroup.rotation.z += this.speedRotation
      this.time += 0.01
    },
    
    newBackgroundTilingGroup() {
      let tileType = this.backgroundTileTypes.shift()
      this.backgroundTileTypes.push(tileType)
      if(typeof(this.backgroundTilingGroup) != "undefined") {
        this.containerGroup.remove(this.backgroundTilingGroup.group)
      }
      let frustrum = {left: -this.tileFrustrumSize, right: this.tileFrustrumSize, top:this.tileFrustrumSize, bottom:-this.tileFrustrumSize}
      this.backgroundTilingGroup = new this.$tilings.TilingGroup({tileType, materials: this.backgroundMaterials, frustrum, showFrustrum: false})
      this.containerGroup.add(this.backgroundTilingGroup.group)
    },
    
    newForegroundTilingGroup() {
      let tileType = this.foregroundTileTypes.shift()
      this.foregroundTileTypes.push(tileType)
      if(typeof(this.foregroundTilingGroup) != "undefined") {
        this.containerGroup.remove(this.foregroundTilingGroup.group)
      }
      let frustrum = {left: -this.tileFrustrumSize, right: this.tileFrustrumSize, top:this.tileFrustrumSize, bottom:-this.tileFrustrumSize}
      this.foregroundTilingGroup = new this.$tilings.TilingGroup({tileType, materials: this.foregroundMaterials, frustrum, showFrustrum: false})
      this.containerGroup.add(this.foregroundTilingGroup.group)
    }
}
}
</script>
