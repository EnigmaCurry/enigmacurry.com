<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  mixins: [Object3D],
  props: {
    //Need to set this true in derrived component or call newSymmetricRotationInterval
    startSymmetricRotations: false
  },
  data() {
    return {
      symmetricRotationIntervalDuration: 45,
      symmetricRotationIntervals: 0,
      currentRotationIndex: 0,
      symmetricRotationEasingChoices: [
        TWEEN.Easing.Sinusoidal.InOut,
        TWEEN.Easing.Quartic.InOut,
        TWEEN.Easing.Quintic.InOut,
        TWEEN.Easing.Exponential.InOut,
      ],
      rotationAmplificationChance: 0.1
    }
  },
  created() {
    this.symmetricRotationTweenGroup = new TWEEN.Group()
    if (this.startSymmetricRotations) {
      this.newSymmetricRotationInterval()
    }
  },
  methods: {
    __amplifyRotation(rot, chance) {
      let newRotation = {}
      let axes = ["x","y","z"]
      axes.forEach((axis) => {
        let amplify = 0
        if (Math.random() < chance) {
          amplify = 2*Math.PI
        }
        newRotation[axis] = rot[axis] > 0 ? rot[axis] + amplify : rot[axis] - amplify
      })
      return newRotation
    },
    tweenSymmetricRotation(targetRotation, interval) {
      let rot = {x: this.curObj.rotation.x, y: this.curObj.rotation.y, z: this.curObj.rotation.z}
      return new TWEEN.Tween(rot, this.symmetricRotationTweenGroup)
        .to(targetRotation, interval * 1000)
        .easing(this.symmetricRotationEasingChoices[Math.floor(Math.random() * this.symmetricRotationEasingChoices.length)])
        .onUpdate(() => {
          this.curObj.rotation.x = rot.x
          this.curObj.rotation.y = rot.y
          this.curObj.rotation.z = rot.z
        })
        .onComplete(this.newSymmetricRotationInterval)
        .start()
    },
    newSymmetricRotationInterval(lastTween) {
      this.symmetricRotationIntervals += 1
      // console.log("Interval: ",this.symmetricRotationIntervals)
      // Don't choose the same rotation twice in a row
      let lastRotationIndex = this.currentRotationIndex
      while (lastRotationIndex === this.currentRotationIndex) {
        this.currentRotationIndex = Math.floor(Math.random() * this.symmetricRotations.length)
        // Unless there only is one:
        if (this.symmetricRotations.length === 1) {
          break
        }
      }
      this.tweenSymmetricRotation(
        this.__amplifyRotation(this.symmetricRotations[this.currentRotationIndex], this.rotationAmplificationChance),
        this.symmetricRotationIntervalDuration
      )
    },
    animateRotation(tt) {
      this.symmetricRotationTweenGroup.update()
    },
    cleanupRotationTweens() {
      this.symmetricRotationTweenGroup.removeAll()
    },

  }
}
</script>
