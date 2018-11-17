<template>
  <g-renderer animated class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-camera orthographic :zoomScale=1></g-camera>

      <g-penrose-kite />

      <animation :fn="update"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'

export default {
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions()
    let kiteDimensions = this.$geometry.penrose.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions
    }
  },
  methods: {
    update() {
      TWEEN.update()
    }
  }
}
</script>
