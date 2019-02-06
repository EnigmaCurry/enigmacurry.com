<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom"/>
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import BackgroundImage from '~/components/BackgroundImage.vue'
import Visibility from 'visibilityjs'
import vertexShader from 'raw-loader!~/assets/shaders/general.vertex.glsl'
import fragmentShader from 'raw-loader!~/assets/shaders/rectangular.fragment.glsl'
import ShaderToyTex1 from '~/assets/img/texture/shadertoy1.jpg'
import ShaderToyTex2 from '~/assets/img/texture/shadertoy2.jpg'

const rectangleSquares = (size={width: 1920, height: 1080}, bailout=5) => {
  // compute the square spiral for a rectangle of given size (width, height)
  const divisions = []
  let length = 0, remainder = 0, square = 0
  if (size.width > size.height) {
    remainder = size.width
    square = size.height
  } else {
    remainder = size.height
    square = size.width
  }
  while(length <= remainder) {
    if (square <= remainder) {
      length += square
      divisions.push(square)
      remainder -= square
    } else {
      length += remainder
      remainder = 0
    }
  }
  let nextSize = size.width > size.height ?
      {width: remainder, height: square} : {width: square, height: remainder}
  if (nextSize.width > 0 && nextSize.height > 0 && bailout > 1) {
    const recurse = rectangleSquares(nextSize, bailout - 1)
    divisions.push.apply(divisions, recurse)
  }
  return divisions
}

const rectangleAreas = (size={width: 1920, height: 1080}, bailout=5) => {
  const divisions = rectangleSquares(size, bailout)
  const areas = []
  let direction = size.height > size.width ? 0 : 1 // 0=up 1=right 2=down 3=left
  let x = 0, y = 0
  for (let d=0; d < divisions.length; d++) {
    const division = divisions[d]
    areas.push({x1:x, y1:y, x2:x+division, y2:y+division})
    if (direction == 0) {
      y += division
    } else if (direction == 1) {
      x += division
    } else if (direction == 2) {
      y -= division
    } else if (direction == 3) {
      x -= division
    }
    if (division != divisions[d+1]) {
      direction = (direction + 1) % 4
    }
  }
  return areas
}

export default {
  mixins: [BackgroundImage],
  inject: ['renderer'],
  props: {
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 0.5},
    numScenes: {type: Number, default: 9},
    downscale: {type: Number, default: 1.},
  },
  data() {
    const textureLoader = new Three.TextureLoader()
    const tUniform = {
      scene: {type: "i", value: 0},
      iGlobalTime: {type: 'f', value: 0.1},
      iResolution: {type: 'v2', value: new Three.Vector2(this.renderer.width, this.renderer.height) },
      rectWidth: {type: 'f', value: 1920},
      rectHeight: {type: 'f', value: 1080}
    }
    const shaderMat = new Three.ShaderMaterial( {
      uniforms: tUniform,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: Three.DoubleSide
    } )
    return {
      scene: new Three.Scene(),
      tUniform,
      shaderMat,
      clock: new Three.Clock(),
      shaderMesh: null,
    }
  },
  created() {
    this.renderer.downscale *= this.downscale
    let o = rectangleAreas({width: this.tUniform.rectWidth.value, height: this.tUniform.rectHeight.value})
    console.log(o)

  },
  mounted() {
    this.renderer.onResize()
    //this.renderer.showStats = true
    //Wait for the renderer to report a size:
    let intervalID = setInterval(() => {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      if (width > 0 && height > 0) {
        clearInterval(intervalID)
        this.recreateShaderMesh()
        window.addEventListener('resize', this.recreateShaderMesh)
      }
    }, 100)
    this.visibilityInterval = Visibility.every(30 * 1000, () => {
      this.tUniform.scene.value = (this.tUniform.scene.value + 1) % this.numScenes
    })
  },
  beforeDestroy() {
    Visibility.stop(this.visibilityInterval)
    window.removeEventListener('resize', this.recreateShaderMesh)
    this.renderer.downscale /= this.downscale    
  },
  methods: {
    animate(tt) {
      this.tUniform.iGlobalTime.value += this.clock.getDelta()
    },
    recreateShaderMesh() {
      let width = this.renderer.size.width
      let height = this.renderer.size.height
      this.tUniform.iResolution.value.set(width, height)
      let pWidth = width/height
      let pHeight = 1
      if (height > width) {
        pWidth = 1
        pHeight = height/width
      }
      if (this.shaderMesh != null) {
        this.scene.remove(this.shaderMesh);
      }
      this.shaderMesh = new Three.Mesh( new Three.PlaneGeometry( pWidth, pHeight, 1, 1 ), this.shaderMat)
      this.scene.add(this.shaderMesh)
    }
  }
}
</script>
