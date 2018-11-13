<template>
  <div>
    <g-penrose-dart origin="bottom" :rotation="{z: Math.PI}"/>
    <g-penrose-kite origin="left" :rotation="{z: 216 * (Math.PI/180)}" />
    <g-penrose-kite origin="right" :rotation="{z: 144 * (Math.PI/180)}" />
  </div>
</template>
