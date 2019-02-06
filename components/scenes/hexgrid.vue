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
    zoom: {type: Number, default: 50},
    hexSize: {type: Number, default: 10},
    hexBorder: {type: Number, default: 0.1},
  },
  data() {
    return {
      scene: new Three.Scene(),
      hexGeometry: new Three.CircleGeometry((1 - this.hexBorder) * this.hexSize, 6),
      hexMaterial: new Three.MeshBasicMaterial({color: 0xffffff}),
      hexLayout: new this.$hexagons.Layout(this.$hexagons.Layout.flat,
                                           new Three.Vector2(this.hexSize, this.hexSize),
                                           new Three.Vector2(0, 0)),      
    }
  },
  mounted() {
    let origin = new this.$hexagons.Hex(0,0,0)
    this.newHexMesh(origin)
    for(let o=0; o < 6; o++) {
      this.newHexMesh(origin.neighbor(o))
    }
 },
  methods: {
    newHexMesh(hex) {
      let mesh = new Three.Mesh(this.hexGeometry, this.hexMaterial)
      let px = this.hexLayout.hexToPixel(hex)
      mesh.position.x = px.x
      mesh.position.y = px.y
      this.scene.add(mesh)
      return mesh
    }
  },
}
</script>
