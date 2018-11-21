<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :clearAlpha="0" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="0.5"/>

      <!-- <g-grid :divisions="10"/> -->
      <!-- penrose-pentagram is rendered to an invisible canvas texture buffer -->
      <penrose-pentagram :canvas-id="penrosePentagramCanvas" :canvas-size="{width: textureSize, height: textureSize}"/>
      <g-group :scale="zoom" :rotation="sceneRotation">
        <g-group v-for="(scale, index) in scales">
          <g-group :scale="scale" :rotation="{z: index % 2 == 0 ? 0 : Math.PI}">
            <g-mesh>
              <g-geometry type="Plane" :args="[1, 1]" />
              <g-canvas-material :canvas-id="penrosePentagramCanvas"/>
            </g-mesh>
          </g-group>
        </g-group>
      </g-group>
      <animation :fn="animate"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as math from 'mathjs'
import PenrosePentagram from '~/components/scenes/penrose-pentagram.vue'

export default {
  components: {PenrosePentagram},
  props: {
    iterations: {type: Number, default: 11},
    wireframe: {type: Boolean, default: false},
    animated: {type: Boolean, default: true},
    penrosePentagramCanvas: {type: String, default: "penrose-pentagram-canvas"},
    textureSize: {type: Number, default: 1024},
    initialZoom: {type: Number, default: 5000},
    zoomInterval: {type: Number, default: 45},
  },
  data() {
    let phi = (1 + Math.sqrt(5)) / 2
    let scales = [1]
    let ratio = phi - (1/phi) - (1/phi)
    for(let s=1; s < this.iterations; s++) {
      scales.push(ratio * scales[scales.length - 1])
    }
    return {
      pentagramIterations: 5,
      pentagonIterations: 8,
      tweenGroup: new TWEEN.Group(),
      scales: scales,
      zoom: this.initialZoom,
      sceneRotation: new Three.Vector3()
    }
  },
  mounted() {
    if (this.animated) {
      this.$penroseTextures.newPenroseTweens("p2")
      this.newZoomInterval()
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
      this.sceneRotation.z += 0.0005
    },
    tweenZoom(toZoom) {
      let zoom = {value: this.zoom}
      return new TWEEN.Tween(zoom, this.tweenGroup)
        .to({value: toZoom}, this.zoomInterval * 1000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
          this.zoom = zoom.value
        })
        .onComplete(this.newZoomInterval)
        .start()
    },
    newZoomInterval() {
      let min = 1
      let max = this.initialZoom
      let nextZoom = this.zoom == min ? max : min
      this.tweenZoom(nextZoom)
    }
  }
}
</script>
