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
import fragmentShader from 'raw-loader!~/assets/shaders/thirdeye.fragment.glsl'
import ShaderToyTex1 from '~/assets/img/texture/shadertoy1.jpg'
import ShaderToyTex2 from '~/assets/img/texture/shadertoy2.jpg'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 0.5},
    numScenes: {type: Number, default: 10},
  },
  data() {
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      scene: {type: "i", value: 0},
      iGlobalTime: {type: 'f', value: 0.1},
      iChannel0: {type: 't', value: textureLoader.load(ShaderToyTex1)},
      iChannel1: {type: 't', value: textureLoader.load(ShaderToyTex2)}
    }
    tUniform.iChannel0.value.wrapS = tUniform.iChannel0.value.wrapT = Three.RepeatWrapping
    tUniform.iChannel1.value.wrapS = tUniform.iChannel1.value.wrapT = Three.RepeatWrapping
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
      clock: new Three.Clock()
    }
  },
  created() {
  },
  mounted() {
    this.renderer.onResize()
    this.renderer.showStats = true
    //Wait for the renderer to report a size:
    let intervalID = setInterval(() => {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      if (width > 0 && height > 0) {
        clearInterval(intervalID)
        const tObject = new Three.Mesh( new Three.PlaneGeometry( width/height, 1, 1, 1 ), this.shaderMat)
        this.scene.add(tObject)
      }
    }, 100)
    this.visibilityInterval = Visibility.every(10 * 1000, () => {
      this.tUniform.scene.value = (this.tUniform.scene.value + 1) % this.numScenes
   })
  },
  beforeDestroy() {
    Visibility.stop(this.visibilityInterval)
  },
  methods: {
    animate(tt) {
      this.tUniform.iGlobalTime.value += this.clock.getDelta()
    }
  }
}
</script>
