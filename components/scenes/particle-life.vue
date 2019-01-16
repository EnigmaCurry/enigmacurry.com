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
import Stats from "~/lib/stats"

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 100},
    defaultPreset: {type: String, default: 'Stringy2'},
    particleScale: {type: Number, default: 0.5},
    particleSegments: {type: Number, default: 3},
    universeScale: {type: Number, default: 200},
    universeWrap: {type: Boolean, default: true},
    universeForceScale: {type: Number, default: 0.25},
    numParticles: {type: Number, default: 1000},
    numSuperParticles: {type: Number, default: 3}
  },
  data() {
    return {
      scene: new Three.Scene(),
      particleGeometries: {}, // particle_type -> Three.Geometry
      particleMaterials: {}, // particle_type -> Three.Material
      particleMeshes: {}, // particle_id -> Three.Mesh
      lastStepTime: 0,
      universeSize: {width: this.universeScale, height: this.universeScale}
    }
  },
  watch: {
    universeSize: {
      handler(size) {
        console.log(size)
        this.universe.setSize(size.width, size.height)
      }
    }
  },
  methods: {
    animate(tt) {
      this.stats.begin()
      this.universe.step()
      this.stats.end()
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
    universeSettings.width = this.universeSize.width
    universeSettings.height = this.universeSize.height
    universeSettings.wrap = this.universeWrap
    universeSettings.forceScale = this.universeForceScale
    universeSettings.numParticles = this.numParticles
    this.universe = this.newUniverse(universeSettings)
    
    // Create a few Super Particles!
    // const particleIndex=this.universe.particles.length - 1
    // this.universe.setPopulation(this.universe.types.length + 1, particleIndex + 1 + this.numSuperParticles)
    // for (let n=0; n < this.numSuperParticles; n++) {
    //   console.log("hierer")
    //   const superParticle = this.universe.particles[particleIndex + n]
    //   // Object.assign(superParticle, {
    //   //   x: universeSettings.width / 2, y: universeSettings.height / 2,
    //   //   radius: 3,
    //   //   mass: 3,
    //   //   type: this.universe.types.length
    //   // })
    //   // superParticle.object = this.createParticleObject(superParticle, {r:1,g:1,b:1})
    //   console.log(superParticle)
    // }
    
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  },
  mounted() {
    //Wait for the renderer to report a size:
    console.log(this.universeSize.width, this.universeSize.height)
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
        console.log(this.universeSize.width, this.universeSize.height)
      }
    }, 100)
  }
}
</script>
