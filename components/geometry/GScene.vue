<script>
/* eslint-disable no-duplicate-imports */
import { Scene } from 'three'
import * as Three from 'three'
import "imports-loader?THREE=three!../../node_modules/three/examples/js/postprocessing/RenderPass"
import GObject3D from '~/components/geometry/GObject3D.vue'
import {filter} from 'underscore'
export default {
  name: 'Scene',
  mixins: [GObject3D],
  inject: ['renderer'],
  props: {
    obj: { type: Object },
    antialias: {type: Boolean, default: false},
    downscale: {type: Number, default: 1}
  },
  provide() {
    return {
      renderer: this.renderer,
      scene: this
    }
  },
  data () {
    let curObj = this.obj
    if (!curObj) {
      curObj = new Scene()
    }
    curObj.name = curObj.name || curObj.type
    let cameras = {}
    let currentCamera = null
    return { curObj, cameras, currentCamera }
  },
  created() {
    this.renderer.sceneData.push(this)
    this.renderer.downscale *= this.downscale
  },
  mounted () {
    // for threejs-inspector to work
    // https://github.com/jeromeetienne/threejs-inspector
    if (process.env.NODE_ENV === 'development') {
      window.THREE = Three
      window.scene = this.curObj
    }
    let camera = this.cameras[this.currentCamera]
    // Setup default post processing effects on new scene mount
    // This means scenes can do whatever post processing they want
    // and get a clean slate each start.
    const effects = []
    if(this.antialias) {
      effects.push(this.renderer.antialiasPass)
    }
    this.renderer.setupPostProcessing(new Three.RenderPass(this.curObj, camera), effects)
    this.renderer.onResize()
  },
  destroyed() {
    this.renderer.downscale /= this.downscale
    this.renderer.sceneData = filter(
      this.renderer.sceneData,
      gscene => {return gscene != this}
    )
  }
}
</script>
