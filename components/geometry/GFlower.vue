<template>
  <animation :fn="animate" />
</template>
  
<script>
import * as Three from 'three'
import {Object3D} from 'vue-threejs'
import * as TWEEN from '@tweenjs/tween.js'
import Visibility from 'visibilityjs'

export default {
  name: "g-flower",
  mixins: [Object3D],
  props: {
    circleSegments: {type: Number, default: 12},
    unitRadius: {type: Number, default: 2},
    shapeRadius: {type: Number, default: 8},
    levels: {type: Number, default: 6},
    materialTweenInterval: {type: Number, default: 6},
    scaleTweenInterval: {type: Number, default: 6},
    scaleTweenWait: {type: Number, default: 10},
    flowerInterval: {type: Number, default: 60}
  },
  data() {
    return {
      colorChoices: [
        [ 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ],
        [ 0xBF0B2C, 0x02173D, 0x0AA38C, 0xF5900F, 0xF24E13, 0x011627, 0xf71735, 0x41ead4, 0xfdfffc, 0xff9f1c ],
        [ 0x515e6b, 0xb2b5be, 0x40434a, 0xd0cfd4, 0x43525c, 0x670bf3, 0xffe400, 0xff1053, 0x390099, 0xffae03 ],
        [ 0x1C1933, 0xFF800C, 0xFFF7EA, 0x6D8FCC, 0x6AFAB5 ],
        [ 0x285A78, 0x287A72, 0xF2AA2E, 0x46254F, 0xA6271E ],
        [ 0x036169, 0x045659, 0x588C8F, 0x96BEC0, 0xEDF4F5 ],
        [ 0x3D3C40, 0x575559, 0x6D6E70, 0xA2A3A5, 0xDBD9D1 ]
      ],
      easingChoices: [
        //TWEEN.Easing.Sinusoidal.InOut,
        // TWEEN.Easing.Quartic.InOut,
        TWEEN.Easing.Quintic.InOut,
        // TWEEN.Easing.Exponential.InOut,
        // TWEEN.Easing.Elastic.In
      ],
      params: [
        {circleSegments: 64, unitRadius: 3, shapeRadius: 7, numLevels: 9},
        {circleSegments: 12, unitRadius: 2, shapeRadius: 8, numLevels: 5},
        {circleSegments: 6, unitRadius: 1, shapeRadius: 5.2, numLevels: 9},
        {circleSegments: 4, unitRadius: 1, shapeRadius: 5, numLevels: 5},
        {circleSegments: 3, unitRadius: 1, shapeRadius: 6.6, numLevels: 25},
        {circleSegments: 6, unitRadius: 5, shapeRadius: 7, numLevels: 5},       
        {circleSegments: 10, unitRadius: 3, shapeRadius: 11, numLevels: 9},
      ],
      rotationRate: 0.0002
    }
  },
  created() {
    this.tweenGroup = new TWEEN.Group()
    this.newFlowerInterval({initial: true})
    Visibility.every(this.flowerInterval * 1000, this.newFlowerInterval)
    this.newMaterialTweenInterval()
    this.newMeshScaleTweenInterval()
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
  },
  methods: {
    animate(tt) {
      this.tweenGroup.update()
      this.curObj.rotation.z += this.rotationRate
    },
    newFlowerInterval({initial=false} = {}) {
      const interval = ({paramsIndex}) => {
        this._currentParamsIndex = paramsIndex
        let colors = this.colorChoices[Math.floor(Math.random() * this.colorChoices.length)]
        this.newFlower({...this.params[paramsIndex], colors })
      }
      if (initial) {
        interval({paramsIndex: 0})
      } else {
        this._currentParamsIndex = (this._currentParamsIndex + 1) % this.params.length
        this.fadeMaterialsToBlack(() => {interval({paramsIndex: this._currentParamsIndex})})
      }
    },
    newFlower({numLevels, colors, unitRadius, shapeRadius, circleSegments}) {
      this._stopMaterialTweens = false
      this._meshes = []
      let group = new Three.Group()
      this.curObj = group
      let shape = new Three.CircleGeometry(shapeRadius, circleSegments)
      shape.vertices.shift()
      
      // Create colors and materials
      this._materials = []
      this._currentColors = []
      for (let m = 0; m < numLevels; m++) {
        let color = new Three.Color(colors[m % colors.length])
        this._currentColors.push(color)
        this._materials.push(new Three.LineBasicMaterial({ color }))
      }
      
      // Draw flower
      let pattern = this.$geometry.flowerPattern(new Three.Vector3(0,0,0), unitRadius, numLevels)
      let level = 0
      let level_x = 1
      for(let p=0; p < pattern.length; p++) {
        if(p > 0) {
          if (level_x >= (6*level)) {
            level += 1
            level_x = 1
          } else {
            level_x += 1
          }
        }
        let material = this._materials[level % this._materials.length]
        let mesh = new Three.LineLoop(shape, material)
        mesh.position.copy(pattern[p])
        this._meshes.push(mesh)
        group.add(mesh)

        this.rotationRate = -1 * this.rotationRate
      }
    },
    tweenMaterial(level, toColor, duration=10, onComplete=function(){}, easing="random") {
      let materialColor = this._materials[level % this._materials.length].color
      toColor = {r: toColor.r, g: toColor.g, b: toColor.b}
      let c = { r: materialColor.r, g: materialColor.g, b: materialColor.b }
      return new TWEEN.Tween(c, this.tweenGroup)
        .to(toColor, duration * 1000)
        .easing(easing==="random" ? this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)] : easing)
        .onComplete(onComplete)
        .onUpdate(() => {
          materialColor.r = c.r
          materialColor.g = c.g
          materialColor.b = c.b
        })
        .start()
    },
    newMaterialTweenInterval() {
      if(this._stopMaterialTweens === true){
        setTimeout(this.newMaterialTweenInterval, this.newMaterialTweenInterval)
      } else {
        this._currentColors.push(this._currentColors.shift())
        for(let m=0; m < this._materials.length; m++) {
          this.tweenMaterial(m, this._currentColors[m % this._currentColors.length],
                             this.materialTweenInterval, m==0 ? this.newMaterialTweenInterval : function(){})
        }
      }
    },
    fadeMaterialsToBlack(onComplete) {
      this._stopMaterialTweens = true
      for(let m=0; m < this._materials.length; m++) {
        this.tweenMaterial(m, {r:0, g:0, b:0}, this.materialTweenInterval, onComplete, TWEEN.Easing.Quadratic.In)
      }
    },
    tweenMeshScales(toScale, duration=10, onComplete=function(){}, easing="random") {
      let scale = {value: this._meshes[0].scale.x}
      return new TWEEN.Tween(scale, this.tweenGroup)
        .to({value: toScale}, duration * 1000)
        .easing(easing==="random" ? this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)]: easing)
        .onComplete(onComplete)
        .onUpdate(() => {
          for(let m=0; m < this._meshes.length; m++) {
            this._meshes[m].scale.x = scale.value
            this._meshes[m].scale.y = scale.value
            this._meshes[m].scale.z = scale.value
          }
        })
        .start()
    },
    newMeshScaleTweenInterval() {
      let max = 2
      let min = 0.5
      let toScale = Math.random() * (max - min) + min
      this.tweenMeshScales(toScale, this.scaleTweenInterval, () => {setTimeout(() => {this.newMeshScaleTweenInterval()}, this.scaleTweenWait * 1000)})
    }
  }
}
</script>
