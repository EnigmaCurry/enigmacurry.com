<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom" :position="{x:universeSize.width / 2, y: universeSize.height / 2, z:-1}" :lookAt="{x:universeSize.width / 2, y:universeSize.height / 2, z:0}"/>
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'
import Visibility from 'visibilityjs'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    backgroundClass: {type: String, default: "oceanic-network"},
    backgroundAlpha: {type: Number, default: 0.55},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 100},
    //defaultPreset: {type: String, default: 'Gitter'},
    defaultPreset: {type: String, default: 'Stringy2'},
    particleScale: {type: Number, default: 0.65},
    particleSegments: {type: Number, default: 32},
    universeScale: {type: Number, default: 200},
    universeWrap: {type: Boolean, default: true},
    universeInterval: {type: Number, default: 120},
    playlist: {type: Array, default: () => [
      {preset: "Stringy2", forceScale: 0.25, numParticles: 1000, sizePercentiles: {0:1}},
      {preset: "Stringy2", forceScale: 1, numParticles: 800, sizePercentiles: {0:1, 90:2}},
      {preset: "Chaos", forceScale: 0.1, numParticles: 1000, sizePercentiles: {0:2, 90:3}},
      {preset: "Small Clusters", forceScale: 1, numParticles: 1000, sizePercentiles: {0:1, 20:2, 90:3}},
      {preset: "Gitter", forceScale: 0.45, numParticles: 1000, sizePercentiles: {0:1}},
      {preset: "Gitter", forceScale: 0.1, numParticles: 1200, sizePercentiles: {0:1, 90:2, 99:3}},
    ]},
  },
  data() {
    return {
      scene: new Three.Scene(),
      particleGeometries: {}, // particle_type -> Three.Geometry
      particleMaterials: {}, // particle_type -> Three.Material
      particleMeshes: {}, // particle_id -> Three.Mesh
      lastStepTime: 0,
      universeSize: {width: this.universeScale, height: this.universeScale},
      waitingForBrokeredStep: false,
    }
  },
  watch: {
    universeSize: {
      handler(size) {
        this.universe.setSize(size.width, size.height)
      }
    }
  },
  methods: {
    animate(tt) {
      this.universe.step()
      for (let p=0; p < this.universe.particles.length; p++) {
        const particle = this.universe.particles[p]
        const mesh = this.particleMeshes[particle.id]
        mesh.position.x = particle.x
        mesh.position.y = particle.y
      }
    },
    getPreset(preset) {
      return {
        ...this.$particles.getSettingsForPreset(preset),
        preset,
        wrap: this.universeWrap
      }
    },
    createParticleObject(particle, color) {
      let c = new Three.Color(color.r, color.g, color.b)
      let geom, mat
      if (this.particleGeometries.hasOwnProperty(particle.radius)) {
        geom = this.particleGeometries[particle.radius]
      } else {
        geom = this.particleGeometries[particle.radius] = new Three.CircleGeometry(
          particle.radius * this.particleScale, this.particleSegments)
      }
      if (this.particleMaterials.hasOwnProperty(particle.type)) {
        mat = this.particleMaterials[particle.type]
      } else {
        mat = this.particleMaterials[particle.type] = new Three.MeshBasicMaterial({color: c, transparent: true, opacity: 0.5})
      }
      let mesh = new Three.Mesh(geom, mat)
      mesh.position.x = particle.x
      mesh.position.y = particle.y
      this.particleMeshes[particle.id] = mesh
      this.scene.add(mesh)
      return mesh
    },
    newUniverse(preset, settings={}) {
      settings = Object.assign({
        width: this.universeSize.width,
        height: this.universeSize.height,
        wrap: this.universeWrap,
      }, this.getPreset(preset), settings)
      
      const existingParticleIDs = Object.keys(this.particleMeshes)
      for (let p=0; p < existingParticleIDs.length; p++) {
        this.scene.remove(this.particleMeshes[existingParticleIDs[p]])
      }
      console.log({preset: settings.preset, numParticles: settings.numParticles, sizePercentiles: JSON.parse(JSON.stringify(settings.sizePercentiles))})
      const universe = new this.$particles.Universe(settings)
    	universe.reSeed(settings)
      
      for (let p=0; p < universe.particles.length; p++) {
        const particle = universe.particles[p]
        this.createParticleObject(particle, universe.types.colors[particle.type])
      }
      
      return universe
    },
    newUniverseInterval() {
      const settings = this.playlist[0]
      this.playlist.push(this.playlist.shift())
      this.universe = this.newUniverse(settings.preset, settings)
    },
    handleKeyboardInput(event)  {
      var keyCode = event.which;
      if (keyCode == 32) { // Spacebar
        Visibility.stop(this.visibilityInterval)
        this.newUniverseInterval()
        this.visibilityInterval = Visibility.every(this.universeInterval * 1000, this.newUniverseInterval)
      }
    }
  },
  created() {
    this.newUniverseInterval()
    document.addEventListener("keydown", this.handleKeyboardInput)
    this.visibilityInterval = Visibility.every(this.universeInterval * 1000, this.newUniverseInterval)
  },
  mounted() {
    //Wait for the renderer to report a size:
    let intervalID = setInterval(() => {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      if (width > 0 && height > 0) {
        clearInterval(intervalID)
        if (width > height) {
          this.universeSize = {width: (width/height) * this.universeScale,
                               height: this.universeScale}
        } else {
          this.universeSize = {width: this.universeScale,
                               height: (height/width) * this.universeScale}
        }
      }
    }, 100)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyboardInput)
  },
}
</script>
