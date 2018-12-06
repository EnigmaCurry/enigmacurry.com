<script>
import {Base} from 'vue-threejs'
import * as THREE from 'three'

export default {
  name: 'Material',
  mixins: [Base],
  inject: ['meshVm'],
  props: {
    options: { type: Object, default: () => ({}) },
    obj: { type: Object },
    color: { type: Number },
    type: { type: String, default: '' }
  },
  watch: {
    obj (obj) {
      this.material = obj
    }
  },
  data () {
    let material = this.obj

    if (!material) {
      let mod = `${this.type}Material`
      let opts = { ...this.options }
      if (this.color) opts.color = this.color
      material = new THREE[mod](opts)
    }
    
    return { material }
  },
  provide () {
    return { material: this.material }
  },
  mounted () {
    this.meshVm.curObj.material = this.material
  },
  beforeDestroy () {
    this.meshVm.curObj.mate
    this.material = null
  },
}
</script>
