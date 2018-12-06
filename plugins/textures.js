import * as Three from 'three'
import Vue from 'vue'
import canvg from 'canvg'

const $textures = Vue.prototype.$textures = {}

$textures.svg2texture = ({svg, width=256, height=256, fillColor=null}) => {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvg(canvas, svg, {ignoreAnimations: true, ignoreDimensions: true, ignoreClear: false, ignoreMouse: true, scaleWidth: width, scaleHeight: height})

  if(fillColor != null) {
    let bgCanvas = document.createElement('canvas')
    bgCanvas.width = width
    bgCanvas.height = height
    let bgctx = bgCanvas.getContext('2d')
    bgctx.beginPath()
    bgctx.rect(0, 0, width, height)
    bgctx.fillStyle = fillColor
    bgctx.fill()
    bgctx.drawImage(canvas, 0, 0)
    canvas = bgCanvas
  }

  return new Three.CanvasTexture(canvas)
}
