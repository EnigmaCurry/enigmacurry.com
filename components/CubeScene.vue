<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  methods: {
    init: function() {
      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
      let material = new Three.MeshNormalMaterial()
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
      this.camera.position.z = 1
    },
    update: function() {
      this.mesh.rotation.x += 0.002
      this.mesh.rotation.y += 0.001
    }
  }
})
</script>
