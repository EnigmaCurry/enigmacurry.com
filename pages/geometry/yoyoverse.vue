<template>
  <yo-yo-verse />
</template>

<script>
import ScrollbarHide from '~/components/ScrollbarHide.vue'
import YoYoVerse from '~/components/scenes/yoyoverse.vue'

export default {
  layout: 'renderer',
  mixins: [ScrollbarHide],
  components: {YoYoVerse}
}
</script>
