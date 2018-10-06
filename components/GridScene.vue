<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  data() {
    return {
      params: {
        animate: false,
        container: {
          width: '1000px',
          height: '1000px'
        },
        camera: {
          type: 'orthographic',
          frustrum: {
            type: 'static',
            left: -50,
            right: 50,
            top: -50,
            bottom: 50
          }
        }
      }
    }
  },
  methods: {
    init: function() {
      var material = new Three.LineBasicMaterial({ color: 0x0000ff })
      var geometry = new Three.Geometry()
      geometry.vertices.push(new Three.Vector3(-10, 0, 0))
      geometry.vertices.push(new Three.Vector3(0, 10, 0))
      geometry.vertices.push(new Three.Vector3(10, 0, 0))
      var line = new Three.Line(geometry, material)
      this.scene.add(line)
    },
    update: function() {
    }
  }
})
</script>
