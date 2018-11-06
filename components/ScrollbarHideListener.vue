<style>
.invisible-scrollbar::-webkit-scrollbar {
  display: none; 
}
</style>

<script>
export default {
  data() {
    return {
      scrollbarHideRequests: []
    }
  },
  methods: {
    handleScrollbarHide({id, release:isRelease}) {
      //Remember the id of requests, and forget them on release
      if(this.scrollbarHideRequests.indexOf(id) >= 0) {
        if(isRelease) {
          this.scrollbarHideRequests = this.scrollbarHideRequests.filter(e => e !== id)
        }
      } else {
        this.scrollbarHideRequests.push(id)
      }
      //Hide the scrollbar or unhide when all requesters release
      if(this.scrollbarHideRequests.length > 0) {
        document.body.classList.add('invisible-scrollbar')
      } else {
        document.body.classList.remove('invisible-scrollbar')
      }
    }
  },
  created() {
    this.$bus.$on('scrollbar-hide', this.handleScrollbarHide)
  },
  destroyed() {
    this.$bus.$off('scrollbar-hide', this.handleScrollbarHide)
  }
}
</script>
