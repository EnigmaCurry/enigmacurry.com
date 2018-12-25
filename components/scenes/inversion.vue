<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom" :position="cameraPosition" :lookAt="cameraLookAt"/>

      <g-grid :divisions="10" v-if="showGrid"/>

    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import ColorScheme from 'color-scheme'
import {shuffle} from 'underscore'

export default {
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 450}
  },
  data() {
    return {
      scene: new Three.Scene(),
      cameraPosition: new Three.Vector3(0, 0, 1),
      cameraLookAt: new Three.Vector3(0, 0, 0),
      wireMaterials: this.makeMaterials(12),
      circlesCreated: 0,
    }
  },
  created() {
    let p = [new Three.Vector3(-12,1,0),
             new Three.Vector3(12,1,0),
             new Three.Vector3(0,-2,0)]
    for(let i=0; i < 500; i++) {
      let circle = this.circumference(p)
      p[2] = circle.center.multiplyScalar(-2.031)
    }
  },
  methods: {
    circumference([p1,p2,p3]) {
      const circle = this.$geometry.circleFromThreePoints(p1, p2, p3)
      this.circle(circle.center, circle.radius)
      return circle
    },
    circle(center, radius) {
      const circleGeometry = new Three.CircleGeometry(radius, 128).translate(center.x, center.y, 0)
      const circleMesh = new Three.LineSegments(new Three.EdgesGeometry(circleGeometry),
                                                this.wireMaterials[this.circlesCreated % this.wireMaterials.length])
      this.scene.add(circleMesh)
      this.circlesCreated++
    },
    marker(vectors, color="red", radius=0.05) {
      const mat = new Three.MeshBasicMaterial({color, transparent: true})
      if(vectors.isVector2 || vectors.isVector3) {
        vectors = [ vectors ]
      }
      for(let v=0; v < vectors.length; v++) {
        const m = new Three.Mesh(new Three.CircleGeometry(radius, 32).translate(vectors[v].x, vectors[v].y, 0), mat)
        m.renderOrder = 5000
        this.scene.add(m)
      }
    },
    makeMaterials(n) {
      const colorScheme = new ColorScheme()
          .from_hue( Math.random() * 360 )
          .scheme('analogic')
          .variation('default')
      const colors = colorScheme.colors()
      const materials = []
      for(let m=0; m < n; m++){
        materials.push(new Three.LineBasicMaterial({color: "#" + colors[m % colors.length]}))
      }
      return materials
    }
  }
}
</script>
