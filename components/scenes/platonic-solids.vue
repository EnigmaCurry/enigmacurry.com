<template>
<g-scene antialias>
    <g-camera name="main" orthographic :zoomScale=2></g-camera>
    <g-light randomize-color :hex="0x0000ff" :intensity="0.2" :position="{ y: -10, z: 500 }"/>
    <g-light randomize-color :hex="0xff0000" :intensity="0.2" :position="{ x: -10, z: 500 }"/>
    <g-light randomize-color :hex="0x00ff00" :intensity="0.2" :position="{ x: 10, z: 500 }"/>

    <g-dodecahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="0.75" :radius="2" :position="{z:500}"/>
    <g-cube start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="0.75" :size="2" :position="{z:400}"/>
    <g-tetrahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="1" :position="{z:300}"/>
    <g-octahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="1" :position="{z:200}"/>
    <g-icosahedron start-symmetric-rotations start-scaling :scaling-min="1" :scaling-max="2" :radius="0.5" :position="{z:100}"/>
  </g-scene>
</template>

<script>
import BackgroundImage from '~/components/BackgroundImage.vue'

export default {
  mixins: [BackgroundImage],
  inject: [
    "renderer"
  ],
  props: {
    backgroundClass: {type: String, default: "fov-bearing"},
    backgroundAlpha: {type: Number, default: 0.75}
  }
}
</script>
