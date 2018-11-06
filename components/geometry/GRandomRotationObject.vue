<script>
import { Object3D } from 'vue-threejs'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  mixins: [Object3D],
  data() {
    return {
      lastRotationChange: 0,
      rotationTweenRate: 10,
      rotationIntervalMin: 15,
      rotationIntervalMax: 25,
      rotationMax: 0.002
    }
  },
  created() {
    this.currentRotation = {x:0, y:0, z:0}
    this.rotationInterval = 0
  },
  methods: {
    tweenRotation() {
      let randAngle = () => {
        let min = -1 * this.rotationMax
        return Math.random() * (this.rotationMax - min) + min
      }
      let randomRotation = {x: randAngle(), y: randAngle(), z: randAngle()}
      return new TWEEN.Tween(this.currentRotation)
        .to(randomRotation, this.rotationTweenRate * 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
    },
    randomRotationInterval() {
      return Math.random() * (this.rotationIntervalMax - this.rotationIntervalMin) + this.rotationIntervalMin
    },
    animate(tt) {
      if ((tt - this.lastRotationChange) > this.rotationInterval) {
        this.rotationInterval = this.randomRotationInterval()
        this.lastRotationChange = tt
        this.tweenRotation()
      }
      TWEEN.update()
      this.curObj.rotation.x += this.currentRotation.x
      this.curObj.rotation.y += this.currentRotation.y
      this.curObj.rotation.z += this.currentRotation.z
    }
  }
}
</script>
