<script>
import * as Three from 'three'
import GGroup from '~/components/geometry/GGroup.vue'

export default {
  mixins: [GGroup],
  props: {
    iterations: {type: Number, default: 4},
    opacity: {type: Number, default: 1},
    tileType: {type: String, default:"ec1"}
  },
  created() {
    this.newMesh()
  },
  methods: {
    newMesh() {
      let group = this.curObj = new Three.Group()

      let geometry = this.$geometry.penroseTileGeometry(this.tileType, this.iterations)
      
      this.material1 = new Three.MeshBasicMaterial({
        map: this.$penroseTextures.penroseKiteTexture(), transparent: true, opacity: this.opacity})
      this.material2 = new Three.MeshBasicMaterial({
        map: this.$penroseTextures.penroseDartTexture(), transparent: true, opacity: this.opacity})
      

      let mesh = new Three.Mesh(geometry, [this.material1, this.material2])
      group.add(mesh)
    }
  },
}
</script>
