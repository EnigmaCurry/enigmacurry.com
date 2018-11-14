<script>
import { Object3D } from 'vue-threejs'
import * as Three from 'three'

export default {
  mixins: [Object3D],
  props: {
    color: {type: String, default: "orange"},
    origin: {type: String, default: "top"},
    rotation: {type: Object, default: () => {return {x:0,y:0,z:0}}},
    wireColor: {type: String, default: "white"},
    wireWidth: {type: Number, default: 2}    
  },
  provide () {
    return { meshParent: this }
  },
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions()
    let kiteDimensions = this.$geometry.penrose.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions,
      kiteTranslation: {x:0, y:-1 * dartDimensions.gnomonBase, z:0}
    }
  },
  mounted() {
    // Materials:
    this.mesh.material = new Three.MeshStandardMaterial({color: new Three.Color(this.color), wireframe: true})
  },
  methods: {
    drawEdges() {
      //Wireframe edges:
      let wireGeometry = new Three.EdgesGeometry( this.mesh.geometry )
      let wireMaterial = new Three.LineBasicMaterial( { color: new Three.Color(this.wireColor), linewidth: this.wireWidth } )
      this.mesh.add( new Three.LineSegments( wireGeometry, wireMaterial ) )
    }
  }
}
</script>
