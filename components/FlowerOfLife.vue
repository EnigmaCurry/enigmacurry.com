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
          level: 4,
          circleSegments: 128,
          colors: [ 'white', 'red', 'blue', 'pink', 'green']
        }
      }
    }
  },
  methods: {
    init: function() {     
      this.materials = []
      this.params.flower.colors.forEach(c => {
        this.materials.push(new Three.LineBasicMaterial({ color: c }))
      })
      this.drawFlower()
    },
    drawFlower: function() {
      let unitRadius = this.params.flower.unitRadius
      let unitCircle = new Three.CircleGeometry( unitRadius, this.params.flower.circleSegments )
      unitCircle.vertices.shift()
      let points = this.flowerPattern(new Three.Vector3(0,0,0), unitRadius, this.params.flower.level)
      let level = 0
      let level_x = 1
      for(let p = 0; p < points.length; p++) {
        if(p > 0) {
          if (level_x >= (6*level)) {
            level += 1
            level_x = 1
          } else {
            level_x += 1
          }
        }
        let circle = new Three.LineLoop(unitCircle, this.materials[level])
        circle.position.copy(points[p])
        this.scene.add(circle)
      }
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
