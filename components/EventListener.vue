<script>
export default {
  data() {
    return {
      event_listeners: []
    }
  },
  methods: {
    addEventListener(el, event, callback) {
      //Add event listener, and also remembers to remove listener on destroy
      el.addEventListener(event, callback)
      this.event_listeners.push([el, event, callback])
    }
  },
  destroyed() {
    //Remove all event listeners registered through this.addEventListener
    this.event_listeners.forEach(([el, event, callback]) => {
      console.log("Removing event listener: ", el, event, callback)
      el.removeEventListener(event, callback)
    })
  }
}
</script>
