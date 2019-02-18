<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom"/>
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
import fragmentShader from 'raw-loader!~/assets/shaders/reuleaux.fragment.glsl'
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/ShaderPass"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/AfterimagePass"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/AfterimageShader"

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 0.5},
    downscale: {type: Number, default: 1},
  },
  data() {
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      iTime: {type: 'f', value: 0.1},
      iResolution: {type: 'v2', value: new Three.Vector2(this.renderer.width, this.renderer.height) },
    }
    const shaderMat = new Three.ShaderMaterial( {
      uniforms: tUniform,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: Three.DoubleSide,
      transparent: true
    } )
    return {
      scene: new Three.Scene(),
      tUniform,
      shaderMat,
      clock: new Three.Clock(),
      shaderMesh: null,
    }
  },
  created() {
    this.renderer.downscale *= this.downscale    
  },
  mounted() {
    // Add after image effect:
    const effectPass = new Three.AfterimagePass(0.8)
    this.renderer.addEffectPass(effectPass)
    
    //this.renderer.showStats = true
    this.waitForRendererMount(() => {
      this.recreateShaderProjectionScreen()
      window.addEventListener('resize', this.recreateShaderProjectionScreen)
    })
  },
  beforeDestroy() {
    Visibility.stop(this.visibilityInterval)
    window.removeEventListener('resize', this.recreateShaderProjectionScreen)
    this.renderer.downscale /= this.downscale    
  },
  methods: {
    animate(tt) {
      this.tUniform.iTime.value += this.clock.getDelta()
    },
    recreateShaderProjectionScreen() {
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
    },
    waitForRendererMount(callback) {
      this.renderer.onResize()
      //this.renderer.showStats = true
      //Wait for the renderer to report a size:
      let intervalID = setInterval(() => {
        let width = this.renderer.size.width
        let height = this.renderer.size.height
        if (width > 0 && height > 0) {
          clearInterval(intervalID)
          callback()
        }
      }, 100)
    },
  }
}
</script>
