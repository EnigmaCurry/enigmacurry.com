<template>
</template>

<script>
import * as Three from 'three'
import { Object3D } from 'vue-threejs'

export default {
  name: 'g-penrose-dart',
  mixins: [ Object3D ],
  props: {
    width: {type: Number, default: 1},
    origin: {type: String, default: "top"} //top, bottom, left, right
  },
  created() {
    // If pointy end is up, and the width is given, find the height.
    // Dart is made of two golden gnomons (left and right)
    // Extend a gnomon to a right triangle to calculate the top side length:
    let A = 180 - 36 - 90
    let height = ((0.5 * this.width) * Math.sin(A * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonBase = ((0.5 * this.width) * Math.sin(90 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonSide = (gnomonBase * Math.sin(36 * (Math.PI/180))) / Math.sin(108 * (Math.PI/180))
    let geom = new Three.Geometry()
    
    geom.vertices.push(new Three.Vector3(0, height, 0)) //top
    geom.vertices.push(new Three.Vector3(-0.5 * this.width, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(0, height - gnomonSide, 0)) //bottom
    geom.vertices.push(new Three.Vector3(0.5 * this.width, 0, 0)) //right
    geom.faces.push(new Three.Face3(0,1,2))
    geom.faces.push(new Three.Face3(0,2,3))
    // Not sure why it's upside down, but for now, just rotate it:
    geom.rotateZ(Math.PI)
    
    if (this.origin === 'bottom') {
      geom.translate(0, height - gnomonSide, 0)
    } else if (this.origin === 'left') {
      geom.translate(-0.5 * this.width, 0, 0)
    } else if (this.origin === 'right') {
      geom.translate(0.5 * this.width, 0, 0)
    } else { //top
      geom.translate(0, height, 0)
    }
    geom.computeFaceNormals()
    
    let material = new Three.MeshNormalMaterial({wireframe: false})
    let mesh = new Three.Mesh( geom, material )

    this.curObj = mesh
  }
}
</script>
