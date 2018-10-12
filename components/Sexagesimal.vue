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
      let poly = this.polyClock()
      this.scene.add(poly)
    }
  }
})
</script>
