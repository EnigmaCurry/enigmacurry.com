<script>
import {Base} from 'vue-threejs'
import * as Three from 'three'

export default {
  name: 'g-geometry',
  mixins: [Base],
  inject: ['meshVm'],
  props: {
    args: { type: Array, default: () => [] },
    type: { type: String, default: '' }
  },
  
  data () {
    let mod = `${this.type}Geometry`
    let geometry = new Three[mod](...this.args)
    return { geometry }
  },
  mounted () {
    let mesh = this.meshVm.curObj
    this.geometry.__is_g_geometry = true
    // Replace the existing placeholder geometry, or merge with an existing g-geometry:
    if (!mesh.geometry.__is_g_geometry) {
      mesh.geometry = this.geometry      
    } else {
      this.geometry.mergeMesh(mesh)
      mesh.geometry = this.geometry
    }
  },
  
  beforeDestroy () {
    this.meshVm.curObj.geometry = null
  }
}
</script>
