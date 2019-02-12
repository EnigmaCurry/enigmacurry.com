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
import {shuffle, sample} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/ShaderPass"
import "imports-loader?THREE=three!../../node_modules/three/examples/js/shaders/KaleidoShader"
import Visibility from 'visibilityjs'
import vertexShader from 'raw-loader!~/assets/shaders/hexshader2.vertex.glsl'
import fragmentShader from 'raw-loader!~/assets/shaders/hexshader2.fragment.glsl'

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

function squareSpiralNumber(order) {
  // generation = 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 91, 105
  let generations = 0
  for (let o = 1; o <= order; o++) {
    generations += o
  }
  return generations
}

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.01},
    backgroundClass: {type: String, default: "nine-pow-cantor-general"},
    backgroundAlpha: {type: Number, default: 0.46},
    kaleidoscopeEnabled: {type: Boolean, default: false},
    kaleidoscopeInterval: {type: Number, default: 10},
    kaleidozoomInterval: {type: Number, default: 23},
    isEndless: { type: Boolean, default: true},
    generationInterval: {type: Number, default: 0.1}
  },
  data() {
    let scene = new Three.Scene()
    return {
      scene,
      generations: squareSpiralNumber(14),
      zoom: 250,
      cycle: 0,
      colorCycle: 0,
      hexGeometry: new Three.BufferGeometry().fromGeometry(new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6)),
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),
      hexMeshes: {}, /// 3-tuple stringified q,r,s -> mesh
      hexMaterials: [], /// Array of each hexMesh's material, for easy uniform updates 
      tweenGroup: new TWEEN.Group(),
      lastGenerationTime: (new Date().getTime() / 1000) + 2, //Delay 2 seconds before start
    }
  },
  created() {
    this.kaleidoShader = new Three.ShaderPass(Three.KaleidoShader)
    this.kaleidoShader.uniforms.sides.value = 3
    this.kaleidoShader.enabled = this.kaleidoscopeEnabled
    this.reset()
  },
  mounted() {
    this.renderer.addEffectPass(this.kaleidoShader)
    this.setupKaleidoTweens()
  },
  methods: {
    animate(tt) {
      this.tweenGroup.update()
      const t = new Date().getTime() / 1000
      if (t - this.lastGenerationTime > this.generationInterval) {
        this.lastGenerationTime = t
        this.nextGeneration(this.spirals)
      }
      for (let h=0; h < this.hexMaterials.length; h++){
        this.hexMaterials[h].uniforms.iTime.value = tt
        this.hexMaterials[h].uniforms.iGeneration.value = this.generation
      }
      //this.zoom = (Math.atan(Math.sin(tt/22)) * 100) + 200
    },
    kaleidoZoom(level, interval, callback) {
      const t = { level: this.kaleidoShader.uniforms.sides.value }
      this.kaleidoTween = new TWEEN.Tween(t, this.tweenGroup)
        .to({level}, interval * 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
          this.kaleidoShader.uniforms.sides.value = t.level
        })
        .onComplete(callback === undefined ? () => {} : callback)
        .start()
    },
    setupKaleidoTweens() {
      let direction = 1
      const kaleidoTween = () => {
        const nextLevel = sample([1,2,3,4,5,6,7,8,9,10])
        this.kaleidoZoom(nextLevel, this.kaleidozoomInterval, () => {
          this.kaleidoShader.enabled = true
          for (let h=0; h < this.hexMaterials.length; h++){
            this.hexMaterials[h].uniforms.iKaleidoscope.value = true
          }            
          setTimeout(kaleidoTween, this.kaleidoscopeInterval * 1000)
        })
        direction *= -1
      }
      if (this.kaleidoscopeEnabled) {
        kaleidoTween() /// recursive timeout..
      }
    },
    reset({keepMeshes=false} = {}) {
      this.finished = false
      this.generation = 0
      this.cycle += 1
      this.createdTime = new Date().getTime()
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
        this.hexMaterials = []
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
          const colorInfo = this.colors[this.colorCycle % this.colors.length][(this.cycle-1+s) % 6]
          const color = (new Three.Color(colorInfo.start)).lerp(
            new Three.Color(colorInfo.end), this.generation / this.generations)
          this.getHexMesh(nHex, color)
        }
        this.generation += 1
      } else if (this.isEndless) {
        this.reset({keepMeshes: true})
      }
      if (onComplete != undefined) {
        onComplete()
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
        //const mat = new Three.MeshLambertMaterial({color})
        const mat = new Three.ShaderMaterial( {
          uniforms: {iColor: {type:'v3', value: color},
                     iTime: {type: 'f', value: 0},
                     iGeneration: {type: 'i', value: 0},
                     iCreation: {type: 'i', value: this.generation},
                     iCreatedTime: {type: 'f', value: (new Date().getTime() - this.createdTime) / 1000},
                     iOpacity: {type: 'f', value: 0.3},
                     iKaleidoscope: {type: 'b', value: true}},
          vertexShader,
          fragmentShader,
          side: Three.DoubleSide,
          transparent: true
        } )
        this.hexMaterials.push(mat)
        const mesh = new Three.Mesh(this.hexGeometry, mat)
        const px = this.hexLayout.hexToPixel(hex)
        mesh.position.x = px.x
        mesh.position.y = px.y
        this.scene.add(mesh)
        this.hexMeshes[hex.q + ',' + hex.r + ',' + hex.s] = mesh
      } else if (color != undefined) {
        m.material.uniforms.iColor.value.copy(color)
      }
      return {mesh: m, isNew}
    }
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()    
  },
  
}
</script>
