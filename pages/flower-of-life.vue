<template>
<flower-of-life/>
</template>

<script>
import FlowerOfLife from '~/components/FlowerOfLife.vue'

export default {
  components: {
    FlowerOfLife
  }
}
</script>

<style>
body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    background-color: #001;
}
::-webkit-scrollbar { 
    display: none; 
}
</style>
