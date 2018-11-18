<template>
  <g-renderer animated class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-camera orthographic :zoomScale=6.5 />
      <g-group :rotation="sceneRotation">
        <g-penrose-sun origin="center" :rotation="{z: 36 * (Math.PI/180)}"/>
        <g-penrose-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: Math.PI}"/>
        <g-penrose-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 108 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 36 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 324 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 252 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penrose-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}"/>
        <g-penrose-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penrose-ace :rotation="{z: Math.PI}" :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}"/>
        <g-penrose-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 108 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 36 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 324 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 252 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 72 * (Math.PI/180)}" />
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: -72 * (Math.PI/180)}" />
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: -72 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penrose-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penrose-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" />
        <g-penrose-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" />
        <g-penrose-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
  
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 144 * (Math.PI/180)}"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 216 * (Math.PI/180)}"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 288 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penrose-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 288 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
      </g-group>
      <animation :fn="update"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'
import * as Three from 'three'

export default {
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions()
    let kiteDimensions = this.$geometry.penrose.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions,
      sceneRotation: new Three.Vector3(0,0,0)
    }
  },
  methods: {
    update() {
      this.$textures.updatePenroseTweens()
      this.sceneRotation.z += 0.0005
    }
  },
  mounted() {
    this.$textures.newPenroseTweens()
  },
  beforeDestroy() {
    console.log("cancelling penrose tweens")
    this.$textures.cancelPenroseTweens()
  }  
}
</script>
