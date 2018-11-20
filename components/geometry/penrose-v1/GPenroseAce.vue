<template>
  <g-group :scale="scale" :position="position" :rotation="rotation" :worldOrigin="worldOrigin" :worldRotation="worldRotation">
    <g-penroseV1-dart origin="bottom" :rotation="{z: Math.PI}" :position="{y: -1 * dartDimensions.gnomonSide}"/>
    <g-penroseV1-kite origin="left" :rotation="{z: 216 * (Math.PI/180)}" :position="{y: -1 * dartDimensions.gnomonSide}"/>
    <g-penroseV1-kite origin="right" :rotation="{z: 144 * (Math.PI/180)}" :position="{y: -1 * dartDimensions.gnomonSide}"/>
  </g-group>
</template>

<script>
import GPenroseGroup from '~/components/geometry/penrose-v1/GPenroseGroup.vue'
import * as Three from 'three'

export default {
  mixins: [GPenroseGroup]
}
</script>
