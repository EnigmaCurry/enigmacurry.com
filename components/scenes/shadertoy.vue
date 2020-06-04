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
import vertexShader from 'raw-loader!~/assets/shaders/general.vertex.glsl'
import fragmentShaderTemplate from 'raw-loader!~/assets/shaders/shadertoy.fragment.glsl'
import nunjucks from 'nunjucks'

const colorToVec = (color) => {
  return `vec3(${color.r.toFixed(4)}, ${color.g.toFixed(4)}, ${color.b.toFixed(4)})`
}

function loadTexture(img) {
  const tex = new Three.TextureLoader().load(img)
  tex.minFilter = Three.NearestFilter
  tex.magFilter = Three.NearestFilter
  tex.wrapS = Three.RepeatWrapping
  tex.wrapT = Three.RepeatWrapping
  return tex
}

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    downscale: {type: Number, default: 1},
    backgroundClass: {type: String, default: "splash-grid"},
    backgroundAlpha: {type: Number, default: 0.80},
  },
  data() {
    const zoom = 1
    const iChannel0 = loadTexture(require("~/assets/img/texture/shadertoy0.jpg"))
    const iChannel1 = loadTexture(require("~/assets/img/texture/shadertoy1.jpg"))
    const iChannel2 = loadTexture(require("~/assets/img/texture/shadertoy2.jpg"))
    const iChannel3 = loadTexture(require("~/assets/img/texture/shadertoy3.png"))
    const tUniform = {
      iTime: {type: 'float', value: 0},
      iResolution: {type: 'vec3', value: new Three.Vector3(
        this.renderer.width, this.renderer.height) },
      iCenter: {type: 'vec2', value: new Three.Vector2(0, 0)},
      iZoom: {type: 'float', value: zoom},
      iChannel0: {type: 'sampler2D', value: iChannel0},
      iChannel1: {type: 'sampler2D', value: iChannel1},
      iChannel2: {type: 'sampler2D', value: iChannel2},
      iChannel3: {type: 'sampler2D', value: iChannel3}
    }
    const fragmentShader = nunjucks.renderString(fragmentShaderTemplate,
                                                 { tUniform })
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
  },
  beforeDestroy() {
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
