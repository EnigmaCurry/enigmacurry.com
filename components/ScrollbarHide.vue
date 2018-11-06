<template>
</template>

<script>
import uuid from 'uuid/v1'

export default {
  mounted() {
    this._scrollbar_hide_id = uuid()
    // Scrollbar hiding is implemented in ~/layouts/default.vue
    // ID is so we can handle muliple components lifecycles
    this.$bus.$emit('scrollbar-hide', {id: this._scrollbar_hide_id})
  },
  destroyed() {
    // Scrollbar unhiding implemented in ~/layouts/default.vue
    // ID is so we can handle muliple components lifecycles
    this.$bus.$emit('scrollbar-hide', {id: this._scrollbar_hide_id, release: true})
  }
}
</script>
