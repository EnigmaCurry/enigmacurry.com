<template>
</template>

<script>
import uuid from 'uuid/v1'

export default {
  mounted() {
    this._music_player_hide_id = uuid()
    // music hiding is implemented in ~/components/MusicPlayer.vue
    // ID is so we can handle muliple components lifecycles
    this.$bus.$emit('music-hide', {id: this._music_player_hide_id, lock: true})
  },
  destroyed() {
    // music hiding is implemented in ~/components/MusicPlayer.vue
    // ID is so we can handle muliple components lifecycles
    this.$bus.$emit('music-hide', {id: this._music_player_hide_id, release: true, unlock: true})
  }
}
</script>
