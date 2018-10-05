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
          position: { x:0, y:0, z:5 },
          frustrum: {
            type: 'dynamic',
            left: -4000,
            right: 4000,
            top: -4000,
            bottom: 4000
          }
        }
      }
    }
  },
  methods: {
    init: function() {
      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)
      let material = new Three.MeshNormalMaterial()
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
    },
    update: function() {
      this.mesh.rotation.x += 0.02
      this.mesh.rotation.y += 0.005
    }
  }
})
</script>
