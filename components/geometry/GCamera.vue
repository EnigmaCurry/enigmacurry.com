<template>
  <div ref="camera" class="g-camera">
  </div>
</template>

<script>
import * as Three from 'three'
import GObject3D from '~/components/geometry/GObject3D.vue'

export default {
  name: 'GCamera',
  inject: ['renderer', 'scene'],
  mixins: [GObject3D],
  props: {
    name: {type: String, required: true},
    orthographic: {type: Boolean, default: false},
    orthoStatic: {type: Boolean, default: false},
    position: {type: Object, default: () => {return {x: 0, y:0, z: -5}}},
    lookAt: {type: Object, default: () => {return {x: 0, y:0, z: 0}}},
    frustrum: {type: Object, default: () => {return {left:1, right:-1, top:1, bottom:-1}}},
    zoom: {type: Number, default: 1},
    zoomScale: {type: Number, default: null},
    rotation: {type: Object, default: () => {return {x:0, y: 0, z:0}}}
  },
  data () {
    return {
      fov: 70,
      near: 0.01,
      far: 1000
    }
  },
  watch: {
    zoomScale: {
      deep: true,
      handler (v) {
        this.onContainerResize(this.renderer.size.width, this.renderer.size.height)
      }
    },
  },
  created () {
    if (this.scene.cameras.hasOwnProperty(this.name)) {
      new Error('Duplicate camera with the name "'
                +this.name+'" already exists for this scene')
    }
    if (!this._camera) {
      if (this.orthographic) {
        // Initial frustrum is recomputed again in onContainerResize
        this._camera = new Three.OrthographicCamera(0,0,0,0, this.near, this.far)
      } else {
        // Initial aspect ratio is recomputed again in onContainerResize
        this._camera = new Three.PerspectiveCamera(this.fov, 1.77, this.near, this.far)
      }
    }
    this._camera.position.x = this.position.x
    this._camera.position.y = this.position.y
    this._camera.position.z = this.position.z
    this._camera.lookAt(new Three.Vector3(this.lookAt.x, this.lookAt.y, this.lookAt.z))
    
    this._camera.onContainerResize = this.onContainerResize
    this.scene.cameras[this.name] = this._camera
    if(this.scene.currentCamera === null) {
      this.scene.currentCamera = this.name
    }
  },
  destroyed() {
    delete this.scene.cameras[this.name]
    if (this.scene.currentCamera === this.name) {
      this.scene.currentCamera = null
    }
  },
  methods: {
    onContainerResize: function(width, height) {
      //console.log(width, height)
      if (this.orthographic) {
        if (this.orthoStatic) {
          this._camera.left = (this.frustrum.left)
          this._camera.right = (this.frustrum.right)
          this._camera.top = (this.frustrum.top)
          this._camera.bottom = (this.frustrum.bottom)
        } else {
          this._camera.left = (width * this.frustrum.left)
          this._camera.right = (width * this.frustrum.right)
          this._camera.top = (height * this.frustrum.top)
          this._camera.bottom = (height * this.frustrum.bottom)
        }
      } else {
        this._camera.aspect = width / height
      }
      if (this.zoomScale != null) {
        this._camera.zoom = ((width > height) ? height : width) / this.zoomScale
        //console.log("setting zoomScale", this._camera.zoom)
      } else {
        //console.log("setting zoom", this._camera.zoom)
        this._camera.zoom = this.zoom
      }
      this._camera.updateProjectionMatrix()
    }
  }
}
</script>
