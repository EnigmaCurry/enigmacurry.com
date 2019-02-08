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
    antialias: {type: Boolean, default: false}
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
  },
  mounted () {
    // for threejs-inspector to work
    // https://github.com/jeromeetienne/threejs-inspector
    if (process.env.NODE_ENV === 'development') {
      window.THREE = Three
      window.scene = this.curObj
    }
    let camera = this.cameras[this.currentCamera]
    this.renderPass = new Three.RenderPass(this.curObj, camera)
    this.renderer.antialiasPass.enabled = this.antialias
    this.renderer.effectComposer.insertPass(this.renderPass, 0)
  },
  destroyed() {
    this.renderer.sceneData = filter(
      this.renderer.sceneData,
      gscene => {return gscene != this}
    )
    this.renderer.effectComposer.passes = filter(
      this.renderer.effectComposer.passes,
      pass => { return pass != this.renderPass }
    )
    this.renderer.antialiasPass.enabled = false

  }
}
</script>
