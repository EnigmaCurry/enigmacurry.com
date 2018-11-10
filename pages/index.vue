<template>
  <flower-of-life />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import FlowerOfLife from '~/components/scenes/flower-of-life.vue'

export default {
  mixins: [ScrollbarHide],
  components: {FlowerOfLife}
}
</script>
