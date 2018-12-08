<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <!-- <g-grid :divisions="10"/> -->

     <g-group name="earth" :position="earthPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[earthRadius, 64]" />
          <material type="MeshBasic" :options="{color: 'blue'}" />
        </g-mesh>
      </g-group>

      <g-group name="sun" :position="sunPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[sunRadius, 64]" />
          <material type="MeshBasic" :options="{color: 'yellow'}" />
        </g-mesh>
      </g-group>

     <g-group name="planet" :position="planetPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[planetRadius, 64]" />
          <g-material :obj="planetMaterial" />
        </g-mesh>
      </g-group>
      <animation :fn="animate" :speed="1"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

export default {
  props: {
    animated: {type: Boolean, default: true},
    backgroundClass: {type: String, default: "deepfield-halfoct-ngon4"}
  },
  data() {
    let AU = 1
    let year = 365.256
    let earth = (time) => { return {x: 0, y: 0} }
    let sun = this.$geometry.epicycle(1 * AU, 1, earth)
    let planets = {
      mercury: {
        name: "mercury",
        color: 'grey',
        orbit: 0.387098 * AU,
        orbitRatio: (87.969 / year),
        solarYearsToDraw: 32,
        zoom: 2,
        rate: 1
      },
      venus: {
        name: "venus",
        color: 'green',
        orbit: 0.7233 * AU,
        orbitRatio: (224.701 / year),
        solarYearsToDraw: 32,
        zoom: 2,
        rate: 1
      },
      mars: {
        name: "mars",
        color: 'red',
        orbit: 1.524 * AU,
        orbitRatio: (686.971 / year),
        solarYearsToDraw: 32,
        zoom: 3,
        rate: 1
      },
      jupiter: {
        name: "jupiter",
        color: "orange",
        orbit: 5.20445 * AU,
        orbitRatio: (4332.59 / year),
        solarYearsToDraw: 83,
        zoom: 10,
        rate: 5
      }
    }
    
    return {
      scene: new Three.Scene(),
      system: new Three.Group(),
      planetMaterial: new Three.MeshBasicMaterial({ color: 'orange' }),
      earth, earthRadius: 0.05, earthPosition: new Three.Vector3(),
      sun, sunRadius: 0.05, sunPosition: new Three.Vector3(),
      planets,
      planetPlaylist: ['venus', 'mercury', 'mars', 'jupiter'],
      playlistIndex: -1,
      planetRadius: 0.05, planetPosition: new Three.Vector3(),
      currentTime: 0,
      rateMultiplier: 0.005,
      orbitMeshes: [],
      systemFinished: false,
      zoom: 1,
    }
  },
  created() {
    this.orbitMaterial = new Three.LineBasicMaterial({color: 'white'})
    this.newSystem()
  },
  mounted() {
    document.getElementById('bg').classList.add(this.backgroundClass)
  },
  methods: {
    newSystem() {
      for( let o=0; o < this.orbitMeshes.length; o++ ) {
        let mesh = this.orbitMeshes[o]
        mesh.geometry.dispose()
        this.scene.remove(mesh)
      }
      this.playlistIndex = (this.playlistIndex + 1) % this.planetPlaylist.length
      this.planet = this.planets[this.planetPlaylist[this.playlistIndex]]
      this.epicycle = this.$geometry.epicycle(this.planet.orbit, this.planet.orbitRatio, this.sun)
      
      this.orbitMeshes = []
      this.newOrbitMesh()
      
      this.currentTime = 0
      this.sunRevolutions = 0
      this.planetRevolutions = 0
      this.systemFinished = false
      this.zoom = this.planet.zoom
      let planetColor = new Three.Color(this.planet.color)
      this.planetMaterial.color.setRGB(planetColor.r, planetColor.g, planetColor.b)
    },
    newOrbitMesh() {
      if (typeof(this.orbitPoints) != "undefined") {
        this.previousOrbitPoints = this.orbitPoints
      }
      this.maxOrbitPoints = 100 * 3
      this.currentOrbitPoint = 0
      this.orbitGeometry = new Three.BufferGeometry()
      this.orbitPoints = new Float32Array( this.maxOrbitPoints )
      this.orbitGeometry.addAttribute('position', new Three.BufferAttribute(this.orbitPoints, 3))
      this.orbitGeometry.setDrawRange(0, 0)
      this.orbitMesh = new Three.Line(this.orbitGeometry, this.orbitMaterial)
      this.orbitMeshes.push(this.orbitMesh)
      this.scene.add(this.orbitMesh)
    },
    animate() {
      this.currentTime += this.planet.rate * this.rateMultiplier
      // Create new orbit meshes every once in awhile...
      if (this.sunRevolutions < this.planet.solarYearsToDraw) {
        if (this.currentOrbitPoint >= this.maxOrbitPoints && this.sunRevolutions < this.planet.solarYearsToDraw) {
          let existingVertices = this.orbitGeometry.attributes.position.array
          let priorOrbitPoint = this.currentOrbitPoint
          this.newOrbitMesh()
          let orbitVertices = this.orbitGeometry.attributes.position.array
          orbitVertices[0] = this.previousOrbitPoints[priorOrbitPoint-3]
          orbitVertices[1] = this.previousOrbitPoints[priorOrbitPoint-2]
          orbitVertices[2] = this.previousOrbitPoints[priorOrbitPoint-1]
          this.currentOrbitPoint = 3
          this.orbitGeometry.setDrawRange(0, 1)
        }
        
        let sun = this.sun(this.currentTime)
        let planet = this.epicycle(this.currentTime)
        this.sunPosition.x = sun.x
        this.sunPosition.y = sun.y
        this.planetPosition.x = planet.x
        this.planetPosition.y = planet.y
        
        if (this.sunRevolutions < this.planet.solarYearsToDraw) {
          let orbitVertices = this.orbitGeometry.attributes.position.array
          orbitVertices[this.currentOrbitPoint++] = this.planetPosition.x
          orbitVertices[this.currentOrbitPoint++] = this.planetPosition.y
          orbitVertices[this.currentOrbitPoint++] = 0
          this.orbitGeometry.attributes.position.needsUpdate = true
          this.orbitGeometry.setDrawRange(0, this.currentOrbitPoint / 3)
        }
        
        if (this.sunRevolutions < sun.revolutions) {
          this.sunRevolutions = sun.revolutions
          //console.log("Earth year: ", this.sunRevolutions)
        }
        if (this.planetRevolutions < planet.revolutions) {
          this.planetRevolutions = planet.revolutions
          //console.log("Planet year: ", this.planetRevolutions)
        }
      } else if (this.systemFinished === false) {
        this.systemFinished = true
        setTimeout(() => {
          this.newSystem()
        }, 5000)
      }
    } 
  },
  beforeDestroy() {
    document.getElementById('bg').classList.remove(this.backgroundClass)
  }
}
</script>
