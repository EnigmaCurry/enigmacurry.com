<template>
  <div>
    <mesh name="GIcosahedron">
      <g-geometry type="Icosahedron" :args="[radius]" />
      <g-wireframe-material wire-color="#F5DBBA"/>
    </mesh>
    <animation :fn="animateRotation" :speed="speed" />
    <animation :fn="animateScale" :speed="speed" />
  </div>
</template>

<script>
import GSymmetricRotationObject from '~/components/geometry/GSymmetricRotationObject.vue'
import GScalingObject from '~/components/geometry/GScalingObject.vue'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'g-icosahedron',
  mixins: [GSymmetricRotationObject, GScalingObject],
  props: {
    radius:  { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    startSymmetricRotations: {type: Boolean, default: false},
    startScaling: {type: Boolean, default: false}    
  },
  beforeDestroy() {
    this.cleanupRotationTweens()
    this.cleanupScaleTweens()
  },  
  data() {
    return {
      symmetricRotations: [
        {x: 0, y:0, z:0},
        {x: 0.125 * Math.PI, y:0, z:0},
        {x: 0, y:0.125 * Math.PI, z:0},
        {x: 0, y:0.125 * Math.PI, z:0.5 * Math.PI},
        {x: 0, y:0.25 * Math.PI, z:0.5 * Math.PI},
        {x: 0.25 * Math.PI, y:0, z:0},
        {x: 0.5 * Math.PI, y:0, z:0},
      ]
    }
  }
}
</script>
