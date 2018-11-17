<template>
  <g-group :scale="scale" :position="position" :rotation="rotation" :worldOrigin="worldOrigin" :worldRotation="worldRotation">
    <g-penrose-kite origin="top" :rotation="{z: Math.PI}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </g-group>
</template>

<script>
import GPenroseGroup from '~/components/geometry/GPenroseGroup.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseGroup]
}
</script>
