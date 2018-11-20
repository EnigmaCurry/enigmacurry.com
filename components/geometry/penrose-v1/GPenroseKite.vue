<template>
  <g-mesh>
    <g-penroseV1-geometry proto-tile="kite" :origin="origin" />
  </g-mesh>
</template>
  
  <script>
import * as Three from 'three'
import GPenroseTile from '~/components/geometry/penrose-v1/GPenroseTile.vue'

export default {
  name: 'g-penroseV1-kite',
  mixins: [GPenroseTile],
  props: {
    color: {type: String, default: "red"},
  },
  mounted() {
    
    let uvTestTexture = new Three.TextureLoader().load(require("~/assets/img/texture/uv-test.jpg"))
    let kiteTexture = this.$textures.penroseKiteTexture()
    
    this.mesh.material = new Three.MeshBasicMaterial({map: kiteTexture, side: Three.DoubleSide})
    let uvs = this.mesh.geometry.faceVertexUvs[0]
    uvs.push([
      new Three.Vector2(0, 0),
      new Three.Vector2(0.69, 0.1),
      new Three.Vector2(0.5, 0.5)
    ])
    uvs.push([
      new Three.Vector2(0, 0),
      new Three.Vector2(0.5, 0.5),
      new Three.Vector2(0.69, 0.1),
    ])


    // Draw edges after translation is applied
    this.drawEdges()
  }
}
</script>
