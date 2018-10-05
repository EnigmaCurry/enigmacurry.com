<template>
<cube-scene/>
</template>

<script>
import GridScene from '~/components/GridScene.vue'
import CubeScene from '~/components/CubeScene.vue'

export default {
  components: {
    GridScene,
    CubeScene
  }
}
</script>

<style>
body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    background-color: #000;
}
::-webkit-scrollbar { 
    display: none; 
}
</style>
