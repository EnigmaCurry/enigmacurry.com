<template>
  <svg-test />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import SvgTest from '~/components/scenes/svg-test.vue'

export default {
  mixins: [ ScrollbarHide ],
  components: { SvgTest }
}
</script>
