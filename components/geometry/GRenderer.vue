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
}
</style>

<script>
import * as Three from 'three'
import Stats from "~/lib/stats"

export default {
  props: {
    showStats: {type: Boolean, default: false},
  },
  provide () {
    return {
      renderer: this,
      parentObj: null, // avoid "injection not found" warning
      _baseUrl: null
    }
  },
  data() {
    const webGLRenderer = new Three.WebGLRenderer({antialias: true, alpha: true})
    return {
      webGLRenderer,
      sceneData: [], // List of GScenes (Scene, cameras, currentCamera)
      size: {width: 0, height: 0} //initialized in onResize
    }
  },
  created() {
    this.webGLRenderer.autoClear = false
    if (this.showStats) {
      this.stats = new Stats()
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)      
    }
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
        this.size = {width: this.$el.clientWidth, height: this.$el.clientHeight}
      }
      this.webGLRenderer.setSize(this.size.width, this.size.height)
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
      this.webGLRenderer.clear()
      let scenesRendered = 0
      //Render all scenes with active cameras, in order:
      for (let sd=0; sd < this.sceneData.length; sd++){
        const gscene = this.sceneData[sd]
        if (gscene.currentCamera != null) {
          const scene = gscene.curObj
          const camera = gscene.cameras[gscene.currentCamera]
          if (scenesRendered > 0) {
            this.webGLRenderer.clearDepth()
          }
          this.webGLRenderer.render(scene, camera)
          scenesRendered += 1
        }
      }
    },
    animate: function({kill=false} = {}) {
      if (kill === true) {
        window.cancelAnimationFrame(this._animationRequestID)
      } else {
        this._animationRequestID = requestAnimationFrame(this.animate)
        if (this.showStats) {
          this.stats.begin()
          this.render()
          this.stats.end()
        } else {
          this.render()
        }
      }
    }
  },
}
</script>
