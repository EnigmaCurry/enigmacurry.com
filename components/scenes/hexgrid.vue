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
    zoom: {type: Number, default: 740},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.01},
    generations: {type: Number, default: 666},
    interval: {type: Number, default: 100},
  },
  data() {
    return {
      scene: new Three.Scene(),
      hexGeometry: new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6),
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),
      hexMeshes: {}, /// 3-tuple stringified q,r,s -> mesh
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    animate(tt) {
      this.nextGeneration()      
    },
    reset() {
      this.scene.remove.apply(this.scene, Object.values(this.hexMeshes))
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
      this.testMat = new Three.MeshBasicMaterial({color: 0xffffff})
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
        this.generation += 1
      } else if (!this.finished) {
        this.finished = true
        //setTimeout(this.reset, 20 * 1000)
      }
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
