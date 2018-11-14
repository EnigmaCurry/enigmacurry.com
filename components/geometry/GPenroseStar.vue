<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" origin="top" :width="protoWidth" :rotation="{z: Math.PI}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :width="protoWidth" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :width="protoWidth" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :width="protoWidth" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-geometry proto-tile="dart" origin="top" :width="protoWidth" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </g-mesh>
</template>

<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'

export default {
  mixins: [Object3D],
  props: {
    color: {type: String, default: "orange"},
    protoWidth: {type: Number, default: 1},
    origin: {type: String, default: "center"},
    rotation: {type: Object, default: () => {return {x:0,y:0,z:0}}},
    wireColor: {type: String, default: "white"},
    wireWidth: {type: Number, default: 2}    
  },
  provide () {
    return { meshParent: this }
  },
  mounted() {
    //Translate origin for rotation purposes:
    if (this.origin === "top") {
      let dimensions = this.$geometry.penrose.dartDimensions(this.protoWidth)
      this.mesh.geometry.translate(0, -1 * dimensions.gnomonBase, 0)
    }

    // Materials:
    this.mesh.material = new Three.MeshStandardMaterial({color: new Three.Color(this.color)})
    //Wireframe:
    let wireGeometry = new Three.EdgesGeometry( this.mesh.geometry )
    let wireMaterial = new Three.LineBasicMaterial( { color: new Three.Color(this.wireColor), linewidth: this.wireWidth } )
    this.mesh.add( new Three.LineSegments( wireGeometry, wireMaterial ) )
  }
}
</script>
