<template>
  <circumferencia />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import Circumferencia from '~/components/scenes/circumferencia.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { Circumferencia }
}
</script>
