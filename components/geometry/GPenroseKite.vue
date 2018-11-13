<template>
</template>

<script>
import * as Three from 'three'
import { Object3D } from 'vue-threejs'

export default {
  name: 'g-penrose-kite',
  mixins: [ Object3D ],
  props: {
    origin: {type: Object, default: () => {return {x:0, y:0, z:0}}}
  },
  created() {
    // If long end of kite is facing east, and the width is 1, find the height:
    // Calculate area of top half of the kite, which is a golden triangle:
    let a = 1/((1+Math.sqrt(5)) / 2)
    let halfArea = this.$geometry.areaOfTriangleBySides(a, 1, 1)
    let halfHeight = 2 * halfArea
    // Find the x displacement of the top and bottom points: 
    let x = Math.sqrt(a*a - halfHeight*halfHeight)

    let geom = new Three.Geometry()
    geom.vertices.push(new Three.Vector3(0, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(x, halfHeight)) //top
    geom.vertices.push(new Three.Vector3(1, 0, 0)) //right
    geom.vertices.push(new Three.Vector3(x, -halfHeight)) //bottom
    geom.faces.push(new Three.Face3(0,1,2)) //top
    geom.faces.push(new Three.Face3(0,2,3)) //bottom
    geom.translate(this.origin.x||0, this.origin.y||0, this.origin.z||0)
    geom.computeFaceNormals()

    let material = new Three.MeshNormalMaterial()
    let mesh = new Three.Mesh( geom, material )

    //Face the -z camera:
    mesh.rotation.x = Math.PI
    this.curObj = mesh
  }
}
</script>
