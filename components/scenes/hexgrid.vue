<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom"/>
    <g-light :hex="0xffffff" :intensity="1" :position="{ y: 0, z: 1500 }"/>
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
    zoom: {type: Number, default: 500},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.1},
    generations: {type: Number, default: 351},
    backgroundClass: {type: String, default: "stair-stalks"},
    backgroundAlpha: {type: Number, default: 0.8},
  },
  data() {
    return {
      scene: new Three.Scene(),
      generationTime: 0,
      cycle: 0,
      colorCycle: 0,
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
      this.generationTime = tt
      // randomly choose two of the spirals:
      const spirals = [this.spirals[this.cycle % this.spirals.length],
                       this.spirals[(this.cycle+2) % this.spirals.length]]
      this.nextGeneration(spirals)
    },
    reset({keepMeshes=false} = {}) {
      this.finished = false
      this.generation = 0
      this.cycle += 1
      this.colorCycle += this.cycle % 6 === 0 ? 1 : 0
      const origin = new this.$hexagons.Hex(0,0,0)
      this.origins = []
      if(keepMeshes) {
        for (let d=0; d < 6; d++) {
          this.spirals[d] = spiralGenerator(this.generations, origin, d)
          this.origins.push(origin)
        }
      } else {
        this.scene.remove.apply(this.scene, Object.values(this.hexMeshes))
        this.hexMeshes = {}
        this.origins = []
        this.spirals = []
        this.colors = [
          [{start: "#EEFF00", end: "#333333"},
           {start: "#E8900C", end: "#333333"},
           {start: "#FF0000", end: "#333333"},
           {start: "#660CE8", end: "#333333"},
           {start: "#23BDFF", end: "#333333"},
           {start: "#FFFFFF", end: "#333333"}
          ],
          [{start: "#3D5359", end: "#333333"},
           {start: "#185E93", end: "#333333"},
           {start: "#0E7F8C", end: "#333333"},
           {start: "#B9CB4A", end: "#333333"},
           {start: "#FE522C", end: "#333333"},
           {start: "#FFFFFF", end: "#333333"}
          ],
          [{start: "#2F254C", end: "#333333"},
           {start: "#2F8A91", end: "#333333"},
           {start: "#FEF4BD", end: "#333333"},
           {start: "#D8A9A1", end: "#333333"},
           {start: "#AA4776", end: "#333333"},
           {start: "#FFFFFF", end: "#333333"},
          ],
          [{start: "#1E3332", end: "#333333"},
           {start: "#3F756B", end: "#333333"},
           {start: "#7CABA4", end: "#333333"},
           {start: "#F6F2E1", end: "#333333"},
           {start: "#E0A35A", end: "#333333"},
           {start: "#FFFFFF", end: "#333333"},
          ],
          [{start: "#818F9E", end: "#333333"},
           {start: "#425066", end: "#333333"},
           {start: "#414851", end: "#333333"},
           {start: "#766041", end: "#333333"},
           {start: "#DAB699", end: "#333333"},
           {start: "#FFFFFF", end: "#333333"},
          ],
          
        ]
        this.getHexMesh(origin)
        for (let d=0; d < 6; d++) {
          this.spirals.push(spiralGenerator(this.generations, origin, d))
          this.origins.push(origin)
        }
      }
    },
    nextGeneration(spirals, onComplete) {
      if (this.generation < this.generations) {
        for (let s=0; s < spirals.length; s++) {
          const spiral = spirals[s]
          const nHex = this.origins[s] = this.origins[s].neighbor(spiral.next().value)
          const colorInfo = this.colors[this.colorCycle % this.colors.length][(this.cycle-1) % 6]
          const color = (new Three.Color(colorInfo.start)).lerp(
            new Three.Color(colorInfo.end), this.generation / this.generations)
          this.getHexMesh(nHex, color)
        }
        this.generation += 1
      } else {
        this.reset({keepMeshes: true})
        if (onComplete != undefined) { onComplete() }
      }
    },
    _newHexMesh(hex, color=0xffffff) {
    },
    getNeighborMesh(hex, direction, matIndex) {
      const neighbor = hex.neighbor(direction)
      let {mesh, isNew}  = this.getHexMesh(neighbor)
      return {mesh, isNew, neighbor}
    },
    getHexMesh(hex, color=undefined) {
      let isNew = false, m = this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s]
      if (m === undefined) {
        isNew = true
        m = this._newHexMesh(hex, )
        color = color === undefined ? new Three.Color(1,1,1) : color
        const mat = new Three.MeshLambertMaterial({color})
        mat.opacity = 0.25
        const mesh = new Three.Mesh(this.hexGeometry, mat)
        const px = this.hexLayout.hexToPixel(hex)
        mesh.position.x = px.x
        mesh.position.y = px.y
        this.scene.add(mesh)
        this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s] = mesh
      } else if (color != undefined) {
        m.material.color.copy(color)
      }
      return {mesh: m, isNew}
    }
  },
  beforeDestroy() {
  },
  
}
</script>
