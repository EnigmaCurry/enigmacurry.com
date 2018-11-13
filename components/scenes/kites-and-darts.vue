<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-light :hex="0xffffff" :intensity="1" :position="{ z: 10 }"/>

      <g-grid :divisions="10"/>
      <!-- <g-grid :divisions="10" gridType="polar"/> -->
      <g-camera orthographic :zoomScale=2></g-camera>
      <!-- <g-penrose-sun /> -->
      <!-- <g-penrose-star /> -->
      <g-penrose-ace />
    </scene>
  </g-renderer>
</template>
