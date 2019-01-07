<script>
export default {
  props: {
    backgroundClass: {type: String, default: null},
    backgroundAlpha: {type: Number, default: 1}
  },
  mounted() {
    document.getElementById('bg').classList.add(this.backgroundClass)
    this.renderer.webGLRenderer.setClearAlpha(this.backgroundAlpha)
  },
  beforeDestroy() {
    document.getElementById('bg').classList.remove(this.backgroundClass)
    this.renderer.webGLRenderer.setClearAlpha(1)
  },
}
</script>
