<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>

      <!-- <g-grid :divisions="10"/> -->

      <!-- P3 Background -->

      <!-- P2 Forground -->
      <g-penrose-mesh tileType="p3" :scale="2" :position="{x:-0}" :rotation="rotation1" :iterations="8" :wireframe="wireframe"/>
      <g-penrose-mesh tileType="p2" :scale="scale" :position="{x:0}" :rotation="rotation2" :iterations="iterations" :wireframe="wireframe" :kite-opacity="kiteOpacity" :dart-opacity="dartOpacity"/>

      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  props: {
    wireframe: {type: Boolean, default: false},
    animated: {type: Boolean, default: true},
    scaleInterval: {type: Number, default: 30},
    maxScale: {type: Number, default: 8},
    minScale: {type: Number, default: 0.5},
    dartOpacity: {type: Number, default: 0.6},
    kiteOpacity: {type: Number, default: 0.6}
  },
  data() {
    return {
      iterations: 5,
      tweenGroup: new TWEEN.Group(),
      scale: this.maxScale,
      rotation1: new Three.Vector3(),
      rotation2: new Three.Vector3()
    }
  },
  created() {
    
  },  
  mounted() {
    if (this.animated) {
      this.$penroseTextures.newPenroseTweens('p2')
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
      this.$penroseTextures.updatePenroseTweens('p2')
      this.rotation1.z += 0.0005
      this.rotation2.z -= 0.0005
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
