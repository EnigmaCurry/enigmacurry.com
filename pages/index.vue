<template>
  <g-renderer class="renderer" ref="renderer">
    <scene>
      <g-camera start-symmetric-rotations orthographic :zoomScale=2></g-camera>
      <g-light :hex="0x0000ff" :intensity="0.2" :position="{ y: -10, z: 500 }"/>
      <g-light :hex="0xff0000" :intensity="0.2" :position="{ x: -10, z: 500 }"/>
      <g-light :hex="0x00ff00" :intensity="0.2" :position="{ x: 10, z: 500 }"/>

      <g-dodecahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="0.75" :radius="2" :position="{z:500}"/>
      <g-cube start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="0.75" :size="2" :position="{z:400}"/>
      <g-tetrahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="1" :position="{z:300}"/>
      <g-octahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="1" :position="{z:200}"/>
      <g-icosahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="0.5" :position="{z:100}"/>
    </scene>
  </g-renderer>
</template>

<script>
import MusicPlayerHide from '~/components/MusicPlayerHide.vue'
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import uuid from 'uuid/v1'

export default {
  mixins: [ScrollbarHide, MusicPlayerHide],
}
</script>
