<template>
  <g-group :scale="scale" :position="position" :rotation="rotation" :worldOrigin="worldOrigin" :worldRotation="worldRotation">
    <g-penroseV1-ace :rotation="{z: 144 * (Math.PI/180)}" />
    <g-penroseV1-ace :rotation="{z: 216 * (Math.PI/180)}" />
    <g-penroseV1-ace :rotation="{z: 72 * (Math.PI/180)}" />
    <g-penroseV1-ace :rotation="{z: 0 * (Math.PI/180)}" />
    <g-penroseV1-ace :rotation="{z: 288 * (Math.PI/180)}" />
  </g-group>
</template>

<script>
import GPenroseGroup from '~/components/geometry/penrose-v1/GPenroseGroup.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseGroup]
}
</script>
