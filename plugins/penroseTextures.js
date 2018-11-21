import * as Three from 'three'
import Vue from 'vue'
import * as TWEEN from '@tweenjs/tween.js'
import ColorScheme from 'color-scheme'
import {shuffle} from 'underscore'

let kiteTexture = null
let dartTexture = null

class CanvasRenderer {
  constructor ({size}) {
    this.canvas = document.createElement('canvas')
    this.renderer = new Three.WebGLRenderer({canvas: this.canvas, antialias: true})
    this.renderer.setSize(size, size)
    this.scene = new Three.Scene()
    this.light = new Three.PointLight(0xffffff, 10)
    this.light.position.z = 10
    this.scene.add(this.light)
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
    this.tweenGroup = new TWEEN.Group()
    this.scale = 1
    this.circleWidth = circleWidth
    this.circleMaterial = new Three.MeshPhysicalMaterial( { color: colors.circle, flatShading: true, depthFunc: Three.AlwaysDepth} )
    this.insideMaterial = new Three.MeshPhongMaterial( { color: colors.inside, flatShading: true, depthFunc: Three.AlwaysDepth} )
    this.renderer.setClearColor(colors.outside)
  }

  tweenColors(to, callback, interval=10) {
    let colors = {
      cr: this.circleMaterial.color.r, cg: this.circleMaterial.color.g, cb: this.circleMaterial.color.b,
      ir: this.insideMaterial.color.r, ig: this.insideMaterial.color.g, ib: this.insideMaterial.color.b,
      or: this.renderer.getClearColor().r, og: this.renderer.getClearColor().g, ob: this.renderer.getClearColor().b,
    }
    let toColors = {
      cr: to.circle.r, cg: to.circle.g, cb: to.circle.b,
      ir: to.inside.r, ig: to.inside.g, ib: to.inside.b,
      or: to.outside.r, og: to.outside.g, ob: to.outside.b
    }
    return new TWEEN.Tween(colors, this.tweenGroup)
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
    let schemes = ['contrast', 'mono', 'triade', 'tetrade', 'analogic']
    let variations = ['default', 'pastel', 'soft', 'light', 'hard', 'pale']
    let scheme = new ColorScheme()
        .from_hue( Math.random() * 256 )
        .scheme(schemes[Math.floor(Math.random() * schemes.length)])
        .variation(variations[Math.floor(Math.random() * variations.length)])
    let colors = shuffle(scheme.colors())
    let nextColors = { circle: new Three.Color("#" + colors[0]),
                       inside: new Three.Color("#" + colors[1]),
                       outside: new Three.Color("#" + colors[2])}
    this.tweenColors(nextColors, () => {this.newColorInterval()})
  }

  tweenScale(to, callback, interval=9) {
    let scale = {value: this.scene.children[0].scale.x}
    return new TWEEN.Tween(scale, this.tweenGroup)
      .to({value: to}, interval * 1000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .onUpdate(() => {
        for(let c=0; c < this.scene.children.length; c++) {
          this.scene.children[c].scale.x = scale.value
          this.scene.children[c].scale.y = scale.value
        }
      })
      .onComplete(callback)
      .start()
  }

  newScaleInterval() {
    let min = 0.5
    let max = 1.8
    let nextScale = Math.random() * (max - min) + min
    this.tweenScale(nextScale, () => {this.newScaleInterval()})
  }

  tweenLight(toIntensity, toColor, callback, interval=20) {
    let toParams = {r: toColor.r, g: toColor.g, b: toColor.b, intensity: toIntensity}
    let params = {r: this.light.color.r, g: this.light.color.g, b: this.light.color.b, intensity: this.light.intensity}
    return new TWEEN.Tween(params, this.tweenGroup)
      .to(toParams, interval * 1000)
      .easing(TWEEN.Easing.Quartic.InOut)
      .onUpdate(() => {
        this.light.color.setRGB(params.r, params.g, params.b)
        this.light.intensity = params.intensity
      })
      .onComplete(callback)
      .start()
  }

  newLightInterval() {
    let intensityMin = 10
    let intensityMax = 15
    let intensity = Math.random() * (intensityMax - intensityMin) + intensityMin
    let color = new Three.Color(Math.random(), Math.random(), Math.random())
    this.tweenLight(intensity, color, () => {this.newLightInterval()})
  }

  newTweens() {
    this.newScaleInterval()
    this.newColorInterval()
    this.newLightInterval()
  }

  cancelTweens() {
    this.tweenGroup.removeAll()
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

    let circle1Size = 0.298 * size
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

let kiteTextureRenderer = new KiteTextureRenderer({size: 512})
let dartTextureRenderer = new DartTextureRenderer({size: 512})

Vue.prototype.$penroseTextures = {
  penroseKiteTexture: function() {
    return kiteTextureRenderer.texture
  },
  penroseDartTexture: function() {
    return dartTextureRenderer.texture
  },
  newPenroseTweens() {
    kiteTextureRenderer.newTweens()
    dartTextureRenderer.newTweens()
  },
  updatePenroseTweens() {
    kiteTextureRenderer.tweenGroup.update()
    dartTextureRenderer.tweenGroup.update()
  },
  cancelPenroseTweens() {
    kiteTextureRenderer.cancelTweens()
    dartTextureRenderer.cancelTweens()
  }
}
