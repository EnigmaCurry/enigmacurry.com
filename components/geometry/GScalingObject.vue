<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  mixins: [Object3D],
  props: {
    //Need to set this true in derrived component or call newScalingInterval
    startScaling: {type: Boolean, default: false},
    scalingMin: {type: Number, default: 0.5},
    scalingMax: {type: Number, default: 1.00}
  },
  data() {
    return {
      scalingIntervalDuration: 25,
      scalingIntervals: 0,
      scalingEasingChoices: [
        TWEEN.Easing.Sinusoidal.InOut,
        TWEEN.Easing.Quartic.InOut,
        TWEEN.Easing.Quintic.InOut,
        TWEEN.Easing.Exponential.InOut,
      ]
    }
  },
  created() {
    this.scalingTweenGroup = new TWEEN.Group()
    if (this.startScaling) {
      this.newScalingInterval()
    }
  },
  methods: {
    tweenScaling(targetScaling, interval) {
      let scale = {value: this.curObj.scale.x}
      return new TWEEN.Tween(scale, this.scalingTweenGroup)
        .to({value: targetScaling}, interval * 1000)
        .easing(this.scalingEasingChoices[Math.floor(Math.random() * this.scalingEasingChoices.length)])
        .onUpdate(() => {
          this.curObj.scale.x = scale.value
          this.curObj.scale.y = scale.value
          this.curObj.scale.z = scale.value
        })
        .onComplete(this.newScalingInterval)
        .start()
    },
    newScalingInterval(lastTween) {
      this.scalingIntervals += 1
      let scaling = (Math.random() * (this.scalingMax - this.scalingMin)) + this.scalingMin
      this.tweenScaling(scaling, this.scalingIntervalDuration)
    },
    animateScale(tt) {
      this.scalingTweenGroup.update()
    },
    cleanupScaleTweens() {
      this.scalingTweenGroup.removeAll()
  },
  }
}
</script>
