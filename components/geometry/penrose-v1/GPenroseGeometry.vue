<template>
</template>

<script>
import * as Three from 'three'
import GGeometry from '~/components/geometry/GGeometry.vue'

export default {
  mixins: [ GGeometry ],
  props: {
    protoTile: {type: String},
    width: {type: Number, default: 1},
    origin: {type: String, default: "top"}, //top, bottom, left, right
  },
  data () {
    let func = this.$penroseV1.penroseV1[this.protoTile]
    let geometry = func(this.width, this.origin)
    return { geometry }
  }
}
</script>
