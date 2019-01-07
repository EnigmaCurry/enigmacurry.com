<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale=15></g-camera>
    <g-flower />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

export default {
  data() {
    return {
      scene: new Three.Scene()
    }
  },
  created() {
  }
}
</script>
