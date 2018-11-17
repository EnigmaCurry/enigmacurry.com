<template>
  <penrose-test />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PenroseTest from '~/components/scenes/penrose-test.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { PenroseTest }
}
</script>
