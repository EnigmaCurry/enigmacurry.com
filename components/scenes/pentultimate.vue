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
    backgroundClass: {type: String, default: "mutagon-4"},
    backgroundAlpha: {type: Number, default: 0.5},
  },
  data() {
    const zoom = 1
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      scene: {type: "i", value: 0},
      iTime: {type: 'f', value: 0.1},
      iResolution: {type: 'v2', value: new Three.Vector2(
        this.renderer.width, this.renderer.height) },
      iCenter: {type: 'v2', value: new Three.Vector2(0, 0)},
      iZoom: {type: 'f', value: zoom}
    }
    const functions = [
      {def: 'smoothstep(-1., 33., c) * 1.5',
       vars: [
         {name:'a', type:'float', def:'sin(iTime/4.)'},
         {name:'b', type:'float', def:'x / cos(iTime/(22.+a*1.))'},
         {name:'c', type:'float', def:'12./sin(22. * b)'},
         {name:'q', type:'float', def:'sin(iTime)/p.x'},
         {name:'r', type:'float', def:'cos(iTime/p.y)'},
         {name:'s', type:'float', def:'cos(sin(iTime))'},
       ],
       enabled: true,
       alpha: 0.7,
       polar: true,
       stroke: 140,
       color: 'vec3(smoothstep(-1., 1., q), r, s)'},
      {def: 'smoothstep(-1., a, b * c)',
       vars: [
         {name:'a', type:'float', def:'sin(x*iTime)/12.'},
         {name:'b', type:'float', def:'sin(x*sin(iTime/16.)*4.)'},
         {name:'c', type:'float', def:'sin(x*sin(x/cos(iTime/12.))*15.)'},
         {name:'q', type:'float', def:'sin(iTime)/p.y'},
         {name:'r', type:'float', def:'tan(iTime/p.x)'},
         {name:'s', type:'float', def:'cos(iTime/p.y)'},
       ],
       enabled: true,
       alpha: 0.8,
       polar: true,
       stroke: 140,
       color: 'vec3(smoothstep(-2., 1., q), r, s)'},
      {def: 'sin(x*sin(iTime/16.)*4.) * sin(x*sin(x/cos(iTime/12.))*15.)',
       enabled: true,
       alpha: 0.8,
       polar: false,
       stroke: 14,
       color: 'vec3(0.4 + p.x*sin(iTime/2.))'},
      {def: '2./cos(x/sin(iTime/16.))* 22.',
       vars: [
         {name:'q', type:'float', def:'sin(iTime)/p.y'},
         {name:'r', type:'float', def:'cos(p.y/p.x)'},
         {name:'s', type:'float', def:'sin(p.x+sin(iTime))'},
       ],
       enabled: true,
       alpha: 0.8,
       polar: true,
       stroke: 44,
       color: 'vec3(smoothstep(-14., 2., q), r, s)'},
      {def: 'cos(x/tan(iTime/22.))',
       enabled: false,
       alpha: 0.7,
       polar: true,
       stroke: 144,
       color: 'vec3(cos(sin(tan(iTime*p.x))))'},
      
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
