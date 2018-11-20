<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>
      <g-group :rotation="{y: 2*Math.PI}">
        <g-penrose-mesh :tileType="tileType" :iterations="iterations" :wireframe="wireframe"/>
      </g-group>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'

export default {
  props: {
    tileType: {type: String, default: "p3"},
    iterations: {type: Number, default: 5},
    wireframe: {type: Boolean, default: false},
  },
  created() {

  }
}
</script>
