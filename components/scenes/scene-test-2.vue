<template>
  <g-scene :obj="scene">
    <g-camera orthographic :zoomScale="zoom"/>
    <g-grid :divisions="10" v-if="showGrid"/>
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

export default {
  props: {
    showGrid: {type: Boolean, default: true},
    zoom: {type: Number, default: 1}
  },
  inject: ['renderer'],
  data() {
    return {
      scene: new Three.Scene()
    }
  },
  created() {
  }
}
</script>
