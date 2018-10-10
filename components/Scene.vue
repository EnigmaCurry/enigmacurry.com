<template>
  <div id="scene" ref="scene">
    <div class="threejs_container" ref="threejs_container">
    </div>
    <div class="music_player" ref="music_player">
      <iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/619307016%3Fsecret_token%3Ds-GE5ly&color=%23ff5500&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true"></iframe>
    </div>
  </div>
</template>

<style scoped>
  .threejs_container {
      position: fixed;
      z-index: 1;
  }
  .music_player {
      position: fixed;
      opacity: 0.75;
      bottom: 0;
      left:0;
      right:0;
      z-index: 2;
  }
  ::-webkit-scrollbar { 
      display: none; 
  }
</style>

<script>
import * as Three from 'three'
import * as Fullscreen from 'fullscreen-polyfill'
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
            left: -1,
            right: 1,
            top: -1,
            bottom: 1,
            zoom: 1
          },
          near: 0.01,
          far: 10,
          position: { x: 0, y: 0, z: 5 }
        },
        musicPlayer: {
          timeout: 10,
          height: '400px'
        },
        container: {
          width: '100vw',
          height: '100vh'
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
      this.bindKeys()
      this.musicPlayerShow()
    },
    init: function() {
      // Create Scene Objects ...
    },
    update: function() {
      // Update Scene each frame ...
    },
    _animate: function() {
      // Animate a single frame, or run continuously if this.params.animate == true
      if (this.params.animate) {
        requestAnimationFrame(this._animate)
      }
      this.update()
      this.renderer.render(this.scene, this.camera)
    },
    onResize: function() {
      //Called by setSize
    },
    setSize: function() {
      this.container.style.width = this.params.container.width
      this.container.style.height = this.params.container.height
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
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
      } else {
        this.camera.aspect = (this.container.clientWidth / this.container.clientHeight)
      }
      this.onResize()
      this.camera.updateProjectionMatrix()
      this.renderer.render(this.scene, this.camera)
    },
    ensureResize: function() {
      //Triply ensure that resize occurs:
      this.setSize()
      this.setSize()
      setTimeout(this.setSize, 500)
    },
    bindKeys: function() {
      let toggleFullscreen = function() {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.getElementById('scene').requestFullscreen()
        }        
      }
      document.addEventListener('dblclick', toggleFullscreen, false);
      document.addEventListener('mousemove', this.musicPlayerShow)
      document.addEventListener('touchmove', this.musicPlayerShow)
    },
    musicPlayerShow: function() {
      clearTimeout(this._musicPlayerTimeout)
      document.body.style.cursor = ''
      this.$refs.music_player.style.height = this.params.musicPlayer.height;
      this._musicPlayerVisible = true
      this._musicPlayerTimeout = setTimeout(this.musicPlayerHide, this.params.musicPlayer.timeout * 1000)
    },
    musicPlayerHide: function() {
      document.body.style.cursor = 'none'
      this.$refs.music_player.style.height = 0
      this._musicPlayerVisible = false
    }
  },
  mounted() {
    this._setup()
    this.init()
    window.addEventListener('resize', this.ensureResize, true)
    this._animate()
    this.setSize()
  },
  destroyed() {
    window.removeEventListener('resize', this.ensureResize)
  }
}
</script>
