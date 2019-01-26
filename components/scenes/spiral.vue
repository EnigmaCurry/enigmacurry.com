<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="0.5"/>
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'
import Visibility from 'visibilityjs'
import vertexShader from 'raw-loader!~/assets/shaders/general.vertex.glsl'
import fragmentShader from 'raw-loader!~/assets/shaders/spiral.fragment.glsl'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    downscale: {type: Number, default: 1},
  },
  data() {
    const center = new Three.Vector2(0,0)
    const zoom = 1
    const colt = 1
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      iGlobalTime: {type: 'f', value: 0},
      iResolution: {type: 'v2', value: new Three.Vector2() },
      spiralRatio: {type: 'f', value: 0.618},
      spiralRate: {type: 'f', value: 3},
      spiralScale: {type: 'f', value: 5}
    }
    const shaderMat = new Three.ShaderMaterial( {
      uniforms: tUniform,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: Three.DoubleSide
    } )
    return {
      scene: new Three.Scene(),
      tUniform,
      shaderMat,
      clock: new Three.Clock(),
      shaderMesh: null,
      tweenGroup: new TWEEN.Group()
    }
  },
  watch: {
    "zoom": {
      handler(v) {
        this.tUniform.zoom.value = v
      }
    },
    "colt": {
      handler(v) {
        this.tUniform.colt.value = v
      }
    }
  },
  created() {
    this.renderer.downscale *= this.downscale
  },
  mounted() {
    this.renderer.onResize()
    //this.renderer.showStats = true
    //Wait for the renderer to report a size:
    let intervalID = setInterval(() => {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      if (width > 0 && height > 0) {
        clearInterval(intervalID)
        this.recreateShaderMesh()
        window.addEventListener('resize', this.recreateShaderMesh)
      }
    }, 100)
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
    Visibility.stop(this.visibilityInterval)
    window.removeEventListener('resize', this.recreateShaderMesh)
    this.renderer.downscale /= this.downscale    
  },
  methods: {
    animate(tt) {
      const t = this.tUniform.iGlobalTime.value += this.clock.getDelta() / 200000
      this.tUniform.spiralRatio.value = 2 * Math.sin(t) + Math.sin(t*2222) * 0.5 + 0.05
      this.tUniform.spiralScale.value = 0.1
      this.tUniform.spiralRate.value = 123 * Math.sin(t)
      this.tweenGroup.update()
    },
    newTravelInterval(callback) {
      const settings = Object.assign({}, this.zoomList[0])
      this.zoomList.push(this.zoomList.shift())
      const zl = this.zoomList[0]
      console.log("New Travel Interval", zl.duration, "x=",zl.x,"y=",zl.y)
      const tween = new TWEEN.Tween(settings, this.tweenGroup)
            .to(zl, zl.duration * 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
              this.center.x = settings.x
              this.center.y = settings.y
              this.zoom = settings.zoom
              this.colt = settings.colt
            })
            .onComplete(callback)
            .start()
      
    },
    recreateShaderMesh() {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      this.tUniform.iResolution.value.set(width, height)
      let pWidth = width/height
      let pHeight = 1
      if (height > width) {
        pWidth = 1
        pHeight = height/width
      }
      if (this.shaderMesh != null) {
        this.scene.remove(this.shaderMesh);
      }
      this.shaderMesh = new Three.Mesh( new Three.PlaneGeometry( pWidth, pHeight, 1, 1 ), this.shaderMat)
      this.scene.add(this.shaderMesh)
    }
  }
}
</script>
