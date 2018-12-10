<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :clearAlpha="0.8" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :divisions="10" :size="zoom" v-if="showGrid"/>

      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Visibility from 'visibilityjs'
import {shuffle} from 'underscore'
import ColorScheme from 'color-scheme'

const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const choice = (choices) => {
  return shuffle(choices)[0]
}


export default {
  props: {
    backgroundClass: {type: String, default: "pare4Dolia-8"},    
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 2},
    graphInterval: {type: Number, default: 45},
    lineOpacity: {type: Number, default: 0.33},
  },
  data() {
    return {
      scene: new Three.Scene(),
      speed: 75,
      time: 0,
      interval: 0.005,
      radius: 18,
      x: 0,
      y: 0,
      graphMeshes: [],
      graphPointsPerMesh: 1000 * 3,
      currentGraphPoint: 0,
    }
  },
  created() {
    this.newGraph()
    Visibility.every(this.graphInterval * 1000, this.newGraph)
  },
  mounted() {
    document.getElementById('bg').classList.add(this.backgroundClass)
  },
  beforeDestroy() {
    document.getElementById('bg').classList.remove(this.backgroundClass)
  },
  methods: {
    animate() {
      this.step()
    },
    newGraph() {
      let colorScheme = new ColorScheme()
          .from_hue( randomInt(0,359) )
          .scheme(choice(['contrast','tetrade','triade','analogic','mono']))
          .variation(choice(['default','pale','hard','light']))
          .colors()
      let colors = []
      for (let c=0; c < colorScheme.length; c++) {
        colors.push(new Three.Color('#' + colorScheme[c]))
      }
      this.materials = []
      for (let c=0; c < colors.length; c++) {
        this.materials.push(new Three.LineBasicMaterial({color: colors[c], transparent: true, opacity: this.lineOpacity}))
      }
      this.time = 0
      this.pendulums = this.randomPendulums()
      
      for ( let o=0; o < this.graphMeshes.length; o++ ) {
        let mesh = this.graphMeshes[o]
        mesh.geometry.dispose()
        this.scene.remove(mesh)
      }
      this.graphMeshes = []
      this.graphPoints = null
      this.newGraphMesh()
    },
    newGraphMesh() {      
      if (this.graphPoints === null) {
        this.graphPoints = new Float32Array( this.graphPointsPerMesh )        
        this.currentGraphMeshPoint = 0
      } else {
        let previousGraphPoints = this.graphPoints
        this.graphPoints = new Float32Array( this.graphPointsPerMesh )
        this.graphPoints[0] = previousGraphPoints[previousGraphPoints.length-3]
        this.graphPoints[1] = previousGraphPoints[previousGraphPoints.length-2]
        this.graphPoints[2] = previousGraphPoints[previousGraphPoints.length-1]
        this.currentGraphMeshPoint = 3
      }
      this.graphGeometry = new Three.BufferGeometry()
      this.graphGeometry.addAttribute('position', new Three.BufferAttribute(this.graphPoints, 3))
      this.graphMesh = new Three.Line(this.graphGeometry, this.materials[this.graphMeshes.length % this.materials.length])
      this.graphMeshes.push(this.graphMesh)
      this.scene.add(this.graphMesh)
    },    
    step() {
      for (let i=0; i < this.speed; ++i) {
        this.time += this.interval
        this.swing()
        if (this.currentGraphMeshPoint >= this.graphPointsPerMesh) {
          this.newGraphMesh()
        }
        let graphVertices = this.graphGeometry.attributes.position.array
        graphVertices[this.currentGraphMeshPoint++] = this.x
        graphVertices[this.currentGraphMeshPoint++] = this.y
        graphVertices[this.currentGraphMeshPoint++] = 0
        this.graphGeometry.attributes.position.needsUpdate = true
        this.graphGeometry.setDrawRange(0, this.currentGraphMeshPoint / 3)
      }
    },
    swing() {
      let p0 = this.pendulums[0]
      let p1 = this.pendulums[1]
      let p2 = this.pendulums[2]
      p0.x = p0.amplitude.x * Math.exp(-this.time / p0.damping) * Math.sin(2.0 * Math.PI * p0.frequency * this.time + p0.phase.x)
      p0.y = p0.amplitude.y * Math.exp(-this.time / p0.damping) * Math.sin(2.0 * Math.PI * p0.frequency * this.time + p0.phase.y)
      p1.x = p1.amplitude.x * Math.exp(-this.time / p1.damping) * Math.sin(2.0 * Math.PI * p1.frequency * this.time + p1.phase.x)
      p1.y = p1.amplitude.y * Math.exp(-this.time / p1.damping) * Math.sin(2.0 * Math.PI * p1.frequency * this.time + p1.phase.y)
      p2.x = p2.amplitude.x * Math.exp(-this.time / p2.damping) * Math.sin(2.0 * Math.PI * p2.frequency * this.time + p2.phase.x)
      p2.y = p2.amplitude.y * Math.exp(-this.time / p2.damping) * Math.sin(2.0 * Math.PI * p2.frequency * this.time + p2.phase.y)
      let cd = Math.sqrt( Math.pow(this.radius + p1.x - p0.x, 2) + Math.pow(this.radius + p0.y - p1.y, 2) )
      let gamma = Math.acos( cd / (2 * this.radius) ) - Math.acos( (this.radius + p0.y - p1.y) / cd )
      let px = p0.x - (this.radius * Math.sin(gamma))
      let py = this.radius + p0.y - (this.radius * Math.cos(gamma))
      this.x = px - p2.x
      this.y = py - p2.y
    },
    randomPendulums() {
      let ratios = [
        [3* 1.000001, 6 * 1.0001, 12 * 0.9998],
        [1, 1, 3.002],
        [7 * 1.00001, 28 * 0.999998, 7],
        [4.002, 8, 2],
        [32805, 31805.002, 32805.01],
        [3.301, 6.6, 9.9]
      ]
      let ratio = choice(ratios)
      
      return [
        {amplitude: {x: randomInt(1,2), y: randomInt(1,2)},
         phase: {x: randomInt(0, 360) * (Math.PI/180), y: randomInt(0, 360) * (Math.PI/180)},
         damping: randomInt(100, 488),
         frequency: ratio[0]},
        {amplitude: {x: randomInt(1,2), y: randomInt(1,2)},
         phase: {x: randomInt(0, 360) * (Math.PI/180), y: randomInt(0, 360) * (Math.PI/180)},
         damping: randomInt(100, 488),
         frequency: ratio[1]},
        {amplitude: {x: randomInt(1,2), y: randomInt(1,2)},
         phase: {x: randomInt(0, 360) * (Math.PI/180), y: randomInt(0, 360) * (Math.PI/180)},
         damping: randomInt(100, 488),
         frequency: ratio[2]},
      ]      
    }
  }
}
</script>
