<template>
  <div>
    <g-penrose-dart origin="top" :rotation="{z: Math.PI}"/>
    <g-penrose-dart origin="top" :rotation="{z: Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-dart origin="top" :rotation="{z: Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-dart origin="top" :rotation="{z: Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-dart origin="top" :rotation="{z: Math.PI + (288*(Math.PI/180))}"/>
  </div>
</template>
