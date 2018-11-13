<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-grid :divisions="10"/>
      <!-- <g-grid :divisions="10" gridType="polar"/> -->
      <g-camera orthographic :zoomScale=2></g-camera>
      <!-- <g-penrose-sun /> -->
      <g-penrose-star />
    </scene>
  </g-renderer>
</template>
