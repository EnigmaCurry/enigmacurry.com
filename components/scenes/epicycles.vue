<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="false" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="4"/>

      <g-grid :divisions="10"/>

     <g-group name="earth" :position="earthPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[0.05, 64]" />
          <material type="MeshBasic" :options="{color: 'blue'}" />
        </g-mesh>
      </g-group>

      <g-group name="sun" :position="sunPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[0.1, 64]" />
          <material type="MeshBasic" :options="{color: 'yellow'}" />
        </g-mesh>
      </g-group>

     <g-group name="venus" :position="venusPosition">
        <g-mesh>
          <g-geometry type="Circle" :args="[0.05, 64]" />
          <material type="MeshBasic" :options="{color: 'green'}" />
        </g-mesh>
      </g-group>


      <animation :fn="animate" :speed="0.1"/>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export default {
  props: {
    animated: {type: Boolean, default: true}
  },
  data() {
    let earth = (time) => {return {x:0, y:0}}
    let sun = this.$geometry.epicycle(2, 1, earth)
    let venus = this.$geometry.epicycle(1.5, 8/13, sun)
    
    return {
      earth, earthPosition: new Three.Vector3(),
      sun, sunPosition: new Three.Vector3(),
      venus, venusPosition: new Three.Vector3()
    }
  },
  methods: {
    animate(tt) {
      let sun = this.sun(tt)
      let venus = this.venus(tt)
      this.sunPosition.x = sun.x
      this.sunPosition.y = sun.y
      this.venusPosition.x = venus.x
      this.venusPosition.y = venus.y
    }
  }
}
</script>
