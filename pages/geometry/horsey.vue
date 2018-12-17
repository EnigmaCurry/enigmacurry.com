<template>
  <horsey />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Horsey from '~/components/scenes/horsey.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { Horsey }
}
</script>
