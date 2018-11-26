<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :clearAlpha="0.33" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="8"/>

      <!-- <g-grid :divisions="10"/> -->

      <g-subdivision-mesh :rotation="rotation1" :scale="2.5" :opacity="0.6" tile-type="p2"/>
      <g-subdivision-mesh :rotation="rotation1" :scale="2.5" :opacity="0.3" tile-type="p3"/>
      <g-subdivision-mesh :rotation="rotation1" :scale="2" :opacity="0.15"/>
      <g-subdivision-mesh :rotation="rotation2" :scale="2" :opacity="0.15"/>
      <animation :fn="animate"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import GSubdivisionMesh from '~/components/geometry/GSubdivisionMesh.vue'

export default {
  components: {GSubdivisionMesh},
  props: {
    animated: {type: Boolean, default: true},
    backgroundClass: {type: String, default: "nine-pow-cantor-general"}
  },
  data() {
    return {
      rotation1: new Three.Vector3(),
      rotation2: new Three.Vector3()
    }
  },
  mounted() {
    this.$penroseTextures.newPenroseTweens('p2')
    document.getElementById('bg').classList.add(this.backgroundClass)
  },
  beforeDestroy() {
    document.getElementById('bg').classList.remove(this.backgroundClass)
    this.$penroseTextures.cancelPenroseTweens()
  },  
  methods: {
    animate(tt) {
      this.$penroseTextures.updatePenroseTweens('p2')
      this.rotation1.z += 0.0001
      this.rotation2.z -= 0.0001
    }    
  }
}
</script>
