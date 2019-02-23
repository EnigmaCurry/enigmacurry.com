import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Vue from 'vue'
import canvg from 'canvg'
import TextTexture from 'three.texttexture'
import {$tilings} from '~/plugins/tilings.js'

const $textures = Vue.prototype.$textures = {}

class CanvasRenderer {
  constructor ({size, cameraX=0, cameraY=0}) {
    this.canvas = document.createElement('canvas')
    this.renderer = new Three.WebGLRenderer({canvas: this.canvas, antialias: true})
    this.tweenGroup = new TWEEN.Group()
    this.renderer.setSize(size, size)
    this.scene = new Three.Scene()
    this.camera = new Three.OrthographicCamera(size / -2, size / 2, size / 2, size / -2, 1, 1000)
    this.camera.position.z = 1
    this.camera.position.x = cameraX
    this.camera.position.y = cameraY
    this.camera.lookAt(new Three.Vector3(cameraX,cameraY,0))

    this.texture = new Three.CanvasTexture(this.canvas)
  }

  render() {
    this.texture.needsUpdate = true
    this.renderer.render(this.scene, this.camera)
  }
}

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

$textures.tilingTexture = ({tileType, materials, size=256, scale=1, tileFrustrumSize=10 }) => {
  const renderer = new CanvasRenderer({size})
  let frustrum = {left: -tileFrustrumSize, right: tileFrustrumSize, top:tileFrustrumSize, bottom:-tileFrustrumSize}
  const tilingGroup = new $tilings.TilingGroup({tileType, materials, frustrum, showFrustrum: false})
  tilingGroup.group.scale.multiplyScalar(scale)
  renderer.scene.add(tilingGroup.group)
  renderer.render()

  return {tilingGroup, renderer}
}

$textures.textSurface = (params) => {
  // Pass any TextTexture parameter :
  params = Object.assign({
    text: "",
    transparent: true,
    fontFamily: 'monospace',
    fontSize: Math.pow(2, 10), // Treat this as texture resolution
  }, params)
  let box = new Three.Mesh(
    new Three.PlaneGeometry(0.1, 0.1),
    new Three.MeshBasicMaterial({
      transparent: params.transparent,
      map: new TextTexture(params)
    })
  )
  box.scale.set(box.material.map.image.width / box.material.map.image.height, 1, 1)
  return box
}
