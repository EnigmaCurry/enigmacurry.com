<script>
import {Object3D} from 'vue-threejs'

export default {
  name: 'Mesh',
  mixins: [Object3D],
  inject: ['meshParent'],
  props: {
    type: { type: String, default: 'Mesh' }
  },
  provide () {
    return { meshVm: this }
  },
  created() {
    this.meshParent.mesh = this.curObj
  }
}
</script>
