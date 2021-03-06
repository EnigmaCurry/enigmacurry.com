<template>
  <g-scene antialias>
    <g-camera name="main" orthographic :zoomScale="1"/>

    <!-- <g-grid :divisions="10"/> -->
    <g-penrose-mesh :tileType="tileType" :scale="scale" :position="{x:0}" :rotation="rotation1" :iterations="iterations" :wireframe="wireframe" :wireColor="wireColor" :wireOpacity="wireOpacity"/>

    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Visibility from 'visibilityjs'

export default {
  props: {
    wireframe: {type: Boolean, default: true},
    animated: {type: Boolean, default: true},
    scaleInterval: {type: Number, default: 10},
    maxIterations: {type: Number, default: 5},
    newMeshInterval: {type: Number, default: 90},
  },
  data() {
    return {
      tileType: Math.random() > 0.5 ? "p2" : "p3",
      iterations: 5,
      maxScale: 5,
      minScale: 1,
      opacity: 1,
      wireColor: new Three.Color(0xffffff),
      wireOpacity: 1,
      tweenGroup: new TWEEN.Group(),
      scale: 5,
      rotation1: new Three.Vector3(),
      rotationRate: 0.0005
    }
  },
  created() {
    //Preallocate textures:
    this.$penroseTextures.deleteRenderers()
    this.$penroseTextures.penroseKiteTexture()    
    this.$penroseTextures.penroseDartTexture()    
    this.$penroseTextures.penroseThinRhombTexture()    
    this.$penroseTextures.penroseThickRhombTexture()    
    if (this.animated) {
      this.$penroseTextures.newPenroseTweens({tileType: 'p2'})
      this.$penroseTextures.newPenroseTweens({tileType: 'p3'})
    }
  },
  mounted() {
    if (this.animated) {
      this.newScaleInterval()
      this.visibilityInterval = Visibility.every(this.newMeshInterval * 1000, () => {
        this.newPenroseMeshInterval()
      })
    }
  },
  beforeDestroy() {
    Visibility.stop(this.visibilityInterval)
    this.tweenGroup.removeAll()
    this.$penroseTextures.cancelPenroseTweens()
  },  
  methods: {
    animate(tt) {
      this.tweenGroup.update()
      this.$penroseTextures.updatePenroseTweens(this.tileType)
      this.rotation1.z += this.rotationRate
    },
    tweenScale(toScale) {
      let scale = {value: this.scale}
      return new TWEEN.Tween(scale, this.tweenGroup)
        .to({value: toScale}, this.scaleInterval * 1000)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(() => {
          this.scale = scale.value
        })
        .delay(this.scaleInterval * 1000)
        .onComplete(() => { this.newScaleInterval() })
        .start()
    },
    newScaleInterval() {
      let nextScale = Math.random() * (this.maxScale - this.minScale) + this.minScale
      this.tweenScale(nextScale)
    },
    newPenroseMeshInterval() {
      //let wireColor = {r: this.wireColor.r, g: this.wireColor.g, b: this.wireColor.b}
      let wireOpacity = {value: this.wireOpacity}
      new TWEEN.Tween(wireOpacity, this.tweenGroup)
        .to({value :0}, 2000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          this.wireOpacity = wireOpacity.value
        })
        .onComplete(() => {
          this.tweenGroup.removeAll()
          this.$penroseTextures.fadeToBlack(this.tileType, () => {
            this.$penroseTextures.newPenroseTweens({tileType: this.tileType})
            this.tileType = this.tileType === "p2" ? "p3" : "p2"
            this.iterations  = Math.floor(Math.random() * this.maxIterations) + 1
            this.maxScale = this.scale = this.iterations > 1 ? this.iterations - 1 : 1
            this.wireColor = new Three.Color(255,255,255)
            this.wireOpacity = 1
            this.newScaleInterval()
            this.rotationRate = -1 * this.rotationRate
          })
        })
        .start()
    }
    
  }
}
</script>
