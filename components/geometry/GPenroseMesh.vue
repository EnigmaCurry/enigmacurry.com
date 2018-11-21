<script>
import * as Three from 'three'
import GGroup from '~/components/geometry/GMesh.vue'

export default {
  mixins: [GGroup],
  props: {
    tileType: {type: String, default: "p2"},
    iterations: {type: Number, default: 1},
    wireframe: {type: Boolean, default: false},
  },
  created() {
    let group = this.curObj = new Three.Group()
    let geometry = this.$geometry.penroseTileGeometry(this.tileType, this.iterations)

    let kiteMaterial = new Three.MeshBasicMaterial({map: this.$penroseTextures.penroseKiteTexture()})
    let dartMaterial = new Three.MeshBasicMaterial({map: this.$penroseTextures.penroseDartTexture()})
    group.add(new Three.Mesh(geometry, [kiteMaterial, dartMaterial ]))
    
    let outlineMaterial = new Three.LineBasicMaterial( { color: "white", linewidth: 1 } )
    let outlineGeometry
    if (this.tileType === "p2") {
      outlineGeometry = this.$geometry.penroseTileP2OutlineGeometry(geometry)
    } else if ( this.tileType === "p3") {
      outlineGeometry = this.$geometry.penroseTileP3OutlineGeometry(geometry)
    }
    group.add( new Three.LineSegments(outlineGeometry, outlineMaterial) )

    //Outside outline
    let outsideGeometry = new Three.EdgesGeometry( geometry )
    let outsideMaterial = new Three.LineBasicMaterial( { color: "white", linewidth: 1 } )
    group.add( new Three.LineSegments( outsideGeometry, outsideMaterial ) )

  }
}
</script>
