<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-camera orthographic :zoomScale=3></g-camera>

      <g-penrose-sun origin="center"/>

      <g-penrose-queen :position="{y: kiteDimensions.height}" :rotation="{z: Math.PI}"/>
      <g-penrose-queen :position="{y: kiteDimensions.height}" :rotation="{z: 108 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)" />
      <g-penrose-queen :position="{y: kiteDimensions.height}" :rotation="{z: 36 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)" />
      <g-penrose-queen :position="{y: kiteDimensions.height}" :rotation="{z: 324 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)" />
      <g-penrose-queen :position="{y: kiteDimensions.height}" :rotation="{z: 252 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)" />

      <g-penrose-king :position="{y: -2 * kiteDimensions.height}"/>
      <g-penrose-king :position="{y: -2 * kiteDimensions.height}" :rotation="{z: 288 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
      <g-penrose-king :position="{y: -2 * kiteDimensions.height}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
      <g-penrose-king :position="{y: -2 * kiteDimensions.height}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
      <g-penrose-king :position="{y: -2 * kiteDimensions.height}" :rotation="{z: 72  * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>

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
  }
}
</script>
