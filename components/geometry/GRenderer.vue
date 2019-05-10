<template>
  <div class="grenderer-container">
    <slot></slot>
    <div ref="renderer" class="renderer"></div>
  </div>
</template>

<style scoped>
.grenderer-container {
  position: fixed;
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
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/CopyShader"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/FXAAShader"

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
    const antialiasPass = new Three.ShaderPass(Three.FXAAShader)
    return {
      webGLRenderer,
      effectComposer,
      sceneData: [], // List of GScenes (Scene, cameras, currentCamera)
      size: {width: 0, height: 0}, //initialized in onResize,
      showStats: process.env.NODE_ENV === 'development',
      stats: new Stats(),
      dom_id: `threejs-stats-${uuid()}`,
      downscale: 1,
      antialiasPass
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
    this.setupPostProcessing()
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
        this.size = {width: this.$refs.renderer ? this.$refs.renderer.clientWidth : 0,
                     height: this.$refs.renderer.clientHeight ? this.$refs.renderer.clientHeight : 0}
        //Apply a max-width to the renderer if the user zooms their browser out:
        if(window.devicePixelRatio < 1) {
          this.size = {width: this.size.width * window.devicePixelRatio, height: this.size.height * window.devicePixelRatio}
        }
      }
      //Downscale:
      this.size.width /= this.downscale
      this.size.height /= this.downscale
      this.webGLRenderer.setSize(this.size.width, this.size.height)
      this.webGLRenderer.domElement.style.width = this.size.width * this.downscale + 'px'
      this.webGLRenderer.domElement.style.height = this.size.height * this.downscale + 'px'
      this.effectComposer.setSize(this.size.width, this.size.height)
      this.antialiasPass.uniforms['resolution'].value.set(1 / (this.size.width),
                                                          1 / (this.size.height))
      //this.webGLRenderer.setPixelRatio(window.devicePixelRatio / this.downscale)

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
    addEffectPass: function(effectPass) {
      this.effectComposer.insertPass(effectPass, this.effectComposer.passes.length-1)
    },
    setupPostProcessing: function(renderPass, effects=[]) {
      this.effectComposer.passes = []
      if (renderPass != undefined) {
        this.effectComposer.addPass(renderPass)
      }
      for(let e=0; e < effects.length; e++){
        this.effectComposer.addPass(effects[e])
      }
      const copyPass = new Three.ShaderPass(Three.CopyShader)
      copyPass.renderToScreen = true
      this.effectComposer.addPass(copyPass)
    }
  },
}
</script>
