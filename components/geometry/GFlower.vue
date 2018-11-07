<script>
import * as Three from 'three'
import {Object3D} from 'vue-threejs'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: "g-flower",
  mixins: [Object3D],
  props: {
    levels: {type: Number, default: 7},
    unitRadius: {type: Number, default: 2},
    circleSegments: {type: Number, default: 64}
  },
  data() {
    return {
      colorChoices: [
        [ 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ],
        [ 0xBF0B2C, 0x02173D, 0x0AA38C, 0xF5900F, 0xF24E13, 0x011627, 0xf71735, 0x41ead4, 0xfdfffc, 0xff9f1c ],
        [ 0x515e6b, 0xb2b5be, 0x40434a, 0xd0cfd4, 0x43525c, 0x670bf3, 0xffe400, 0xff1053, 0x390099, 0xffae03 ],
      ]
    }
  },
  created() {
    this.newFlower({
      numLevels: this.levels,
      colors: this.colorChoices[0],
      unitRadius: this.unitRadius,
      circleSegments: this.circleSegments
    })
  },
  methods: {
    newFlower({numLevels, colors, unitRadius, circleSegments}) {
      let group = new Three.Group()
      this.curObj = group
      let shape = new Three.CircleGeometry(unitRadius, circleSegments)
      shape.vertices.shift()
      
      // Create colors and materials
      this._colors = []
      this._materials = []
      for (let c = 0; c < colors.length; c++) {
        let color = new Three.Color(colors[c])
        this._colors.push(color)
        this._materials.push(new Three.LineBasicMaterial({ color }))
      }
      
      // Draw flower
      let pattern = this.$geometry.flowerPattern(new Three.Vector3(0,0,0), unitRadius, numLevels)
      let level = 0
      let level_x = 1
      for(let p=0; p < pattern.length; p++) {
        if(p > 0) {
          if (level_x >= (6*level)) {
            level += 1
            level_x = 1
          } else {
            level_x += 1
          }
        }
        let material = this._materials[level % this._materials.length]
        let mesh = new Three.LineLoop(shape, material)
        mesh.position.copy(pattern[p])
        group.add(mesh)
      }
    },
    tweenMaterial(level) {
      
    }
  }
}
</script>
