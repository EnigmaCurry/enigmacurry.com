<template>
  <div class="threejs_container" ref="threejs_container">
  </div>
</template>

<style scoped>
.threejs_container {
    width: 100vw;
    height: 99vh;
}
</style>

<script>
import * as Three from 'three'
import * as _ from 'lodash'

export default {
  data() {
    return {
      params: {
        animate: true
      }
    }
  },
  methods: {
    _setup: function() {
      // Setup container, renderer, scene, camera...
      this.container = this.$refs.threejs_container
      this.scene = new Three.Scene()
      this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 10)
      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.container.appendChild(this.renderer.domElement)
      this.setSize()
      this.resizeEventCallback = _.debounce(this.setSize, 200)
    },
    init: function() {
      // Create Scene Objects ...
    },
    update: function() {
      // Update Scene each frame ...
    },
    _animate: function() {
      // Animate a single frame, or run continuously if this.params.animate == true
      this.update()
      this.renderer.render(this.scene, this.camera)
      if (this.params.animate) {
        requestAnimationFrame(this._animate)
      }
    },
    setSize: function() {
      let width = this.container.clientWidth
      let height = this.container.clientHeight
      this.renderer.setSize(width, height)
      this.camera.aspect = (width / height)
      this.camera.updateProjectionMatrix()
      this._animate()
    }
  },
  mounted() {
    this._setup()
    this.init()
    window.addEventListener('resize', this.resizeEventCallback, true)
    this._animate()
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventCallback)
  }
}
</script>
