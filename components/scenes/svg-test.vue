<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom" :animated="animated"/>

      <g-grid :divisions="10" v-if="showGrid"/>

    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import "imports-loader?THREE=three!../../node_modules/three/examples/js/loaders/SVGLoader"
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import testSVG from '~/assets/img/svg/tiger.svg'

export default {
  props: {
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: true},
    zoom: {type: Number, default: 5},
  },
  data() {
    return {
      scene: new Three.Scene(),
    }
  },
  created() {
		this.scene.background = new Three.Color( 0xb0b0b0 );
        
    this.$graphics.svg({
      url: testSVG,
      scale: 0.1,
      center: new Three.Vector2(50, 50),
      callback: (group) => {
        this.scene.add(group)
      }
    })
  }
}
</script>
