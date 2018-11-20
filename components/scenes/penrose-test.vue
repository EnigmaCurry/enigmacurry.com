<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>
      <g-group>
        <g-mesh>
          <g-penrose-geometry :tileType="tileType" :iterations="iterations" />
          <material type="MeshBasic" :options="{wireframe: wireframe, side: materialSide}"/>
        </g-mesh>
      </g-group>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'

export default {
  props: {
    tileType: {type: String, default: "p2"},
    iterations: {type: Number, default: 2},
    wireframe: {type: Boolean, default: true},
    materialSide: {type: Number, default: Three.DoubleSide},
  },
  created() {

  }
}
</script>
