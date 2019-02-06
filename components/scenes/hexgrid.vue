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

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 200},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.1},
    generations: {type: Number, default: 6},
  },
  data() {
    return {
      scene: new Three.Scene(),
      hexGeometry: new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6),
      hexMaterials: [
        new Three.MeshBasicMaterial({color: 0xffffff}),
        new Three.MeshBasicMaterial({color: 0xcccccc}),
        new Three.MeshBasicMaterial({color: 0x444444}),
        new Three.MeshBasicMaterial({color: 0x222222}),
      ],
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),
      hexMeshes: {}, /// 3-tuple stringified q,r,s -> mesh
    }
  },
  mounted() {
    const origin = new this.$hexagons.Hex(0,0,0)
    this.newHexMesh(origin)
    const addGeneration = (cells, generations) => {
      if (generations < 1) {
        return
      }
      const neighbors = []
      for(let c=0; c < cells.length; c++) {
        const o = cells[c]
        for(let d=0; d < 6; d++){
          const m = this.getNeighborMesh(o, d, generations)
          if (m.isNew === true) {
            neighbors.push(m.neighbor)
          }
        }
      }
      for(let n=0; n < neighbors.length; n++) {
        if (generations > 0) {
          addGeneration(neighbors, generations-1)
        }
      }
    }
    addGeneration([origin], this.generations)
  },
  methods: {
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
