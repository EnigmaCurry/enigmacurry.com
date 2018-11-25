<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-penrose-mesh tileType="p3" :scale="scale" :position="{x:0}" :rotation="rotation1" :iterations="iterations" :wireframe="wireframe" />

      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  props: {
    wireframe: {type: Boolean, default: true},
    animated: {type: Boolean, default: true},
    scaleInterval: {type: Number, default: 30},
  },
  data() {
    let iterations = 3
    let maxScale = iterations
    let minScale = 1
    return {
      iterations,
      maxScale,
      minScale,
      tweenGroup: new TWEEN.Group(),
      scale: maxScale,
      rotation1: new Three.Vector3(),
    }
  },
  created() {
    
  },  
  mounted() {
    if (this.animated) {
      this.$penroseTextures.newPenroseTweens('p3')
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
      this.$penroseTextures.updatePenroseTweens('p3')
      this.rotation1.z += 0.0005
    },
    tweenScale(toScale) {
      let scale = {value: this.scale}
      return new TWEEN.Tween(scale, this.tweenGroup)
        .to({value: toScale}, this.scaleInterval * 1000)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(() => {
          this.scale = scale.value
        })
        .onComplete(this.newScaleInterval)
        .start()
    },
    newScaleInterval() {
      let nextScale = Math.random() * (this.maxScale - this.minScale) + this.minScale
      this.tweenScale(nextScale)
    }    
  }
}
</script>
