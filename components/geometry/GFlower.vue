<template>
  <animation :fn="animate" />
</template>

<script>
import * as Three from 'three'
import {Object3D} from 'vue-threejs'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: "g-flower",
  mixins: [Object3D],
  props: {
    circleSegments: {type: Number, default: 12},
    unitRadius: {type: Number, default: 2},
    shapeRadius: {type: Number, default: 8},
    levels: {type: Number, default: 6},
    tweenInterval: {type: Number, default: 6}
  },
  data() {
    return {
      colorChoices: [
        [ 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ],
        [ 0xBF0B2C, 0x02173D, 0x0AA38C, 0xF5900F, 0xF24E13, 0x011627, 0xf71735, 0x41ead4, 0xfdfffc, 0xff9f1c ],
        [ 0x515e6b, 0xb2b5be, 0x40434a, 0xd0cfd4, 0x43525c, 0x670bf3, 0xffe400, 0xff1053, 0x390099, 0xffae03 ],
      ],
      easingChoices: [
        TWEEN.Easing.Sinusoidal.InOut,
        // TWEEN.Easing.Quartic.InOut,
        // TWEEN.Easing.Quintic.InOut,
        // TWEEN.Easing.Exponential.InOut,
        // TWEEN.Easing.Elastic.In
      ],
      params: [
        {circleSegments: 64, unitRadius: 3, shapeRadius: 7, numLevels: 9},
        {circleSegments: 10, unitRadius: 3, shapeRadius: 11, numLevels: 9},
        {circleSegments: 4, unitRadius: 1, shapeRadius: 5, numLevels: 5},
        {circleSegments: 3, unitRadius: 1, shapeRadius: 5.2, numLevels: 19},
        {circleSegments: 6, unitRadius: 1, shapeRadius: 5.2, numLevels: 4},
        {circleSegments: 12, unitRadius: 2, shapeRadius: 8, numLevels: 5},
        {circleSegments: 6, unitRadius: 5, shapeRadius: 7, numLevels: 5},
      ]
    }
  },
  created() {
    this.newFlower({...this.params[0], colors: this.colorChoices[2]})
    this.newMaterialTweenInterval()
  },
  methods: {
    animate(tt) {
      TWEEN.update()
    },    
    newFlower({numLevels, colors, unitRadius, shapeRadius, circleSegments}) {
      let group = new Three.Group()
      this.curObj = group
      let shape = new Three.CircleGeometry(shapeRadius, circleSegments)
      shape.vertices.shift()
      
      // Create colors and materials
      this._materials = []
      this._currentColors = []
      for (let c = 0; c < colors.length; c++) {
        let color = new Three.Color(colors[c])
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
        group.add(mesh)
      }
    },
    tweenMaterial(level, toColor, duration=10, onComplete=function(){}) {
      let materialColor = this._materials[level % this._materials.length].color
      toColor = {r: toColor.r, g: toColor.g, b: toColor.b}
      let c = { r: materialColor.r, g: materialColor.g, b: materialColor.b }
      return new TWEEN.Tween(c)
        .to(toColor, duration * 1000)
        .easing(this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)])
        .onComplete(onComplete)
        .onUpdate(() => {
          materialColor.r = c.r
          materialColor.g = c.g
          materialColor.b = c.b
        })
        .start()
    },
    newMaterialTweenInterval() {
      this._currentColors.push(this._currentColors.shift())
      for(let m=0; m < this._materials.length; m++) {
        this.tweenMaterial(m, this._currentColors[m % this._currentColors.length],
                           this.tweenInterval, m==0 ? this.newMaterialTweenInterval : function(){})
      }
    }
  }
}
</script>
