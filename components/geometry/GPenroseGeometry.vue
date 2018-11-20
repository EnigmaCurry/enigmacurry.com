<script>
import * as Three from 'three'
import GGeometry from '~/components/geometry/GGeometry.vue'

export default {
  mixins: [GGeometry],
  props: {
    tileType: {type: String, default: "p2"},
    iterations: {type: Number, default: 1}
  },
  data () {
    let geometry = this.$geometry.penroseTileGeometry(this.tileType, this.iterations)
    return { geometry }
  },
}
</script>
