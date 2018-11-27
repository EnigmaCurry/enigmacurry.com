<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-penrose-mesh :rotation="sceneRotation" :scale="scale" :tileType="tileType" :iterations="iterations" :wireframe="wireframe"/>
      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  props: {
    tileType: {type: String, default: "p2"},
    wireframe: {type: Boolean, default: true},
    animated: {type: Boolean, default: true},
    scaleInterval: {type: Number, default: 30},
  },
  data() {
    return {
      iterations: 6,
      tweenGroup: new TWEEN.Group(),
      scale: {x: 8, y: 8, z: 1},
      sceneRotation: new Three.Vector3()
    }
  },
  created() {

  },  
  mounted() {
    if (this.animated) {
      this.$penroseTextures.newPenroseTweens({tileType: this.tileType})
      this.newScaleInterval()
    }    
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
    this.$penroseTextures.cancelPenroseTweens()
  },  
  methods: {
    animate(tt) {
      this.tweenGroup.update()      
      this.$penroseTextures.updatePenroseTweens(this.tileType)
      this.sceneRotation.z += 0.0005      
    },
    tweenScale(toScale) {
      let scale = {value: this.scale.x}
      return new TWEEN.Tween(scale, this.tweenGroup)
        .to({value: toScale}, this.scaleInterval * 1000)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(() => {
          this.scale.x = scale.value
          this.scale.y = scale.value
        })
        .onComplete(this.newScaleInterval)
        .start()
    },
    newScaleInterval() {
      let min = 1
      let max = 5
      let nextScale = Math.random() * (max - min) + min
      this.tweenScale(nextScale)
    }    
  }
}
</script>
