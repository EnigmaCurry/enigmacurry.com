<script>
import GObject3D from '~/components/geometry/GObject3D.vue'
import * as Three from 'three'

export default {
  name: 'g-group',
  mixins: [GObject3D],
  provide () {
    return { meshParent: this }
  },
  props: {
    worldRotation: {type: Number, default: 0},
    worldOrigin: {type: Object, default: () => {return {x:0,y:0,z:0}}},    
  },
  data() {
    let group = new Three.Group()
    return {curObj: group}
  },
  methods: {
    rotateWorld(around, angle) {
      let rotationAxis = new Three.Vector3(0,0,1)
      let axis = around.clone().sub(rotationAxis).normalize()
      this.curObj.position.applyAxisAngle(axis, angle)
    }    
  },
  mounted() {
    this.rotateWorld(new Three.Vector3(this.worldOrigin.x, this.worldOrigin.y, this.worldOrigin.z), this.worldRotation)
  }
}
</script>
