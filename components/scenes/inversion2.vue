<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom" :position="cameraPosition" :lookAt="cameraLookAt"/>

      <g-grid :divisions="10" v-if="showGrid"/>

      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import ColorScheme from 'color-scheme'
import {shuffle} from 'underscore'

const randRange = (min, max) => {
  return Math.random() * (max - min) + min
}

export default {
  props: {
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
  },
  data() {
    return {
      scene: new Three.Scene(),
      cameraPosition: new Three.Vector3(0, 0, -1),
      cameraLookAt: new Three.Vector3(0, 0, 0),
      circlesCreated: 0,
      circleSegmentsPlaylist: [128,4,6,12],
      zoom: null,
      zoomSpeed: 0.005      
    }
  },
  created() {
    this.newScene()
  },
  methods: {
    animate() {
      if ( this.zoom > this.maxZoom ) {
        if (!this.pauseAnimation) {
          this.pauseAnimation = true
          setTimeout(()=>{this.newScene()}, 10 * 1000)
        }
      } else {
        this.zoom += this.zoomSpeed * this.zoom
      }
    },
    newScene() {
      this.pauseAnimation = false
      this.wireMaterials = this.makeMaterials(12)
      this.circleSegments = this.circleSegmentsPlaylist[0]
      this.circleSegmentsPlaylist.push(this.circleSegmentsPlaylist.shift())
      this.scene.remove(this.renderGroup)
      this.renderGroup = new Three.Group()
      this.scene.add(this.renderGroup)
      const circle1 = this.circle(new Three.Vector3(0.5, 0, 0), 1)
      const circle2 = this.circle(new Three.Vector3(-0.5, 0, 0), 1)
      const intersect1 = this.$geometry.circleCircleIntersection(circle1.center, circle1.radius, circle2.center, circle2.radius)
      for(let i=1; i < 90; i++){
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(0.5/i, 0, 0)])
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(-0.5/i, 0, 0)])
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(0.5, i, 0)])
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(-0.5, -i, 0)])
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(i, 0.5, 0)])
        this.circumference([intersect1[0], intersect1[1], new Three.Vector3(-i, -0.5, 0)])
      }
      const bounds = new Three.Box3().setFromObject(this.renderGroup)
      this.zoom = 0.001
      this.maxZoom = bounds.max.x / 2
    },
    circumference([p1,p2,p3]) {
      const circle = this.$geometry.circleFromThreePoints(p1, p2, p3)
      this.circle(circle.center, circle.radius)
      return circle
    },
    circle(center, radius) {
      const circleGeometry = new Three.CircleGeometry(radius, this.circleSegments).translate(center.x, center.y, 0)
      const circleMesh = new Three.LineSegments(new Three.EdgesGeometry(circleGeometry),
                                                this.wireMaterials[this.circlesCreated % this.wireMaterials.length])
      this.renderGroup.add(circleMesh)
      this.circlesCreated++
      return {center, radius}
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
          .scheme('tetrade')
          .variation('default')
      const colors = colorScheme.colors()
      const materials = []
      for(let m=0; m < n; m++){
        materials.push(new Three.LineBasicMaterial({color: "#" + colors[m % colors.length], linewidth:3}))
      }
      return materials
    }
  }
}
</script>
