<script>
import {Base, Material} from 'vue-threejs'
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'GWireframeMaterial',
  mixins: [Material],
  props: {
    type: { type: String, default: 'MeshPhysical' },
    wireColor: {type: String, default: "#ffffff"},
    wireWidthMin: {type: Number, default: 2}, 
    wireWidthMax: {type: Number, default: 4},
    wireWidthCurve: {type: Number, default: 20},
    tweenInterval: {type: Number, default: 7},
    opacityMin: {type: Number, default: 0.25},
    opacityMax: {type: Number, default: 0.8},
    opacityCurve: {type: Number, default: 4},
    brightnessMin: {type: Number, default: 0.5},
    rotation: {type: Object, default: () => {return {x:0,y:0,z:0}}}
  },
  data() {
    return {
      easingChoices: [
        TWEEN.Easing.Sinusoidal.InOut,
        TWEEN.Easing.Quartic.InOut,
        TWEEN.Easing.Quintic.InOut,
        TWEEN.Easing.Exponential.InOut,
      ],
    }
  },
  created() {
    this.material.setValues({
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: Three.DoubleSide,
      transparent: true,
      opacity: this.opacityMin,
    })
  },
  mounted() {
    //Wireframe:
    this.wireGeometry = new Three.EdgesGeometry( this.meshVm.curObj.geometry )
    this.wireMaterial = new Three.LineBasicMaterial( { color: this.wireColor, linewidth: this.wireWidthMin } )
    this.meshVm.curObj.add( new Three.LineSegments( this.wireGeometry, this.wireMaterial ) )
    this.newOpacity()
    this.newWireColorTween()
    this.newWireWidth()
  },
  methods: {
    tweenWireColor(toColor) {
      let color = { r: this.wireMaterial.color.r, g: this.wireMaterial.color.g, b: this.wireMaterial.color.b } 
      return new TWEEN.Tween(color)
        .to(toColor, this.tweenInterval * 1000)
        .easing(this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)])
        .onComplete(this.newWireColorTween)
        .onUpdate(() => {
          this.wireMaterial.color.r = color.r
          this.wireMaterial.color.g = color.g
          this.wireMaterial.color.b = color.b
        })
        .start()
    },
    newWireColorTween() {
      let color = {r: -1, g:-1, b:-1}
      while (color.r < this.brightnessMin || color.g < this.brightnessMin || color.b < this.brightnessMin) {
        color.r = Math.random()
        color.g = Math.random()
        color.b = Math.random()
      }
      this.tweenWireColor(color)
    },
    tweenOpacity(toOpacity) {
      let opacity = {value: this.material.opacity}
      return new TWEEN.Tween(opacity)
        .to({value: toOpacity}, this.tweenInterval * 1000)
        .easing(this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)])
        .onComplete(this.newOpacity)
        .onUpdate(() => {
          this.material.opacity = opacity.value
        })
        .start()
    },
    newOpacity() {
      //let opacity = (Math.random() * (this.opacityMax - this.opacityMin) + this.opacityMin)
      let opacity = (Math.pow(Math.random(), this.opacityCurve) * this.opacityMax) + this.opacityMin
      this.tweenOpacity(opacity)
    },
    tweenWireWidth(toWidth) {
      let width = {value: this.wireMaterial.linewidth}
      return new TWEEN.Tween(width)
        .to({value: toWidth}, this.tweenInterval * 1000)
        .easing(this.easingChoices[Math.floor(Math.random() * this.easingChoices.length)])
        .onComplete(this.newWireWidth)
        .onUpdate(() => {
           this.wireMaterial.linewidth = Math.floor(width.value)
        })
        .start()
    },
    newWireWidth() {
      let width = Math.floor(Math.pow(Math.random(), this.wireWidthCurve) * this.wireWidthMax) + this.wireWidthMin
      this.tweenWireWidth(width)
    }
  }
}
</script>
