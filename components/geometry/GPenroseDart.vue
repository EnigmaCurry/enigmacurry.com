<template>
  <g-mesh>
    <g-penrose-geometry proto-tile="dart" :origin="origin" />
  </g-mesh>
</template>

<script>
import * as Three from 'three'
import GPenroseTile from '~/components/geometry/GPenroseTile.vue'

export default {
  name: 'g-penrose-dart',
  mixins: [GPenroseTile],
  props: {
    color: {type: String, default: 'green'}
  },
  mounted() {
    if (this.origin === "top") {
      this.mesh.geometry.translate(0, 0, 0)
    }
    
    //let uvTestTexture = new Three.TextureLoader().load(require("~/assets/img/texture/uv-test.jpg"))
    let dartTexture = this.$textures.penroseDartTexture()

    this.mesh.material = new Three.MeshBasicMaterial({map: dartTexture, side: Three.DoubleSide})
    let uvs = this.mesh.geometry.faceVertexUvs[0]
    uvs.push([
      new Three.Vector2(0, 0),
      new Three.Vector2(1.13, 0.14),
      new Three.Vector2(0.5, 0.5)
    ])
    uvs.push([
      new Three.Vector2(0, 0),
      new Three.Vector2(0.5, 0.5),
      new Three.Vector2(1.13, 0.14),
    ])
    
    // Draw edges after translation is applied
    this.drawEdges()
  }  
}
</script>
