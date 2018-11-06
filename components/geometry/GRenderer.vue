<template>
  <div ref="renderer" class="g-renderer">
    <slot></slot>
    <div ref="container"></div>
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
</style>

<script>
import { PerspectiveCamera, OrthographicCamera } from 'three'
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
    clearColor: { type: String, default: "#000000" },
    clearAlpha: { type: Number, default: 0.65 },
    antialias: { type: Boolean, default: true },
    transparent: { type: Boolean, default: true }
  },
  data () {
    let curObj = this.obj
    if (!curObj) {
      curObj = new WebGLRenderer({ antialias: this.antialias, alpha: this.transparent })
      curObj.setClearColor(this.clearColor, this.clearAlpha)
    }
    curObj.name = curObj.name || curObj.type
    return { curObj, global: {} }
  },
  methods: {
    onResize: function() {
      this.size = {w: this.$el.clientWidth, h: this.$el.clientHeight}
      this.curObj.setSize(this.size.w, this.size.h)
      this.global.rendererSize = this.size
      this.global.camera.onContainerResize(this.size.w, this.size.h)
      this.curObj.render(this.global.scene, this.global.camera)
    },
    animate: function ({kill=false} = {}) {
      if(kill == true) {
        window.cancelAnimationFrame(this._animationRequestID)
      } else {
        this._animationRequestID = requestAnimationFrame(this.animate)
        this.curObj.render(this.global.scene, this.global.camera)
      }
    }
  },
  created() {
    // An initial size has to be set, this is immediately resized again in mount()
    this.size = {w: 0, h: 0}
    this.curObj.setSize(this.size.w, this.size.h)
    this.global.rendererSize = this.size
    this.global.rendererDom = this.curObj.domElement
  },
  mounted() {
    this.$refs.container.appendChild(this.curObj.domElement)
    this.onResize()
    this.animate()
    window.addEventListener('resize', this.onResize)
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
    this.animate({kill: true})
  }
}
</script>
