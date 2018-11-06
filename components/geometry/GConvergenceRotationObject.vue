<script>
import { Object3D } from 'vue-threejs'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  mixins: [Object3D],
  data() {
    return {
      intervals: 0,
      convergenceFrequency: 7, // 1 out of X intervals
      convergenceInterval: 5,
      meanderInterval: 10,
      rotationMax: 0.002
    }
  },
  created() {
    this.currentMeanderRotation = {x:0, y:0, z:0}
    this.newRotationInterval()
  },
  methods: {
    meanderRotation(interval, rotationAccel) {
      let randAngle = () => {
        let min = -1 * this.rotationMax
        let max = this.rotationMax
        return Math.random() * (max - min) + min
      }
      if(!rotationAccel) {
        rotationAccel = {x: randAngle(), y: randAngle(), z: randAngle()}
      }
      return new TWEEN.Tween(this.currentMeanderRotation)
        .to(rotationAccel, interval * 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(() => {
          this.curObj.rotation.x += this.currentMeanderRotation.x
          this.curObj.rotation.y += this.currentMeanderRotation.y
          this.curObj.rotation.z += this.currentMeanderRotation.z          
        })
        .onComplete(this.newRotationInterval)
        .start()
    },
    rebaseRotation() {
      // Recalculate the current rotation keeping the same orientation, but discarding multiple revolutions
      let circleRadians = 2*Math.PI
      let newRotation = {}
      let axes = ['x','y','z']
      axes.forEach((axis) => {
        let rot = this.curObj.rotation[axis]
        if (rot >= 0) {
          newRotation[axis] = rot < circleRadians ? rot : (rot % circleRadians)
        } else {
          newRotation[axis] = rot > (-1 * circleRadians) ? rot : (rot % circleRadians)
        }
      })
      this.curObj.rotation.x = newRotation.x
      this.curObj.rotation.y = newRotation.y
      this.curObj.rotation.z = newRotation.z
    },
    convergeRotation(interval) {
      let circleRadians = 2*Math.PI
      this.rebaseRotation()
      let rotation = {x: this.curObj.rotation.x, y: this.curObj.rotation.y, z: this.curObj.rotation.z}
      return new TWEEN.Tween(rotation)
        .to({x: 0, y:0, z:0}, interval * 1000)
        .easing(TWEEN.Easing.Elastic.InOut)
        .onUpdate(() => {
          this.curObj.rotation.x = rotation.x
          this.curObj.rotation.y = rotation.y
          this.curObj.rotation.z = rotation.z
        })
        .onComplete(this.newRotationInterval)
        .start()
    },
    newRotationInterval(lastTween) {
      this.intervals += 1
      let intervalSequence = this.intervals % this.convergenceFrequency
      if (intervalSequence == 0) {
        console.log("Convergence interval", this.intervals)
        this.convergeRotation(this.convergenceInterval)
      } else if (intervalSequence === this.convergenceFrequency - 1) {
        console.log("Stop rotation interval", this.intervals)
        this.meanderRotation(this.meanderInterval, {x:0, y:0, z:0})
      } else {
        console.log("Regular Meander interval", this.intervals)
        this.meanderRotation(this.meanderInterval)
      }
    },
    animate(tt) {
      TWEEN.update()
    }
  }
}
</script>
