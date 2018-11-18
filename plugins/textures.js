import * as Three from 'three'
import Vue from 'vue'
import * as TWEEN from '@tweenjs/tween.js'

let kiteTexture = null
let dartTexture = null

class CanvasRenderer {
  constructor ({size}) {
    this.canvas = document.createElement('canvas')
    this.renderer = new Three.WebGLRenderer({canvas: this.canvas, antialias: true})
    this.renderer.setSize(size, size)

    this.scene = new Three.Scene()
    this.camera = new Three.OrthographicCamera(size / -2, size / 2, size / 2, size / -2, 1, 1000)
    this.camera.position.z = 10
    this.camera.lookAt(new Three.Vector3(0,0,0))

    this.texture = new Three.CanvasTexture(this.canvas)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

}


class PenroseTextureRenderer extends CanvasRenderer {
  constructor ({size=256, circleWidth, colors={circle: 'white', inside: 'black', outside:'black'}} = {}) {
    super({size})
    this.circleWidth = circleWidth
    this.circleMaterial = new Three.MeshBasicMaterial( { color: colors.circle} )
    this.insideMaterial = new Three.MeshBasicMaterial( { color: colors.inside} )
    this.renderer.setClearColor(colors.outside)
    this.newColorInterval()
  }

  tweenColors(to, callback, interval=10) {
    let colors = {
      cr: this.circleMaterial.color.r, cg: this.circleMaterial.color.g, cb: this.circleMaterial.color.b,
      ir: this.insideMaterial.color.r, ig: this.insideMaterial.color.g, ib: this.insideMaterial.color.b,
      or: this.renderer.getClearColor().r, og: this.renderer.getClearColor().g, ob: this.renderer.getClearColor().b,
    }
    let circleColor = new Three.Color(to.circle.r, to.circle.g, to.circle.b)
    let insideColor = new Three.Color(to.inside.r, to.inside.g, to.inside.b)
    let outsideColor = new Three.Color(to.outside.r, to.outside.g, to.outside.b)
    let toColors = {
      cr: circleColor.r, cg: circleColor.g, cb: circleColor.b,
      ir: insideColor.r, ig: insideColor.g, ib: insideColor.b,
      or: outsideColor.r, og: outsideColor.g, ob: outsideColor.b
    }
    return new TWEEN.Tween(colors)
      .to(toColors, interval * 1000)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(() => {
        this.circleMaterial.color.setRGB(colors.cr, colors.cg, colors.cb)
        this.insideMaterial.color.setRGB(colors.ir, colors.ig, colors.ib)
        this.renderer.setClearColor(new Three.Color(colors.or, colors.og, colors.ob))
        this.render()
        this.texture.needsUpdate = true
      })
      .onComplete(callback)
      .start()
  }

  newColorInterval() {
    let nextColors = { circle: {r: Math.random(), g: Math.random(), b: Math.random()},
                       inside: {r: Math.random(), g: Math.random(), b: Math.random()},
                       outside: {r: Math.random(), g: Math.random(), b: Math.random()} }
    this.tweenColors(nextColors, () => {this.newColorInterval()})
  }
}

class DartTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=9, colors={circle: 0x00ff00, inside: 0x004400, outside:0x0033bb}} = {}) {
    super({size, circleWidth, colors})

    let circle1Size = 0.25 * size
    let circle1Geometry = new Three.CircleGeometry( circle1Size, 512 )
    let inside1Geometry = new Three.CircleGeometry( circle1Size - circleWidth, 512 )
    let circle1 = new Three.Mesh( circle1Geometry, this.circleMaterial )
    let inside1 = new Three.Mesh( inside1Geometry, this.insideMaterial )
    circle1.position.x = inside1.position.x = 0
    this.scene.add(circle1)
    this.scene.add(inside1)

    let circle2Size = 0.48 * size
    let circle2Geometry = new Three.CircleGeometry( circle2Size, 512 )
    let inside2Geometry = new Three.CircleGeometry( circle2Size - circleWidth, 512 )
    let circle2 = new Three.Mesh( circle2Geometry, this.circleMaterial )
    let inside2 = new Three.Mesh( inside2Geometry, this.insideMaterial )
    circle2.position.y = inside2.position.y = -0.5 * size
    circle2.position.x = inside2.position.x = -0.5 * size
    this.scene.add(circle2)
    this.scene.add(inside2)

    this.render()
  }
}

class KiteTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=5, colors={circle: 0xff0000, inside: 0x332233, outside:0x660000}} = {}) {
    super({size, circleWidth, colors})

    let circle1Size = 0.31 * size
    let circle1Geometry = new Three.CircleGeometry( circle1Size, 512 )
    let inside1Geometry = new Three.CircleGeometry( circle1Size - circleWidth, 512 )
    let circle1 = new Three.Mesh( circle1Geometry, this.circleMaterial )
    let inside1 = new Three.Mesh( inside1Geometry, this.insideMaterial )
    this.scene.add(circle1)
    this.scene.add(inside1)

    let circle2Size = 0.42 * size
    let circle2Geometry = new Three.CircleGeometry( circle2Size, 512 )
    let inside2Geometry = new Three.CircleGeometry( circle2Size - circleWidth, 512 )
    let circle2 = new Three.Mesh( circle2Geometry, this.circleMaterial )
    let inside2 = new Three.Mesh( inside2Geometry, this.insideMaterial )
    circle2.position.y = inside2.position.y = -0.5 * size
    circle2.position.x = inside2.position.x = -0.5 * size
    this.scene.add(circle2)
    this.scene.add(inside2)

    this.render()
  }
}

let kiteTextureRenderer = new KiteTextureRenderer({size: 256})
let dartTextureRenderer = new DartTextureRenderer({size: 256})

Vue.prototype.$textures = {
  penroseKiteTexture: function() {
    return kiteTextureRenderer.texture
  },
  penroseDartTexture: function() {
    return dartTextureRenderer.texture
  }
}
