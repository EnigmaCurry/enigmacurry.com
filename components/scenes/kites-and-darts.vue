<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale=2></g-camera>
      <g-penrose-kite />
    </scene>
  </g-renderer>
</template>
