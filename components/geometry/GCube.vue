<template>
  <div>
    <mesh name="GCube">
      <g-geometry type="Box" :args="[size, size, size]" />
      <g-wireframe-material wire-color="#440922" />
    </mesh>
    <animation :fn="animate" :speed="speed" />
  </div>
</template>

<script>
import GSymmetricRotationObject from '~/components/geometry/GSymmetricRotationObject.vue'
import GScalingObject from '~/components/geometry/GScalingObject.vue'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'g-cube',
  mixins: [GSymmetricRotationObject, GScalingObject],
  props: {
    size:  { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    startSymmetricRotations: {type: Boolean, default: false},
    startScaling: {type: Boolean, default: false}    
  },
  data () {
    return {
      symmetricRotations: [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0.3*Math.PI, z: 0.25*Math.PI},
        {x: 0, y: 0.24*Math.PI, z: 0.25*Math.PI},
        {x: 0, y: 0.125*Math.PI, z: 0.25*Math.PI},
        {x: 0, y: 0.25*Math.PI, z: 0},
      ]
    }
  }
}
</script>
