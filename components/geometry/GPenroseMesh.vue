<script>
import * as Three from 'three'
import GGroup from '~/components/geometry/GGroup.vue'

export default {
  mixins: [GGroup],
  props: {
    tileType: {type: String, default: "p2"},
    iterations: {type: Number, default: 1},
    wireframe: {type: Boolean, default: false},
    wireColor: {type: Object, default: () => {new Three.Color(0xffffff)}},
    wireOpacity: {type: Number, default: 1},
    initialTriangles: {type: Array, default: () => {return []}},
    dartOpacity: {type: Number, default: 1},
    kiteOpacity: {type: Number, default: 1},
    thinRhombOpacity: {type: Number, default: 1},
    thickRhombOpacity: {type: Number, default: 1},
  },
  watch: {
    tileType: {
      handler (i) {
        this.newMesh()
      }
    },
    iterations: {
      handler (i) {
        this.newMesh()
      }
    },
    wireColor: {
      handler (o) {
        this.outlineMaterial.color.setRGB(o.r, o.g, o.b)
      }
    },    
    wireOpacity: {
      handler (o) {
        this.outlineMaterial.opacity = o
      }
    },    
  },
  created() {
    this.newMesh()
  },
  methods: {
    newMesh() {
      let group = this.curObj = new Three.Group()
      let geometry = this.$geometry.penroseTileGeometry(this.tileType, this.iterations, this.initialTriangles)
      
      if (this.tileType === 'p2') {
        this.material1 = new Three.MeshBasicMaterial({
          map: this.$penroseTextures.penroseKiteTexture(), transparent: this.kiteOpacity < 1, opacity: this.kiteOpacity})
        this.material2 = new Three.MeshBasicMaterial({
          map: this.$penroseTextures.penroseDartTexture(), transparent: this.dartOpacity < 1, opacity: this.dartOpacity})
        group.add(new Three.Mesh(geometry, [this.material1, this.material2 ]))
      } else {
        this.material1 = new Three.MeshBasicMaterial({
          map: this.$penroseTextures.penroseThinRhombTexture(), transparent: this.thinRhombOpacity < 1, opacity: this.thinRhombOpacity})
        this.material2 = new Three.MeshBasicMaterial({
          map: this.$penroseTextures.penroseThickRhombTexture(), transparent: this.thickRhombOpacity < 1, opacity: this.thickRhombOpacity})
        group.add(new Three.Mesh(geometry, [this.material1, this.material2]))
      }
      
      this.outlineMaterial = new Three.LineBasicMaterial( { color: this.wireColor, transparent: true, linewidth: 1, depthTest: false} )
      if (this.wireframe) {
        let outlineGeometry
        if (this.tileType === "p2") {
          outlineGeometry = this.$geometry.penroseTileP2OutlineGeometry(geometry)
          group.add( new Three.LineSegments(outlineGeometry, this.outlineMaterial) )
        } else if ( this.tileType === "p3") {
          outlineGeometry = this.$geometry.penroseTileP3OutlineGeometry(geometry)
          group.add( new Three.LineSegments(outlineGeometry, this.outlineMaterial) )
        }
        
        //Outside outline
        let outsideGeometry = new Three.EdgesGeometry( geometry )
        group.add( new Three.LineSegments( outsideGeometry, this.outlineMaterial ) )
      }
    }
  }
}
</script>
