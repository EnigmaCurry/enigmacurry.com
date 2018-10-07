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
        },
        flower: {
          unitRadius: 2,
          level: 8,
          circleSegments: 128,
          color: 0x0000ff
        }
      }
    }
  },
  methods: {
    init: function() {
      let unitRadius = this.params.flower.unitRadius
      let material = new Three.LineBasicMaterial({ color: this.params.flower.color })
      let unitCircle = new Three.CircleGeometry( unitRadius, this.params.flower.circleSegments )
      unitCircle.vertices.shift()

      let points = this.flowerPattern(new Three.Vector3(0,0,0), unitRadius, this.params.flower.level)
      points.forEach(p => {
        let circle = new Three.LineLoop(unitCircle, material)
        circle.position.copy(p)
        this.scene.add(circle)
      })
    },
    flowerPattern: function(origin, unitRadius, levels) {
      let points = [ origin.clone() ]
      for (let level = 1; level <= levels; level++) {
        // Up
        points.push(new Three.Vector3(points[0].x, (points[0].y - level) * unitRadius, 0))
        // Down Right
        for (let c = 0; c < level; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius))
          points.push(p)
        }
        // Down
        for (let c = 0; c < level; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(0, 1 * unitRadius))
          points.push(p)
        }
        // Down Left
        for (let c = 0; c < level; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius))
          points.push(p)
        }
        // Up Left
        for (let c = 0; c < level; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius))
          points.push(p)
        }
        // Up
        for (let c = 0; c < level; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(0, -1 * unitRadius))
          points.push(p)
        }
        // Up Right
        for (let c = 0; c < level-1; c++) {
          let p = points[points.length-1].clone()
          p.add(new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius))
          points.push(p)
        }
      }
      return points
    }
  }
})
</script>
