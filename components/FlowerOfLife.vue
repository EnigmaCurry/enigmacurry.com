<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  data() {
    return {
      params: {
        animate: true,
        camera: {
          type: 'orthographic',
          frustrum: {
            type: 'dynamic'
          }
        },
        flower: {
          resetInterval: 48,
          unitRadius: 40,
          levelMin: 1,
          levelMax: 25,
          circleSegments: 128,
          colors: [ 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ],
          colorCycleRate: 2,
          colorInterpolation: 0.05,
          rotationRateMax: 0.003,
          rotationRateMin: 0.0004,
          maxZoomRate: 0.002
        }
      }
    }
  },
  methods: {
    init: function() {
      this._objects = []
      this.timers = []
      this.reset()
    },
    reset: function() {
      //Cancel all callbacks:
      for (let t = 0; t < this.timers.length; t++) {
        clearInterval(this.timers[t])
      }
      //Remove all objects from the scene:
      this._objects.forEach(obj => {
        this.scene.remove(obj)
      })
      this._objects = []
      //Randomize rotation rate and direction:
      this._rotationRate = ((Math.random() * (this.params.flower.rotationRateMax-this.params.flower.rotationRateMin))
                            + this.params.flower.rotationRateMin)
      this._rotationRate = Math.random() > 0.5 ? -1 * this._rotationRate : this._rotationRate
      //Randomize flower level:
      this.params.flower.level = Math.floor((Math.random() * this.params.flower.levelMax) + this.params.flower.levelMin)
      //Small levels should subtly zoom out, Large levels subtly in:
      if (this.params.flower.level < 0.5 * this.params.flower.levelMax) {
        this._zoomRate = -1 * (Math.random() * this.params.flower.maxZoomRate)
      } else {
        this._zoomRate = Math.random() * this.params.flower.maxZoomRate
      }
      //Draw a new flower:
      this._materials = []
      this._colors = []
      for (let c = 0; c < this.params.flower.colors.length; c++) {
        let color = new Three.Color(this.params.flower.colors[c])
        this._colors.push(color)
        this._materials.push(new Three.LineBasicMaterial({ color: color }))
      }
      this.drawFlower()
      this.setSize()
      //Periodic callbacks:
      this.timers.push(setInterval(this.cycleColors, this.params.flower.colorCycleRate * 1000))
      this.timers.push(setInterval(this.reset, this.params.flower.resetInterval * 1000))
    },
    onResize: function() {
      //Maintain zoom level of flower corresponding to resized container:
      let flowerDiameter = this.params.flower.level * 1 * this.params.flower.unitRadius
      if (this.container.clientWidth < this.container.clientHeight) {
        this.camera.zoom = this.container.clientWidth / flowerDiameter
      } else {
        this.camera.zoom = this.container.clientHeight / flowerDiameter
      }
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
        let circle = new Three.LineLoop(unitCircle, this._materials[level % this._materials.length])
        circle.position.copy(points[p])
        this._objects.push(circle)
        this.scene.add(circle)
      }
    },
    cycleColors: function() {
      //cycle materials
      this._colors.push(this._colors.shift())
    },
    update: function() {
      for (let m = 0; m < this._materials.length; m++) {
        this._materials[m].color.lerp(this._colors[m], this.params.flower.colorInterpolation)
      }
      this.camera.rotation.z = this.camera.rotation.z + this._rotationRate
      this.camera.zoom = this.camera.zoom + this._zoomRate
      this.camera.updateProjectionMatrix()
    },
    flowerPattern: function(origin, unitRadius, levels) {
      let points = [ origin.clone() ]
      let clockPattern = [
        //Down Right
        new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius),
        //Down
        new Three.Vector3(0, 1 * unitRadius),
        //Down Left
        new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius),
        //Up Left
        new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius),
        //Up
        new Three.Vector3(0, -1 * unitRadius),
        //Up Right
        new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius)
      ]
      for (let level = 1; level <= levels; level++) {
        // Up Level
        points.push(new Three.Vector3(points[0].x, (points[0].y - level) * unitRadius, 0))
        // Around the outside clockwise
        for (let vec=0; vec < clockPattern.length; vec++) {
          //Edge length is the same as the level, except for the last segment:
          let edgeLength = (vec === clockPattern.length - 1) ? level -1 : level
          for (let c=0; c < edgeLength; c++) {
            let p = points[points.length-1].clone()
            p.add(clockPattern[vec])
            points.push(p)
          }
        }
      }
      return points
    }
  }
})
</script>
