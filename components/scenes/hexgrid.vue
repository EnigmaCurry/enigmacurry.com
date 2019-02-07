<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom"/>
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'

function *spiralGenerator(generations, origin, direction) {
  let order=0, n=0, d=direction
  for (let g=0; g < generations; g++) {
    if (order===0 || order===1 || n % order === 0) {
      order += 1
      n = 1
      if (d > 0) {
        d = (d - 1) % 6
      } else {
        d = 5
      }
    }
    n += 1
    yield d
  }
}

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 120},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.1},
    generations: {type: Number, default: 200},
    interval: {type: Number, default: 0.0001},
  },
  data() {
    return {
      scene: new Three.Scene(),
      generationTime: 0,
      hexGeometry: new Three.BufferGeometry().fromGeometry(new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6)),
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),
      hexMeshes: {}, /// 3-tuple stringified q,r,s -> mesh
    }
  },
  created() {
    this.reset()
  },
  methods: {
    animate(tt) {
      if (tt - this.generationTime > this.interval) {
        this.generationTime = tt
        this.nextGeneration()
      }
    },
    reset(keepMeshes=0) {
      if(!keepMeshes) {
        this.scene.remove.apply(this.scene, Object.values(this.hexMeshes))
        this.hexMeshes = {}
        this.origins = []
      }
      this.finished = false
      this.generation = 0
      this.hexMeshes = {}
      this.origins = []
      this.spirals = []
      this.colors = [{start: "#EEFF00", end: "#000000"},
                     {start: "#E8900C", end: "#000000"},
                     {start: "#FF0000", end: "#000000"},
                     {start: "#660CE8", end: "#000000"},
                     {start: "#23BDFF", end: "#000000"},
                     {start: "#FFFFFF", end: "#000000"}]
      //this.testMat = new Three.MeshBasicMaterial({color: 0xffffff})
      let origin = new this.$hexagons.Hex(0,0,0)
      this.newHexMesh(origin)
      for (let d=0; d < 6; d++) {
        this.spirals.push(spiralGenerator(this.generations, origin, d))
        this.origins.push(origin)
      }
    },
    nextGeneration() {
      if (this.generation < this.generations) {
        for (let s=0; s < this.spirals.length; s++) {
          const spiral = this.spirals[s]
          const nHex = this.origins[s] = this.origins[s].neighbor(spiral.next().value)
          const color = (new Three.Color(this.colors[s].start)).lerp(
            new Three.Color(this.colors[s].end), this.generation / this.generations)
          //console.log(color)
          this.newHexMesh(nHex, color)
        }
      } else if (!this.finished) {
        // Do this stuff only once, at the end of all generations:
        this.finished = true
        this.finishedMeshes = Object.values(this.hexMeshes)
        this.finishedColors = []
        for( let h=0; h < this.finishedMeshes.length; h++) {
          let m = this.finishedMeshes[h]
          this.finishedColors.push(m.material.color.clone())
        }
        // In x seconds, start over completetly:
        setTimeout(this.reset, 120 * 1000)
      } else {
        // Do this stuff after the generations complete, but before we reset:
        let meshes = this.finishedMeshes
        let flashRate = Math.atan(Math.sin(this.generation/222)) + 0.5
        let sineColor = new Three.Color(flashRate, flashRate, flashRate)
        for(let h=0; h < meshes.length; h++) {
          let color = meshes[h].material.color
          let origColor = this.finishedColors[h]
          color.copy(Math.random() > 0.01 ? origColor : origColor.lerp(sineColor, Math.random() > 0.95 ? 0.5 : 0.05))
        }
      }
      this.generation += 1
    },
    newHexMesh(hex, color=0xffffff) {
      const mat = new Three.MeshBasicMaterial({color})
      //const mat = this.testMat
      const mesh = new Three.Mesh(this.hexGeometry, mat)
      const px = this.hexLayout.hexToPixel(hex)
      mesh.position.x = px.x
      mesh.position.y = px.y
      this.scene.add(mesh)
      this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s] = mesh
      return mesh
    },
    getNeighborMesh(hex, direction, matIndex) {
      const nHex = hex.neighbor(direction)
      let m = this.getHexMesh(nHex)
      let isNew = false
      if(m === undefined) {
        isNew = true
        m = this.newHexMesh(nHex)
      }
      return {mesh: m, isNew, neighbor: nHex}
    },
    getHexMesh(hex) {
      return this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s]
    }
  },
  beforeDestroy() {
  },
  
}
</script>
