<template>
  <div>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-kite origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </div>
</template>
