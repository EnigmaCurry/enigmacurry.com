<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <g-grid :divisions="10"/>
      <g-camera orthographic :zoomScale=2></g-camera>

      <g-penrose-king />

      <!-- <g-penrose-kite origin="top" :rotation="{z: Math.PI}"/> -->
      <!-- <g-penrose-kite origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/> -->
      <!-- <g-penrose-kite origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/> -->
      <!-- <g-penrose-kite origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/> -->
      <!-- <g-penrose-kite origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/> -->

    </scene>
  </g-renderer>
</template>

<script>
export default {
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions()
    let kiteDimensions = this.$geometry.penrose.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions
    }
  },  
}
</script>
