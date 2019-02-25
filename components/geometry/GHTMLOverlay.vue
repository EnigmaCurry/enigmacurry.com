<template>
  <div class="overlay">
    <slot></slot>
  </div>
</template>

<style scoped>
div.overlay {
  padding-top: 84px;
  padding-left: 2em;
  position: fixed;
  top: 0;
  left: 0;
  right:0;
  bottom:0;
  background: #fff;
  z-index: 10000;
}
</style>
