<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  data() {
    return {
      params: {
        animate: false,
        camera: {
          type: 'orthographic',
          frustrum: {
            type: 'dynamic',
            left: -50,
            right: 50,
            top: -50,
            bottom: 50
          }
        }
      }
    }
  },
  methods: {
    init: function() {
      let unitRadius = 10
      let material = new Three.LineBasicMaterial({ color: 0x0000ff })
      let unitCircle = new Three.CircleGeometry( unitRadius, 128 )
      // CircleGeomoetry puts a point at the middle of the circle, get rid of it:
      unitCircle.vertices.shift()
            
      //One
      let one = new Three.LineLoop(unitCircle, material)
      this.scene.add(one)
      //Two
      let two = new Three.LineLoop(unitCircle, material)
      two.position.x = one.position.x + unitRadius
      this.scene.add(two)
      //Three
      let three = new Three.LineLoop(unitCircle, material)
      three.position.x = 0.5 * two.position.x
      three.position.y = -0.5 * unitRadius * Math.sqrt(3)
      this.scene.add(three)
      //Four
      let four = new Three.LineLoop(unitCircle, material)
      four.position.x = three.position.x
      four.position.y = -1 * three.position.y
      this.scene.add(four)
      //Five
      let five = new Three.LineLoop(unitCircle, material)
      five.position.x = -1 * two.position.x
      this.scene.add(five)
      //Six
      let six = new Three.LineLoop(unitCircle, material)
      six.position.x = -1 * three.position.x
      six.position.y = three.position.y
      this.scene.add(six)
      //Seven
      let seven = new Three.LineLoop(unitCircle, material)
      seven.position.x = six.position.x
      seven.position.y = four.position.y
      this.scene.add(seven)       
    }
  }
})
</script>
