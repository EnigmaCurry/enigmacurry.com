<template>
  <div>
    <g-penrose-kite :origin="{x:-1}" :rotation="{z: 0.5*Math.PI}"/>
    <g-penrose-kite :origin="{x:-1}" :rotation="{z: 0.5*Math.PI + (72*(Math.PI/180))}"/>
    <g-penrose-kite :origin="{x:-1}" :rotation="{z: 0.5*Math.PI + (144*(Math.PI/180))}"/>
    <g-penrose-kite :origin="{x:-1}" :rotation="{z: 0.5*Math.PI + (216*(Math.PI/180))}"/>
    <g-penrose-kite :origin="{x:-1}" :rotation="{z: 0.5*Math.PI + (288*(Math.PI/180))}"/>
  </div>
</template>
