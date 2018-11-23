<template>
  <kites-and-darts />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import KitesAndDarts from '~/components/scenes/kites-and-darts.vue'
import KitesAndDartsVariation from '~/components/scenes/kites-and-darts-variation.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { KitesAndDarts, KitesAndDartsVariation }
}
</script>
