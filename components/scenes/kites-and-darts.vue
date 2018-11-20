<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-camera orthographic :zoomScale="6.5"/>
      <g-group :rotation="sceneRotation" :scale="scale">
        <g-penroseV1-sun origin="center" :rotation="{z: 36 * (Math.PI/180)}"/>
        <g-penroseV1-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: Math.PI}"/>
        <g-penroseV1-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 108 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 36 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 324 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: 1*kiteDimensions.height+dartDimensions.gnomonSide}" :rotation="{z: 252 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penroseV1-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}"/>
        <g-penroseV1-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-sun origin="bottom" :position="{y: 2*kiteDimensions.height + dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penroseV1-ace :rotation="{z: Math.PI}" :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}"/>
        <g-penroseV1-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 108 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 36 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 324 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-ace :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 252 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 72 * (Math.PI/180)}" />
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: -72 * (Math.PI/180)}" />
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: -72 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penroseV1-dart :position="{y: -2 * kiteDimensions.height - dartDimensions.gnomonSide}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
  
        <g-penroseV1-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" />
        <g-penroseV1-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: -3 * kiteDimensions.height - 2*dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" />
        <g-penroseV1-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-star-halo :position="{y: 4 * kiteDimensions.height + 2*dartDimensions.gnomonSide}" :worldRotation="72 * (Math.PI/180)"/>
  
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 144 * (Math.PI/180)}"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 216 * (Math.PI/180)}"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 144 * (Math.PI/180)}" :worldRotation="72 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 72 * (Math.PI/180)}" :worldRotation="144 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 288 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 0 * (Math.PI/180)}" :worldRotation="216 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:0.5}" :rotation="{z: 216 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
        <g-penroseV1-dart origin="bottom" :position="{y: 3 * kiteDimensions.height + dartDimensions.gnomonSide - kiteDimensions.bottom, x:-0.5}" :rotation="{z: 288 * (Math.PI/180)}" :worldRotation="288 * (Math.PI/180)"/>
      </g-group>
      <animation :fn="update"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'
import * as Three from 'three'

export default {
  props: {
    animated: {type: Boolean, default: true},
  },
  data() {
    let dartDimensions = this.$penroseV1.penroseV1.dartDimensions()
    let kiteDimensions = this.$penroseV1.penroseV1.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions,
      sceneRotation: new Three.Vector3(0,0,0),
      scale: {x: 1, y: 1, z: 1},
      scaleInterval: 40,
    }
  },
  created() {
    this.tweenGroup = new TWEEN.Group()
  },
  mounted() {
    if (this.animated) {
      this.$textures.newPenroseTweens()
      this.newScaleInterval()
    }
  },
  beforeDestroy() {
    console.log("cancelling penrose tweens")
    this.tweenGroup.removeAll()
    this.$textures.cancelPenroseTweens()
  },
  methods: {
    update() {
      if (this.animated) {
        this.tweenGroup.update()
        this.$textures.updatePenroseTweens()
        this.sceneRotation.z += 0.0005
      }
    },
    tweenScale(toScale) {
      let scale = {value: this.scale.x}
      return new TWEEN.Tween(scale, this.tweenGroup)
        .to({value: toScale}, this.scaleInterval * 1000)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onUpdate(() => {
          this.scale.x = scale.value
          this.scale.y = scale.value
        })
        .onComplete(this.newScaleInterval)
        .start()
    },
    newScaleInterval() {
      let min = 1
      let max = 2
      let nextScale = Math.random() * (max - min) + min
      this.tweenScale(nextScale)
    }
  },
  
}
</script>
