<template>
  <div>
    <flower-of-life />
    <g-html-overlay>
      Hello
    </g-html-overlay>
  </div>
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import FlowerOfLife from '~/components/scenes/flower-of-life.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {FlowerOfLife}
}
</script>
