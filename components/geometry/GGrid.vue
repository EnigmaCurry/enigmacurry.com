<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'

export default {
  mixins: [Object3D],
  props: {
    gridType: {type: String, default: "grid"}, //or "polar"
    plane: {type: String, default: "x"},
    size: {type: Number, default: 10},
    divisions: {type: Number, default: 10},
    centerColor: {type: String, default: "red"},
    color: {type: String, default: "blue"}
  },
  created() {
    let grid
    if (this.gridType === 'polar') {
      grid = new Three.PolarGridHelper(this.size, this.divisions, 8, this.divisions, this.color, this.color)
    } else {
      grid = new Three.GridHelper(this.size, this.divisions, this.centerColor, this.color)
    }
    if (this.plane === 'x') {
      grid.rotation.x = 0.5 * Math.PI
    } else if (this.plane === 'y') {
      grid.rotation.z = 0.5 * Math.PI
    }
    this.curObj = grid
  }
}
</script>
