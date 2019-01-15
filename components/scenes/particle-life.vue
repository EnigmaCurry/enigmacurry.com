<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom" :position="{x:universeWidth / 2, y: universeHeight / 2, z:-1}" :lookAt="{x:universeWidth / 2, y:universeHeight / 2, z:0}"/>
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 100},
    defaultPreset: {type: String, default: 'Test1'},
    particleScale: {type: Number, default: 0.5},
    particleSegments: {type: Number, default: 32},
    universeWidth: {type: Number, default: 200},
    universeHeight: {type: Number, default: 200},
    universeWrap: {type: Boolean, default: false},
  },
  data() {
    return {
      scene: new Three.Scene(),
      particleGeometries: {}, // particle_type -> Three.Geometry
      particleMaterials: {}, // particle_type -> Three.Material
      particleMeshes: {}, // particle_id -> Three.Mesh
      lastStepTime: 0
    }
  },
  methods: {
    animate(tt) {
      this.universe.step()
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
        mat = this.particleMaterials[particle.type] = new Three.MeshBasicMaterial({color: c, transparent: true})
      }
      let mesh = new Three.Mesh(geom, mat)
      mesh.position.x = particle.x
      mesh.position.y = particle.y
      this.particleMeshes[particle.id] = mesh
      this.scene.add(mesh)
      return mesh
    },
    newUniverse(settings) {
      const universe = new this.$particles.Universe(
        settings.numTypes,
        settings.numParticles,
        settings.width,
        settings.height,
        this.createParticleObject,
        settings.forceScale
      )
      universe.wrap = settings.wrap
    	universe.reSeed(
		    settings.attractMean,
    		settings.attractStd,
    		settings.minRLower,
    		settings.minRUpper,
    		settings.maxRLower,
		    settings.maxRUpper,
    		settings.friction,
	    	settings.flatForce
    	)
      return universe
    }
  },
  created() {
    const universeSettings = this.getPreset(this.defaultPreset)
    universeSettings.width = this.universeWidth
    universeSettings.height = this.universeHeight
    universeSettings.wrap = this.universeWrap
    universeSettings.forceScale = 0.01
    this.universe = this.newUniverse(universeSettings)
  },
}
</script>
