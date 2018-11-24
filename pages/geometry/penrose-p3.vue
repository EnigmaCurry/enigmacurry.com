<template>
  <penrose-p3 />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import PenroseP3 from '~/components/scenes/penrose-p3.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { PenroseP3 }
}
</script>
