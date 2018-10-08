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
          resetInterval: 60,
          unitRadius: 40,
          levelMin: 3,
          levelMax: 24,
          circleSegments: [128,12,6,4,3],
          colors: [
            [ 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ],
            [ 0xBF0B2C, 0x02173D, 0x0AA38C, 0xF5900F, 0xF24E13, 0x011627, 0xf71735, 0x41ead4, 0xfdfffc, 0xff9f1c ],
            [ 0x515e6b, 0xb2b5be, 0x40434a, 0xd0cfd4, 0x43525c, 0x670bf3, 0xffe400, 0xff1053, 0x390099, 0xffae03 ],
          ],
          colorCycleRate: 2,
          colorSwapRate: 20,
          colorInterpolation: 0.05,
          rotationRateMax: 0.003,
          rotationRateMin: 0.0004,
          zoomRateMax: 0.002,
          zoomRateMin: 0.0002,
          zoomMin: 1,
          zoomMax: 8
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
        this._zoomRate = -1 * (Math.random() * this.params.flower.zoomRateMax)
      } else {
        this._zoomRate = (Math.random() * (this.params.flower.zoomRateMax - this.params.flower.zoomRateMin)) + this.params.flower.zoomRateMin
      }
      //Randomize material colors
      this._colors = []
      this._materials = []
      for (let c = 0; c < this.params.flower.level; c++) {
        let color = new Three.Color()
        this._colors.push(color)
        this._materials.push(new Three.LineBasicMaterial({ color: color }))
      }
      this._swapColors()
      //Draw a new flower:
      this.drawFlower()
      this.setSize()
      //Periodic callbacks:
      this.timers.push(setInterval(this._cycleColors, this.params.flower.colorCycleRate * 1000))
      this.timers.push(setInterval(this._swapColors, this.params.flower.colorSwapRate * 1000))
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
      let unitCircle = new Three.CircleGeometry( unitRadius,
                                                 this.params.flower.circleSegments[Math.floor(Math.random() * this.params.flower.circleSegments.length)] )
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
    _swapColors: function() {
      //Randomize flower color swatch
      this._colorSwatch = this.params.flower.colors[Math.floor(Math.random() * this.params.flower.colors.length)]
      for (let c = 0; c < this._colors.length; c++) {
        this._colors[c].set(this._colorSwatch[c % this._colorSwatch.length])
      }
    },
    _cycleColors: function() {
      //cycle materials
      this._colors.push(this._colors.shift())
    },
    update: function() {
      for (let m = 0; m < this._materials.length; m++) {
        this._materials[m].color.lerp(this._colors[m], this.params.flower.colorInterpolation)
      }
      this.camera.rotation.z = this.camera.rotation.z + this._rotationRate
      if (this._zoomRate > 0 && this.camera.zoom > this.params.flower.zoomMax) {
        this._zoomRate = this._zoomRate * -1
      } else if (this._zoomRate < 0 && this.camera.zoom < this.params.flower.zoomMin) {
        this._zoomRate = this._zoomRate * -1
      }
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
