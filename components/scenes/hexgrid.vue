<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom"/>
    <g-grid :divisions="10" v-if="showGrid"/>
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'
import Visibility from 'visibilityjs'

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
  },
  data() {
    return {
      scene: new Three.Scene(),
      generation: 0,
      spirals: [],
      origins: [],
      hexGeometry: new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6),
      hexMaterials: [
        new Three.MeshBasicMaterial({color: 0x666666}),
        new Three.MeshBasicMaterial({color: 0xeeeeee}),
        new Three.MeshBasicMaterial({color: 0xdddddd}),
        new Three.MeshBasicMaterial({color: 0xcccccc}),
        new Three.MeshBasicMaterial({color: 0xbbbbbb}),
        new Three.MeshBasicMaterial({color: 0xaaaaaa})
      ],
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),
      hexMeshes: {}, /// 3-tuple stringified q,r,s -> mesh
    }
  },
  mounted() {
    let origin = new this.$hexagons.Hex(0,0,0)
    this.newHexMesh(origin)    
    for (let d=0; d < 6; d++) {
      this.spirals.push(spiralGenerator(this.generations, origin, d))
      this.origins.push(origin)
    }
    this.nextGeneration()
    Visibility.every(100, () => {
      this.nextGeneration()
    })
  },
  methods: {
    nextGeneration() {
      if (this.generation < this.generations) {
        for (let s=0; s < this.spirals.length; s++) {
          const spiral = this.spirals[s]
          const nHex = this.origins[s] = this.origins[s].neighbor(spiral.next().value)
          this.newHexMesh(nHex, s)
        }
        this.generation += 1
      }
    },
    newHexMesh(hex, matIndex=0) {
      const mesh = new Three.Mesh(this.hexGeometry, this.hexMaterials[matIndex % this.hexMaterials.length])
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
        m = this.newHexMesh(nHex, matIndex)
      }
      return {mesh: m, isNew, neighbor: nHex}
    },
    getHexMesh(hex) {
      return this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s]
    }
  },
}
</script>
