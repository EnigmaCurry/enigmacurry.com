<template>
  <div ref="renderer" class="g-renderer">
    <slot></slot>
    <div ref="container"></div>
    <div ref="offscreen" class="offscreen"></div>
  </div>
</template>

<style>
.g-renderer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.g-renderer * canvas {
  width: 100vw;
  height: 100vh;  
}
.g-renderer .offscreen {
  display: none;
}
</style>

<script>
import * as Three from 'three'
import Vue from 'vue'
import { WebGLRenderer } from 'three'

export default {
  name: 'GRenderer',
  provide () {
    return {
      parentObj: null, // avoid "injection not found" warning
      _baseUrl: null,
      global: this.global
    }
  },
  props: {
    obj: { type: Object },
    global: {type: Object, default: () => {return {}}},
    animated: { type: Boolean, default: false },
    clearColor: { type: String, default: "#000000" },
    clearAlpha: { type: Number, default: 0.65 },
    antialias: { type: Boolean, default: true },
    transparent: { type: Boolean, default: true },
    toCanvasId: {type: String, default: null},
    canvasSize: {type: Object, default: () => {return {width: 512, height: 512}}}
  },
  data () {
    let curObj = this.obj
    let isGlobal = this.toCanvasId === null
    let canvas, texture
    if (!curObj) {
      let renderParams = { antialias: this.antialias, alpha: this.transparent }
      if(!isGlobal) {
        canvas = document.createElement('canvas')
        canvas.id = this.toCanvasId
        renderParams.canvas = canvas
      }
      curObj = new WebGLRenderer(renderParams)
      curObj.setClearColor(this.clearColor, this.clearAlpha)
      if(!isGlobal) {
        curObj.setSize(this.canvasSize.width, this.canvasSize.height)
        texture = new Three.CanvasTexture(canvas)
      }
    }
    curObj.name = curObj.name || curObj.type
    return { curObj, isGlobal, texture }
  },
  methods: {
    onResize: function(e, toSize) {
      if (typeof(toSize) != "undefined") {
        console.log(toSize)
        this.size = {width: toSize.width, height: toSize.height}
      } else {
        this.size = {width: this.$el.clientWidth, height: this.$el.clientHeight}
      }
      this.curObj.setSize(this.size.width, this.size.height)
      this.global.rendererSize = this.size
      this.global.camera.onContainerResize(this.size.width, this.size.height)
      this.curObj.render(this.global.scene, this.global.camera)
    },
    animate: function ({kill=false} = {}) {
      if(kill == true) {
        window.cancelAnimationFrame(this._animationRequestID)
      } else {
        this._animationRequestID = requestAnimationFrame(this.animate)
        this.curObj.render(this.global.scene, this.global.camera)
        if (!this.isGlobal) {
          this.texture.needsUpdate = true
        }
      }
    }
  },
  created() {
    console.log("uh")
    // An initial size has to be set, this is immediately resized again in mount()
    this.size = {width: 0, height: 0}
    this.curObj.setSize(this.size.width, this.size.height)
    if(this.isGlobal) {
      window.offscreenCanvasTextures = {}
      this.global.rendererSize = this.size
      this.global.rendererDom = this.curObj.domElement
    } else {
      window.offscreenCanvasTextures[this.toCanvasId] = this.texture
    }
  },
  mounted() {
    if(this.isGlobal) {
      this.$refs.container.appendChild(this.curObj.domElement)
      this.onResize()
      window.addEventListener('resize', this.onResize)
    } else {
      this.onResize(null, this.canvasSize)
    }
    if (this.animated) {
      this.animate()
    }
  },
  destroyed() {
    if (this.isGlobal) {
      window.offscreenCanvasTextures = {}
      window.removeEventListener('resize', this.onResize)
    }
    this.animate({kill: true})
  }
}
</script>
