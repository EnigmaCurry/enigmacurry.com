<script>
import * as Three from 'three'
import GGeometry from '~/components/geometry/GGeometry.vue'

export default {
  mixins: [GGeometry],
  props: {
    iterations: {type: Number, default: 1}
  },
  data () {
    let geometry = this.$geometry.penroseP3Geometry(this.iterations)
    return { geometry }
  },
}
</script>
