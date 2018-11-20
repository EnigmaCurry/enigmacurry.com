<template>
  <g-group :scale="scale" :position="position" :rotation="rotation" :worldOrigin="worldOrigin" :worldRotation="worldRotation">
    <g-penroseV1-dart origin="top" :rotation="{z: Math.PI}"/>
    <g-penroseV1-dart origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penroseV1-dart origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penroseV1-dart origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penroseV1-dart origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </g-group>
</template>

<script>
import GPenroseGroup from '~/components/geometry/penrose-v1/GPenroseGroup.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseGroup]
}
</script>
