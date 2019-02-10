<template>
  <hexshader-scene />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import HexshaderScene from '~/components/scenes/hexshader.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { HexshaderScene }
}
</script>
