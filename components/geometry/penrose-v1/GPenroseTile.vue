<script>
import GObject3D from '~/components/geometry/GObject3D.vue'
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  mixins: [GObject3D],
  props: {
    color: {type: String, default: "black"},
    origin: {type: String, default: "top"},
    rotation: {type: Object, default: () => {return {x:0,y:0,z:0}}},
    worldRotation: {type: Number, default: 0},
    worldOrigin: {type: Object, default: () => {return {x:0,y:0,z:0}}},
    wireColor: {type: String, default: "white"},
    wireWidth: {type: Number, default: 2},
    animated: {type: Boolean, default: false},
  },
  provide () {
    return { meshParent: this }
  },
  data() {
    let dartDimensions = this.$penroseV1.penroseV1.dartDimensions()
    let kiteDimensions = this.$penroseV1.penroseV1.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions,
      kiteTranslation: {x:0, y:-1 * dartDimensions.gnomonBase, z:0},
      currentTweenDirection: 1
    }
  },
  mounted() {
    this.rotateWorld(new Three.Vector3(this.worldOrigin.x, this.worldOrigin.y, this.worldOrigin.z), this.worldRotation)

    //Animate world rotation
    let worldOrigin = new Three.Vector3(this.worldOrigin.x, this.worldOrigin.y, this.worldOrigin.z)
  },
  methods: {
    drawEdges() {
      //Wireframe edges:
      let wireGeometry = new Three.EdgesGeometry( this.mesh.geometry )
      let wireMaterial = new Three.LineBasicMaterial( { color: new Three.Color(this.wireColor), linewidth: this.wireWidth } )
      this.mesh.add( new Three.LineSegments( wireGeometry, wireMaterial ) )
    },
    rotateWorld(around, angle) {
      let rotationAxis = new Three.Vector3(0,0,1)
      let axis = around.clone().sub(rotationAxis).normalize()
      this.curObj.position.applyAxisAngle(axis, angle)
    }
  }
}
</script>
