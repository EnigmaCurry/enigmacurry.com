<template>
  <g-scene :obj="scene" antialias>
    <g-camera name="main" ref="camera" orthographic :zoomScale="zoom"/>
    <g-grid :divisions="20" :size="20" v-if="showGrid"/>
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
import fragmentShaderTemplate from 'raw-loader!~/assets/shaders/graph.fragment.glsl'
import nunjucks from 'nunjucks'

const colorToVec = (color) => {
  return `vec3(${color.r.toFixed(4)}, ${color.g.toFixed(4)}, ${color.b.toFixed(4)})`
}

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    downscale: {type: Number, default: 1},
  },
  data() {
    const zoom = 1
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      scene: {type: "i", value: 0},
      iTime: {type: 'f', value: 0.1},
      iResolution: {type: 'v2', value: new Three.Vector2(this.renderer.width, this.renderer.height) },
      iCenter: {type: 'v2', value: new Three.Vector2(0, 0)},
      iZoom: {type: 'f', value: zoom},
    }
    const functions = [
      {def: 'cos(x*sin(iTime/16.)*4.)*sin(x*sin(x/cos(iTime/12.)) * 15.)*2.',
       polar: true,
       stroke: 140,
       color: 'vec3(smoothstep(-2., 1., sin(iTime)/p.y), sin(iTime/p.x), cos(iTime/p.y))'},
      {def: 'sin(pow(x,2.)/cos(iTime/14.))*2.',
       polar: true,
       stroke: 140,
       color: 'vec3(smoothstep(-4., 1., sin(iTime)/p.x), cos(iTime/p.y), 1.)'},
      {def: '2./cos(x/sin(iTime/6.))* 22.',
       polar: true,
       stroke: 44,
       color: 'vec3(smoothstep(-14., 2., sin(iTime)/p.y), cos(p.y/p.x), sin(p.x))'},
    ]
    const fragmentShader = nunjucks.renderString(fragmentShaderTemplate,
                                                 { functions })
    const shaderMat = new Three.ShaderMaterial( {
      uniforms: tUniform,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: Three.DoubleSide,
      transparent: true,
    } )
    return {
      scene: new Three.Scene(),
      tUniform,
      shaderMat,
      clock: new Three.Clock(),
      shaderMesh: null,
      zoom,
    }
  },
  watch: {
    zoom: {
      handler(v) {
        this.resizeShaderMesh()
      }
    }
  },
  created() {
    this.renderer.downscale *= this.downscale    
  },
  mounted() {
    //this.renderer.showStats = true
    this.waitForRendererMount(() => {
      this.recreateShaderProjectionScreen()
      window.addEventListener('resize', this.recreateShaderProjectionScreen)
    })
    this.visibilityInterval = Visibility.every(30 * 1000, () => {
      this.tUniform.scene.value = (this.tUniform.scene.value + 1) % this.numScenes
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
    resizeShaderMesh() {
      this.shaderMesh.scale.copy(new Three.Vector3(this.zoom, this.zoom, this.zoom))
      this.tUniform.iZoom.value = 1/this.zoom
    },
    recreateShaderProjectionScreen() {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      this.tUniform.iResolution.value.set(width, height)
      let pWidth = (width/height) * 2
      let pHeight = 2
      if (height > width) {
         pWidth = 2
         pHeight = (height/width) * 2
      }
      if (this.shaderMesh != null) {
        this.scene.remove(this.shaderMesh)
      }
      this.shaderMesh = new Three.Mesh( new Three.PlaneGeometry( pWidth, pHeight),
                                        this.shaderMat)
      this.scene.add(this.shaderMesh)
      this.resizeShaderMesh()
      // const txt = this.$textures.textSurface({
      //   text: "EnigmaCurry"
      // })
      // this.scene.add(txt)
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
