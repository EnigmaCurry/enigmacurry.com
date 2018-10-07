<template>
<flower-of-life/>
</template>

<script>
import GridScene from '~/components/GridScene.vue'
import CubeScene from '~/components/CubeScene.vue'
import SeedOfLife from '~/components/SeedOfLife.vue'
import FlowerOfLife from '~/components/FlowerOfLife.vue'

export default {
  components: {
    GridScene,
    CubeScene,
    SeedOfLife,
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
