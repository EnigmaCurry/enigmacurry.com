<script>
import { mapState } from 'vuex'
import EventListener from '~/components/EventListener.vue'
import _ from 'lodash'

export default {
  computed: {
    ...mapState({
      user_active: state => state.ui.user_active      
    })
  },
  methods: {
    updateUserActive() {
      let activityTimeout = this.$props.activityTimeout || 10
      clearTimeout(this.activityTimer)
      if (activityTimeout > 0) {
        this.activityTimer = setTimeout(() => {
          this.$store.commit('ui/user_active', false)
        }, this.$props.activityTimeout * 1000)
      }
      if (!this.user_active) {
        this.$store.commit('ui/user_active', true)
      }
    },
  },
  created() {
    // Send our own bus event on window scroll
    this._updateUserScrolling = _.debounce(() => {
      this.$bus.$emit('user-scroll')
    })
    // Set the user active anytime the mouse moves or screen is touched:
    this.addEventListener(document, 'mousemove', this.updateUserActive)
    this.addEventListener(document, 'touchstart', this.updateUserActive)
    this.addEventListener(window, 'scroll', this.updateUserActive)
    this.addEventListener(window, 'scroll', this._updateUserScrolling)
    // Initially set the user as active:
    this.updateUserActive()
  }
}
</script>
