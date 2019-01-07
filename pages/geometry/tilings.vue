<template>
  <tilings />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Tilings from '~/components/scenes/tilings.vue'

export default {
  layout: 'renderer',
  mixins: [ ScrollbarHide ],
  components: { Tilings }
}
</script>
