<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {Light} from 'vue-threejs'

export default {
  name: 'GLight',
  mixins: [Light],
  props: {
    randomizeColor: {type: Boolean, default: false},
    tweenInterval: {type: Number, default: 30}
  },
  data() {
    return {
      lightColorEasingChoices: [
        TWEEN.Easing.Sinusoidal.InOut,
        TWEEN.Easing.Quartic.InOut,
        TWEEN.Easing.Quintic.InOut,
        TWEEN.Easing.Exponential.InOut,
      ],
    }
  },
  created() {
  },
  mounted() {
    if (this.randomizeColor) {
      this.newColorInterval()
    }
  },
  methods: {
    tweenColor(toColor) {
      let color = {r: this.curObj.color.r, g: this.curObj.color.g, b: this.curObj.color.b}
      return new TWEEN.Tween(color)
        .to(toColor, this.tweenInterval * 1000)
        .easing(this.lightColorEasingChoices[Math.floor(Math.random() * this.lightColorEasingChoices.length)])
        .onUpdate(() => {
          this.curObj.color.setRGB(color.r, color.g, color.b)
        })
        .onComplete(this.newColorInterval)
        .start()
    },
    newColorInterval() {
      let color = {r: Math.random(), g: Math.random(), b: Math.random()}
      this.tweenColor(color)
    }
  }
}
</script>
