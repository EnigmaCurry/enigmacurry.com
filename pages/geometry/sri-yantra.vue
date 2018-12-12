<template>
  <sri-yantra />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import SriYantra from '~/components/scenes/sri-yantra.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { SriYantra }
}
</script>
