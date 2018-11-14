<template>
  <g-mesh>
    <g-penrose-dart-geometry origin="top" :width="dartWidth" :rotation="{z: Math.PI}"/>
    <g-penrose-dart-geometry origin="top" :width="dartWidth" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-dart-geometry origin="top" :width="dartWidth" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-dart-geometry origin="top" :width="dartWidth" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-dart-geometry origin="top" :width="dartWidth" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </g-mesh>
</template>

<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'

export default {
  mixins: [Object3D],
  props: {
    color: {type: String, default: "orange"},
    dartWidth: {type: Number, default: 1},
    origin: {type: String, default: "center"},
    rotation: {type: Object, default: () => {return {x:0,y:0,z:0}}},
    wireColor: {type: String, default: "white"},
    wireWidth: {type: Number, default: 2}    
  },
  provide () {
    return { meshParent: this }
  },
  mounted() {
    let A = 180 - 36 - 90
    let height = ((0.5 * this.dartWidth) * Math.sin(A * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonBase = ((0.5 * this.dartWidth) * Math.sin(90 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonSide = (gnomonBase * Math.sin(36 * (Math.PI/180))) / Math.sin(108 * (Math.PI/180))
    if (this.origin === "top") {
      this.mesh.geometry.translate(0, -1 * gnomonBase, 0)
    }
    this.mesh.material = new Three.MeshStandardMaterial({color: new Three.Color(this.color)})
    //Wireframe:
    let wireGeometry = new Three.EdgesGeometry( this.mesh.geometry )
    let wireMaterial = new Three.LineBasicMaterial( { color: new Three.Color(this.wireColor), linewidth: this.wireWidth } )
    this.mesh.add( new Three.LineSegments( wireGeometry, wireMaterial ) )

  }
}
</script>
