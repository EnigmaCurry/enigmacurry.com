<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  data() {
    return {
      params: {
        animate: false
      }
    }
  },
  methods: {
    init: function() {
      let geometry = new Three.CircleGeometry(1, 64)
      let material = new Three.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: Three.DoubleSide,
        flatShading: true
      })
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
      this.camera.position.z = 5
    },
    update: function() {
    }
  }
})
</script>
