<script>
import * as Three from 'three'
import GMesh from '~/components/geometry/GMesh.vue'

export default {
  mixins: [GMesh],
  props: {
    tileType: {type: String, default: "p2"},
    iterations: {type: Number, default: 1},
    wireframe: {type: Boolean, default: false},
  },  
  created() {
    let geometry = this.$geometry.penroseTileGeometry(this.tileType, this.iterations)
    let material1 = new Three.MeshBasicMaterial({side: Three.FrontSide, wireframe: this.wireframe, color: 0xff0000})
    let material2 = new Three.MeshBasicMaterial({side: Three.FrontSide, wireframe: this.wireframe, color: 0x0000ff})
    let material3 = new Three.MeshBasicMaterial({side: Three.FrontSide, wireframe: this.wireframe, color: 0xaa0000})
    let material4 = new Three.MeshBasicMaterial({side: Three.FrontSide, wireframe: this.wireframe, color: 0x0000aa})
    this.curObj = new Three.Mesh(geometry, [material1, material2, material3, material4])
  }
}
</script>
