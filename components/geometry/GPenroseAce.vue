<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" :width="protoWidth" origin="bottom" :rotation="{z: Math.PI}"/>
    <g-penrose-geometry proto-tile="kite" :width="protoWidth" origin="left" :rotation="{z: 216 * (Math.PI/180)}" />
    <g-penrose-geometry proto-tile="kite" :width="protoWidth" origin="right" :rotation="{z: 144 * (Math.PI/180)}" />
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
    let dartDimensions = this.$geometry.penrose.dartDimensions(this.protoWidth)
    let kiteDimensions = this.$geometry.penrose.kiteDimensions(this.protoWidth)
    console.log(dartDimensions)
    console.log(kiteDimensions)
    if (this.origin === "top") {
      this.mesh.geometry.translate(0, -1*dartDimensions.gnomonSide, 0)
    } else if (this.origin === "bottom") {
      this.mesh.geometry.translate(0, dartDimensions.gnomonBase, 0)
    } else if (this.origin === "left") {
      // WARNING: Eyeballed
      this.mesh.geometry.translate(0.809019, 0.587785, 0)
    } else if (this.origin === "right") {
      // WARNING: Eyeballed
      this.mesh.geometry.translate(-0.809019, 0.587785, 0)
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
