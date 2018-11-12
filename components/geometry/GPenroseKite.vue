<template>
</template>

<script>
import * as Three from 'three'
import assert from 'assert'
import { Object3D } from 'vue-threejs'

const areaOfTriangle = (sideA, sideB, sideC) => {
  // Heron's formula:
  assert((sideA + sideB) > sideC)
  assert((sideB + sideC) > sideA)
  assert((sideC + sideA) > sideB)
  let s = 0.5 * (sideA + sideB + sideC)
  return Math.sqrt(s * (s-sideA) * (s-sideB) * (s-sideC))
}

export default {
  name: 'g-penrose-kite',
  mixins: [ Object3D ],
  created() {
    // If long end of kite is facing east, and the width is 1, find the height:
    // Calculate area of top half of the kite, which is a golden triangle:
    let a = 1/((1+Math.sqrt(5)) / 2)
    let halfArea = areaOfTriangle(a, 1, 1)
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
    geom.computeFaceNormals()

    let material = new Three.MeshNormalMaterial()
    let mesh = new Three.Mesh( geom, material )
    mesh.rotation.x = Math.PI
    this.curObj = mesh
  }
}
</script>
