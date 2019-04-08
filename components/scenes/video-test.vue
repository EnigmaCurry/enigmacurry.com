<template>
  <div>
    <video autoplay muted loop height="100%" width="100%" ref="video" >
    <source src="https://spee.ch/three-cubs-and-mom-eating-apples/d.mp4" type="video/mp4">
    Your browser does not support video
  </video>
  </div>
</template>

<script>
export default {
  mounted() {
    let video = this.$refs.video
  }
}
</script>
