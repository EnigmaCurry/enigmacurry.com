<template>
  <g-group :position="{y: -2}">
    <g-penrose-dart/>
    <g-penrose-dart :rotation="{z: Math.PI}"/>
  </g-group>
</template>

<script>

export default {
  data() {
    let dartDimensions = this.$geometry.penrose.dartDimensions()
    let kiteDimensions = this.$geometry.penrose.kiteDimensions()
    return {
      dartDimensions,
      kiteDimensions
    }
  },
  methods: {
  }
}
</script>
