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
      {x: 0, y:0, zoom: 0.16, colt: 933},
      {x: -0.85, y:0.5, zoom: 0.9, colt: 33},
      {x: 0.18, y: 0.5, zoom: 4.1, colt: 33},
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
      zoomList
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
    this.newTravelInterval(() => {
      const cb = () => {
        this.newTravelInterval(cb)
      }
      cb()
    })
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
    Visibility.stop(this.visibilityInterval)
    window.removeEventListener('resize', this.recreateShaderMesh)
    this.renderer.downscale /= this.downscale    
  },
  methods: {
    animate(tt) {
      const t = this.tUniform.iGlobalTime.value += this.clock.getDelta() / 222
      TWEEN.update()
    },
    newTravelInterval(callback) {
      console.log("New Travel Interval")
      const settings = {x: this.center.x, y: this.center.y, zoom: this.zoom, colt: this.colt}
      this.zoomList.push(this.zoomList.shift())
      const zl = this.zoomList[0]
      const tween = new TWEEN.Tween(settings)
            .to(zl, 10000)
            .easing(TWEEN.Easing.Quadratic.Out)
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
