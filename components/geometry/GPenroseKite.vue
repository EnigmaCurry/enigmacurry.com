<template>
</template>

<script>
import * as Three from 'three'
import { Object3D } from 'vue-threejs'

export default {
  name: 'g-penrose-kite',
  mixins: [ Object3D ],
  props: {
    width: {type: Number, default: 1},
    origin: {type: String, default: "top"} //top, bottom, left, right
  },
  created() {
    // If long pointy end is facing up, and the width is given, find the height.
    // Kite is made up of two golden triangles (left and right)
    // Divide the half kite into two right triangles and find the two bases:
    let B1 = 180 - 90 - 36
    let topHeight = ((0.5 * this.width) * Math.sin(B1 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let B2 = 180 - 90 - 72
    let bottomHeight = ((0.5 * this.width) * Math.sin(B2 * (Math.PI/180))) / Math.sin(72 * (Math.PI/180))
    
    let geom = new Three.Geometry()
    geom.vertices.push(new Three.Vector3(0, topHeight, 0)) //top
    geom.vertices.push(new Three.Vector3(-0.5, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(0, -1 * bottomHeight, 0)) //bottom
    geom.vertices.push(new Three.Vector3(0.5, 0, 0)) //right
    geom.faces.push(new Three.Face3(0,1,2)) //left
    geom.faces.push(new Three.Face3(0,2,3)) //right
    if (this.origin === 'bottom') {
      geom.translate(0, bottomHeight, 0)
    } else if (this.origin === 'left') {
      geom.translate(0.5 * this.width, 0, 0)
    } else if (this.origin === 'right') {
      geom.translate(-0.5 * this.width, 0, 0)
    } else { //top
      geom.translate(0, -1 * topHeight, 0)
    }
    geom.computeFaceNormals()

    let material = new Three.MeshNormalMaterial({wireframe: false})
    let mesh = new Three.Mesh( geom, material )

    this.curObj = mesh
  }
}
</script>
