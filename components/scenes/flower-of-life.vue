<template>
  <g-renderer class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale=15></g-camera>

      <g-flower />
       
    </scene>
  </g-renderer>
</template>
