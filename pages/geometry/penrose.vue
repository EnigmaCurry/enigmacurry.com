<template>
  <kites-and-darts />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import KitesAndDarts from '~/components/scenes/kites-and-darts.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { KitesAndDarts }
}
</script>
