<template>
  <div class="threejs_container" ref="threejs_container">
  </div>
</template>

<script>
import * as Three from 'three'
import * as _ from 'lodash'

export default {
  data() {
    return {
      params: {
        animate: true,
        camera: {
          type: 'perspective',
          fov: 70,
          frustrum: {
            // if type is 'static', these are absolute values passed directly to the camera
            // if type is 'dynamic', these scale the current window dimensions
            type: 'dynamic',
            left: -200,
            right: 200,
            top: -200,
            bottom: 200
          },
          near: 0.01,
          far: 10,
          position: { x: 0, y: 0, z: 5 }
        },
        container: {
          width: '100vw',
          height: '99vh'
        }
      }
    }
  },
  methods: {
    _setup: function() {
      // Setup container, renderer, scene, camera...
      this.container = this.$refs.threejs_container
      this.renderer = new Three.WebGLRenderer({ antialias: true })
      this.scene = new Three.Scene()
      
      // Camera parameters and initial position
      let width = this.container.clientWidth
      let height = this.container.clientHeight
      let aspect = width / height
      if (this.params.camera.type == 'perspective') {
        this.camera = new Three.PerspectiveCamera(
          this.params.camera.fov, aspect, this.params.camera.near, this.params.camera.far
        )
      } else if (this.params.camera.type == 'orthographic') {
        this.camera = new Three.OrthographicCamera(
          0,0,0,0, //frustrum initialized in setSize
          this.params.camera.near,
          this.params.camera.far
        )
      }
      this.camera.position.x = this.params.camera.position.x
      this.camera.position.y = this.params.camera.position.y
      this.camera.position.z = this.params.camera.position.z
      
      this.container.appendChild(this.renderer.domElement)
      // Auto (re)size with debounce
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
      this.container.style.width = this.params.container.width
      this.container.style.height = this.params.container.height
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.camera.aspect = (this.container.clientWidth / this.container.clientHeight)
      if (this.camera instanceof Three.OrthographicCamera) {
        if (this.params.camera.frustrum.type == 'dynamic') {
          this.camera.left = this.container.clientWidth / this.params.camera.frustrum.left
          this.camera.right = this.container.clientWidth / this.params.camera.frustrum.right
          this.camera.top = this.container.clientHeight / this.params.camera.frustrum.top
          this.camera.bottom = this.container.clientHeight / this.params.camera.frustrum.bottom
        } else {
          this.camera.left =  this.params.camera.frustrum.left
          this.camera.right = this.params.camera.frustrum.right
          this.camera.top = this.params.camera.frustrum.top
          this.camera.bottom = this.params.camera.frustrum.bottom
        }
      }
      this.camera.updateProjectionMatrix()
      this.renderer.render(this.scene, this.camera)
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
