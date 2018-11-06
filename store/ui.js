// State of user interface activity

export const state = () => ({
  user_active: false,
  music_player_show: false
})

export const mutations = {
  user_active ( state, active ) {
    state.user_active = active
  },
  music_player_show ( state, music_player_show ) {
    state.music_player_show = music_player_show
  }
}
