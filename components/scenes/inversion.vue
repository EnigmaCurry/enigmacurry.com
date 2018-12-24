<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :divisions="10" v-if="showGrid"/>

    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

export default {
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: true},
    zoom: {type: Number, default: 4}
  },
  data() {
    return {
      scene: new Three.Scene()
    }
  },
  created() {
    let p = [new Three.Vector3(-1,1,0),
             new Three.Vector3(1,1,0),
             new Three.Vector3(0,-2,0)]
    this.marker(p)
    let circle = this.$geometry.circleFromThreePoints(p[0],p[1],p[2])
    this.marker(circle.center)
    let wireMaterial = new Three.LineBasicMaterial({color: "white"})
    let circleGeometry = new Three.CircleGeometry(circle.radius, 32).translate(circle.center.x, circle.center.y, 0)
    let circleMesh = new Three.LineSegments(new Three.EdgesGeometry(circleGeometry), wireMaterial)
    this.scene.add(circleMesh)
    console.log(circle)
  },
  methods: {
    marker(vectors, color="red", radius=0.1) {
      let mat = new Three.MeshBasicMaterial({color, transparent: true})
      if(vectors.isVector2 || vectors.isVector3) {
        vectors = [ vectors ]
      }
      for(let v=0; v < vectors.length; v++) {
        let m = new Three.Mesh(new Three.CircleGeometry(radius, 32).translate(vectors[v].x, vectors[v].y, 0), mat)
        m.renderOrder = 5000
        this.scene.add(m)
      }
    },
  }
}
</script>
