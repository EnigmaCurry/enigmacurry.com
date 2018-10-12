<script>
import * as Three from 'three'
import PolygonClock from './PolygonClock'
import Vue from 'vue'

export default Vue.extend({
  mixins: [PolygonClock],
  data() {
    return {
      params: {
        geometry: {
          vertices: 60,
          unitRadius: 0.40 * (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight),
          pointRadius: 5,
          showPoly: false,
          showLabels: true,
          labelSize: 30,
          labelRadiusOffset: 30
        }
      }
    }
  },
  methods: {
    init: function() {
      let flower = this.$flowerPattern(new Three.Vector3(0,0,0), this.params.geometry.unitRadius, 1)
      let labels = this._createSequentialLabels(this.params.geometry.vertices, 0.25* this.params.geometry.vertices)
      for (let i=0; i < flower.length; i++) {
        let poly = this.polyClock(labels)
        let position = flower[i]
        poly.position.set(position.x, position.y, position.z)
        this._labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 
38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
        this.scene.add(poly)
      }
    },
  }
})
</script>
