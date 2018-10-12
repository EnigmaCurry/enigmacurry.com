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
          vertices: 60
        }
      }
    }
  },
  methods: {
    init: function() {
      let params = {
        vertices: this.params.geometry.vertices,
        radius: this.params.geometry.unitRadius,
        showVertices: this.params.geometry.showVertices,
        labels: this._createLabelSequence(this.params.geometry.vertices, (0.25*this.params.geometry.vertices)-1),
        labelRadius: this.params.geometry.unitRadius + this.params.geometry.labelRadiusOffset,
        labelSize: this.params.geometry.labelSize,
        labelColor: this.params.geometry.labelColor
      }
      let poly = this.regularPolygon(
        params.vertices, params.radius, params.showVertices, params.labels,
        params.labelRadius, params.labelSize, params.labelColor
      )
      this.scene.add(poly)
    }
  }
})
</script>
