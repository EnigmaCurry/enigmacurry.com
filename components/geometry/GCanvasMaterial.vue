<script>
import {Base} from 'vue-threejs'
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  name: 'GCanvasMaterial',
  mixins: [Base],
  inject: ['meshVm'],
  props: {
    canvasId: {type: String},
    type: { type: String, default: 'MeshBasic' },
    wireColor: {type: String, default: "#ffffff"},
  },
  provide () {
    return { material: this.material }
  },
  mounted () {
    let texture = window.offscreenCanvasTextures[this.canvasId]
    this.material = new Three.MeshBasicMaterial({map: texture, transparent: true})
    this.meshVm.curObj.material = this.material
  },
  beforeDestroy () {
    this.meshVm.curObj.material = null
  }

}
</script>
