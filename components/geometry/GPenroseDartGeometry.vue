<template>
</template>

<script>
import * as Three from 'three'
import GGeometry from '~/components/geometry/GGeometry.vue'

export default {
  mixins: [ GGeometry ],
  props: {
    width: {type: Number, default: 1},
    origin: {type: String, default: "top"}, //top, bottom, left, right
  },
  data () {
    let geometry = this.$geometry.penrose.dart(this.width, this.origin)
    return { geometry }
  }
}
</script>
