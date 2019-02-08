<template>
  <div class="grenderer-container">
    <slot></slot>
    <div ref="renderer" class="renderer"></div>
  </div>
</template>

<style scoped>
.grenderer-container {
  height: 100%;
  width: 100%;
}
.renderer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>

<script>
import * as Three from 'three'
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/EffectComposer"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/ShaderPass"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/GlitchPass"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/CopyShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/PixelShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/SepiaShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/KaleidoShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/FXAAShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/DigitalGlitch"

import Stats from "~/lib/stats"
import uuid from 'uuid/v4'

export default {
  provide () {
    return {
      renderer: this,
      parentObj: null, // avoid "injection not found" warning
      _baseUrl: null
    }
  },
  data() {
    const webGLRenderer = new Three.WebGLRenderer({alpha: true})
    const effectComposer = new Three.EffectComposer(webGLRenderer)
    const pixelPass = new Three.ShaderPass(Three.PixelShader)
    const copyPass = new Three.ShaderPass(Three.CopyShader)
    const antialiasPass = new Three.ShaderPass(Three.FXAAShader)
    const sepiaPass = new Three.ShaderPass(Three.SepiaShader)
    const kaleidoPass = new Three.ShaderPass(Three.KaleidoShader)
    const glitchPass = new Three.GlitchPass()
    pixelPass.uniforms['resolution'].value = new Three.Vector2()
    pixelPass.uniforms['pixelSize'].value = 16
    return {
      webGLRenderer,
      effectComposer,
      sceneData: [], // List of GScenes (Scene, cameras, currentCamera)
      size: {width: 0, height: 0}, //initialized in onResize,
      showStats: process.env.NODE_ENV === 'development',
      stats: new Stats(),
      dom_id: `threejs-stats-${uuid()}`,
      downscale: 1,
      antialiasPass,
      pixelPass,
      glitchPass,
      copyPass,
      sepiaPass,
      kaleidoPass,
      effectPasses: [
        {pass: antialiasPass},
        {pass: pixelPass, enabled: false, uniforms: {pixelSize: 16}},
        {pass: glitchPass, enabled: false, uniforms: {amount: 1}},
        {pass: sepiaPass, enabled: false},
        {pass: kaleidoPass, enabled: false, uniforms: {sides: 14}},
        {pass: copyPass, renderToScreen: true},
      ]
    }
  },
  watch: {
    showStats: {
      handler(v) {
        this.createStats()
      }
    }
  },
  created() {
    this.webGLRenderer.autoClear = false
    for( let p=0; p < this.effectPasses.length; p++) {
      const effect = this.effectPasses[p]
      effect.pass.enabled = effect.enabled === false ? false : true
      effect.pass.renderToScreen = effect.renderToScreen === true ? true : false
      this.effectComposer.addPass(effect.pass)
      const uniformNames = Object.keys(effect.uniforms === undefined ? {} : effect.uniforms)
      for(let u=0; u < uniformNames.length; u++) {
        const name = uniformNames[u]
        const uniform = effect.pass.uniforms[name]
        uniform.value = effect.uniforms[name]
      }
    }
    
    this.createStats()
  },
  mounted() {
    this.$refs.renderer.appendChild(this.webGLRenderer.domElement)
    this.onResize()
    window.addEventListener('resize', this.onResize)
    this.animate()
  },
  methods: {
    onResize: function(e, toSize) {
      if (typeof(toSize) != "undefined") {
        this.size = {width: toSize.width, height: toSize.height}
      } else {
        this.size = {width: this.$refs.renderer.clientWidth, height: this.$refs.renderer.clientHeight}
        //Apply a max-width to the renderer if the user zooms their browser out:
        if(window.devicePixelRatio < 1) {
          this.size = {width: this.size.width * window.devicePixelRatio, height: this.size.height * window.devicePixelRatio}
        }
      }
      this.webGLRenderer.setSize(this.size.width, this.size.height)
      this.effectComposer.setSize(this.size.width, this.size.height)
      this.antialiasPass.uniforms['resolution'].value.set(1 / (this.size.width),
                                                          1 / (this.size.height))
      this.pixelPass.uniforms['resolution'].
        value.set(this.size.width, this.size.height).multiplyScalar(window.devicePixelRatio)
      //Always render the screen resolution / downscale, not the browser zoom level:
      this.webGLRenderer.setPixelRatio(window.devicePixelRatio / this.downscale)
      //Resize all cameras in all scenes:
      for (let sd=0; sd < this.sceneData.length; sd++){
        const cameras = this.sceneData[sd].cameras
        Object.keys(cameras).forEach(name => {
          const camera = cameras[name]
          camera.onContainerResize(this.size.width, this.size.height)
        })
      }
      this.render()
    },
    render: function() {
      //this.webGLRenderer.clear()
      this.effectComposer.render()
    },
    animate: function({kill=false} = {}) {
      if (kill === true) {
        window.cancelAnimationFrame(this._animationRequestID)
      } else {
        this._animationRequestID = requestAnimationFrame(this.animate)
        this.stats.begin()
        this.render()
        this.stats.end()
      }
    },
    createStats: function() {
      const el = document.getElementById(this.dom_id)
      if (this.showStats) {
        if(!el) {
          this.stats.dom.id = this.dom_id          
          document.body.appendChild(this.stats.dom)
        }
      } else {
        if(el) {
          document.body.removeChild(this.stats.dom)
        }
      }
    },
  },
}
</script>
