<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" :width="protoWidth" origin="top" :rotation="{z: -216*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="dart" :width="protoWidth" origin="top" :rotation="{z: -144*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" :width="protoWidth" origin="bottom" :translate="kiteTranslation" :rotation="{z: -252*(Math.PI/180)}"/>
    <g-penrose-geometry proto-tile="kite" :width="protoWidth" origin="bottom" :translate="kiteTranslation" :rotation="{z: -108*(Math.PI/180)}"/>
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
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions(this.protoWidth)
    let kiteDimensions = this.$geometry.penrose.kiteDimensions(this.protoWidth)
    return {
      dartDimensions,
      kiteDimensions,
      kiteTranslation: {x:0, y:-1 * dartDimensions.gnomonBase, z:0}
    }
  },
  mounted() {
    //Translate origin for rotation purposes:
    if (this.origin === "top") {
    } else if (this.origin === "bottom") {
    } else if (this.origin === "left") {
    } else if (this.origin === "right") {
    } 

    // Materials:
    this.mesh.material = new Three.MeshStandardMaterial({color: new Three.Color(this.color), wireframe: true})
    //Wireframe:
    let wireGeometry = new Three.EdgesGeometry( this.mesh.geometry )
    let wireMaterial = new Three.LineBasicMaterial( { color: new Three.Color(this.wireColor), linewidth: this.wireWidth } )
    this.mesh.add( new Three.LineSegments( wireGeometry, wireMaterial ) )
  }
}
</script>
