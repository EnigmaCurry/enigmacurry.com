<script>
import * as Three from 'three'
export default {
  props: {
    scale: { type: [Object, Number] }, // { x, y, z }
    position: { type: Object }, // { x, y, z }
    rotation: { type: Object }, // { x, y, z }
    worldRotation: {type: Number, default: 0},
    worldOrigin: {type: Object, default: () => {return {x:0,y:0,z:0}}},    
  },
  
  data() {
    let dartDimensions = this.$penroseV1.penroseV1.dartDimensions()
    let kiteDimensions = this.$penroseV1.penroseV1.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions
    }
  },
}
</script>
