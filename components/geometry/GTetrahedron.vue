<template>
  <div>
    <mesh name="GTetrahedron">
      <g-geometry type="Tetrahedron" :args="[radius]" />
      <g-wireframe-material wire-color="#c20540"/>
    </mesh>
    <animation :fn="animate" :speed="speed" />
  </div>
</template>

<script>
import GSymmetricRotationObject from '~/components/geometry/GSymmetricRotationObject.vue'
import GScalingObject from '~/components/geometry/GScalingObject.vue'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'g-tetrahedron',
  mixins: [GSymmetricRotationObject, GScalingObject],
  props: {
    radius:  { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    startSymmetricRotations: {type: Boolean, default: false},
    startScaling: {type: Boolean, default: false}   
  },
  data() {
    return {
      symmetricRotations: [
        {x: 0, y: 0, z: 0},
        {x:0.31*Math.PI, y: 0, z: 0.75 * Math.PI},
        {x:0.31*Math.PI, y: 0, z: 0.25 * Math.PI},
        {x:0.25*Math.PI, y: 0, z: 0.25 * Math.PI},
        {x:0, y: -0.25 * Math.PI, z: 0},
        {x:0, y: 0.25 * Math.PI, z: 0},
        {x:0, y: 0, z: 0.25 * Math.PI},
      ]
    }
  }
}
</script>
