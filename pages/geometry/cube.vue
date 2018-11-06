<template>
  <g-renderer class="renderer" ref="renderer">
    <scene>
      <g-camera orthographic :zoom=280></g-camera>
      <g-cube :size="size" :position="{z:-1}"/>
      <!-- <g-cube :size="size" :position="{z:0}"/> -->
      <!-- <g-cube :size="size" :position="{z:1}"/> -->
    </scene>
  </g-renderer>
</template>

<script>
import MusicPlayerHide from '~/components/MusicPlayerHide.vue'
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import uuid from 'uuid/v1'

export default {
  mixins: [ScrollbarHide, MusicPlayerHide],
  data() {
    return {
      size: 3
    }
  }
}
</script>
