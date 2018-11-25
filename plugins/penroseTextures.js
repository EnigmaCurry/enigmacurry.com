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
  constructor ({size, circleWidth, colors, scaleMin, scaleMax, circle1Size, circle2Size, circleSegments,
                colorSchemes=['contrast', 'mono', 'triade', 'tetrade', 'analogic'],
                colorVariations=['default', 'pastel', 'soft', 'light', 'hard', 'pale']} = {}) {
    super({size})
    this.tweenGroup = new TWEEN.Group()
    this.scale = 1
    this.circleWidth = circleWidth
    this.circleMaterial = new Three.MeshPhysicalMaterial( { color: colors.circle, flatShading: true, depthFunc: Three.AlwaysDepth} )
    this.insideMaterial = new Three.MeshPhongMaterial( { color: colors.inside, flatShading: true, depthFunc: Three.AlwaysDepth} )
    this.renderer.setClearColor(colors.outside)

    this.scaleMin = scaleMin
    this.scaleMax = scaleMax
    this.colorSchemes = colorSchemes
    this.colorVariations = colorVariations

    circle1Size = circle1Size * size
    let circle1Geometry = new Three.CircleGeometry( circle1Size, circleSegments )
    let inside1Geometry = new Three.CircleGeometry( circle1Size - circleWidth, circleSegments )
    let circle1 = new Three.Mesh( circle1Geometry, this.circleMaterial )
    let inside1 = new Three.Mesh( inside1Geometry, this.insideMaterial )
    this.scene.add(circle1)
    this.scene.add(inside1)

    circle2Size = circle2Size * size
    let circle2Geometry = new Three.CircleGeometry( circle2Size, circleSegments )
    let inside2Geometry = new Three.CircleGeometry( circle2Size - circleWidth, circleSegments )
    let circle2 = new Three.Mesh( circle2Geometry, this.circleMaterial )
    let inside2 = new Three.Mesh( inside2Geometry, this.insideMaterial )
    circle2.position.y = inside2.position.y = -0.5 * size
    circle2.position.x = inside2.position.x = -0.5 * size
    this.scene.add(circle2)
    this.scene.add(inside2)

    this.render()

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

  newColorInterval(initialInterval=10) {
    let scheme = new ColorScheme()
        .from_hue( Math.random() * 256 )
        .scheme(this.colorSchemes[Math.floor(Math.random() * this.colorSchemes.length)])
        .variation(this.colorVariations[Math.floor(Math.random() * this.colorVariations.length)])
    let colors = shuffle(scheme.colors())
    let nextColors = { circle: new Three.Color("#" + colors[0]),
                       inside: new Three.Color("#" + colors[1]),
                       outside: new Three.Color("#" + colors[2])}
    this.tweenColors(nextColors, () => {this.newColorInterval()}, initialInterval)
  }

  fadeToBlack(onComplete, interval) {
    let nextColors = { circle: new Three.Color(0x000000),
                       inside: new Three.Color(0x000000),
                       outside: new Three.Color(0x000000)}
    this.tweenColors(nextColors, onComplete ? onComplete : () => {}, interval)
    this.tweenLight(0, {r:0, g:0, b:0}, ()=>{}, interval)
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

  newScaleInterval(initialInterval=9) {
    let nextScale = Math.random() * (this.scaleMax - this.scaleMin) + this.scaleMin
    this.tweenScale(nextScale, () => {this.newScaleInterval()}, initialInterval)
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

  newLightInterval(initialInterval=20) {
    let intensityMin = 10
    let intensityMax = 15
    let intensity = Math.random() * (intensityMax - intensityMin) + intensityMin
    let color = new Three.Color(Math.random(), Math.random(), Math.random())
    this.tweenLight(intensity, color, () => {this.newLightInterval()}, initialInterval)
  }

  newTweens(initialInterval=0) {
    this.newScaleInterval(initialInterval)
    this.newColorInterval(initialInterval)
    this.newLightInterval(initialInterval)
    this.render()
  }

  cancelTweens() {
    this.tweenGroup.removeAll()
  }
}

class DartTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=9, colors={circle: 0x00ff00, inside: 0x004400, outside:0x0033bb},
               scaleMin=0.5, scaleMax=1.8, circle1Size=0.251, circle2Size=0.48, circleSegments=512} = {}) {
    super({size, circleWidth, colors, scaleMin, scaleMax, circle1Size, circle2Size, circleSegments})
  }
}

class KiteTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=5, colors={circle: 0xff0000, inside: 0x332233, outside:0x660000},
               scaleMin=0.5, scaleMax=1.8, circle1Size=0.30, circle2Size=0.414, circleSegments=512} = {}) {
    super({size, circleWidth, colors, scaleMin, scaleMax, circle1Size, circle2Size, circleSegments})
  }

}

class ThinRhombTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=15, colors={circle: 0x00ff00, inside: 0x004400, outside:0x0033bb},
               scaleMin=0.5, scaleMax=1.8, circle1Size=0.251, circle2Size=0.48, circleSegments=3} = {}) {
    super({size, circleWidth, colors, scaleMin, scaleMax, circle1Size, circle2Size, circleSegments})
  }

}

class ThickRhombTextureRenderer extends PenroseTextureRenderer {
  constructor({size=256, circleWidth=15, colors={circle: 0xff0000, inside: 0x332233, outside:0x660000},
               scaleMin=1.5, scaleMax=2.8, circle1Size=0.3, circle2Size=0.414, circleSegments=3} = {}) {
    //let colorSchemes = ['contrast', 'mono', 'triade', 'tetrade', 'analogic']
    let colorSchemes = ['contrast']
    //let colorVariations = ['default', 'pastel', 'soft', 'light', 'hard', 'pale']
    let colorVariations = ['hard']
    super({size, circleWidth, colors, scaleMin, scaleMax, circle1Size, circle2Size, circleSegments,
           colorSchemes, colorVariations})
  }
}

let kiteTextureRenderer
let dartTextureRenderer
let thinRhombTextureRenderer
let thickRhombTextureRenderer


Vue.prototype.$penroseTextures = {
  penroseKiteTexture: function() {
    if (typeof(kiteTextureRenderer) === "undefined") {
      kiteTextureRenderer = new KiteTextureRenderer({size: 512})
    }
    return kiteTextureRenderer.texture
  },
  penroseDartTexture: function() {
    if (typeof(dartTextureRenderer) === "undefined") {
      dartTextureRenderer = new DartTextureRenderer({size: 512})
    }
    return dartTextureRenderer.texture
  },
  penroseThinRhombTexture: function() {
    if (typeof(thinRhombTextureRenderer) === "undefined") {
      thinRhombTextureRenderer = new ThinRhombTextureRenderer({size: 512})
    }
    return thinRhombTextureRenderer.texture
  },
  penroseThickRhombTexture: function() {
    if (typeof(thickRhombTextureRenderer) === "undefined") {
      thickRhombTextureRenderer = new ThickRhombTextureRenderer({size: 512})
    }
    return thickRhombTextureRenderer.texture
  },
  newPenroseTweens(tileType) {
    if (tileType == "p2") {
      kiteTextureRenderer.newTweens()
      dartTextureRenderer.newTweens()
    } else if (tileType == "p3") {
      thinRhombTextureRenderer.newTweens()
      thickRhombTextureRenderer.newTweens()
    }
  },
  updatePenroseTweens(tileType) {
    if (tileType == "p2") {
      kiteTextureRenderer.tweenGroup.update()
      dartTextureRenderer.tweenGroup.update()
    } else if (tileType == "p3") {
      thinRhombTextureRenderer.tweenGroup.update()
      thickRhombTextureRenderer.tweenGroup.update()
    }
  },
  fadeToBlack(tileType, onComplete, interval=2) {
    if (tileType == "p2") {
      kiteTextureRenderer.cancelTweens()
      kiteTextureRenderer.fadeToBlack(null, interval)
      dartTextureRenderer.cancelTweens()
      dartTextureRenderer.fadeToBlack(onComplete, interval)
    } else if (tileType == "p3") {
      thinRhombTextureRenderer.cancelTweens()
      thinRhombTextureRenderer.fadeToBlack(null, interval)
      thickRhombTextureRenderer.cancelTweens()
      thickRhombTextureRenderer.fadeToBlack(onComplete, interval)
    }
  },
  cancelPenroseTweens() {
    if (typeof(kiteTextureRenderer) != "undefined") {
      kiteTextureRenderer.cancelTweens()
    }
    if (typeof(dartTextureRenderer) != "undefined") {
      dartTextureRenderer.cancelTweens()
    }
    if (typeof(thinRhombTextureRenderer) != "undefined") {
      thinRhombTextureRenderer.cancelTweens()
    }
    if (typeof(thickRhombTextureRenderer) != "undefined") {
      thickRhombTextureRenderer.cancelTweens()
    }
  }
}
