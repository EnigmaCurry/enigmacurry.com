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
import fragmentShader from 'raw-loader!~/assets/shaders/mandelbrot.fragment.glsl'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    downscale: {type: Number, default: 2.},
  },
  data() {
    const center = new Three.Vector2(0,0)
    const zoom = 1
    const colt = 1
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      iGlobalTime: {type: 'f', value: 0.1},
      iResolution: {type: 'v2', value: new Three.Vector2() },
      center: {type: 'v2', value: center },
      zoom: {type: 'f', value: zoom},
      colt: {type: 'f', value: colt},
    }
    const shaderMat = new Three.ShaderMaterial( {
      uniforms: tUniform,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: Three.DoubleSide
    } )
    const zoomList = [
      {x: 0, y:0, zoom: 0.16, colt: 3, duration: 25},
      {x: 0, y:0, zoom: 0.9, colt: 33, duration: 5},
      {x: -1.75, y: 0, zoom: 1.6, colt: 333, duration: 2},
      {x: -1.75, y: 0, zoom: 445.6, colt: 333, duration: 40},
      {x: -1.45, y: 0, zoom: 45.6, colt: 33, duration: 600},
      {x: -1.75, y: 0, zoom: 1.6, colt: 66, duration: 40},
    ]
    return {
      scene: new Three.Scene(),
      tUniform,
      shaderMat,
      clock: new Three.Clock(),
      shaderMesh: null,
      center,
      zoom,
      colt,
      zoomList,
      tmod: 1,
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
    this.center.x = this.zoomList[0].x
    this.center.y = this.zoomList[0].y
    this.zoom = this.zoomList[0].zoom
    this.colt = this.zoomList[0].colt
    const cb = () => {
      this.newTravelInterval(cb)
    }
    this.newTravelInterval(cb)
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
      const t = this.tUniform.iGlobalTime.value += this.clock.getDelta() / 222
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
