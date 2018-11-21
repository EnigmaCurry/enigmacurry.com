<template>
  <g-renderer :to-canvas-id="canvasId" :canvas-size="canvasSize" :animated="animated" class="renderer" ref="renderer" :transparent="true" :clearAlpha="0" :antialias="true">
    <scene>
      <g-camera orthographic :zoomScale="1"/>

      <!-- <g-grid :divisions="10"/> -->
      <g-group :rotation="sceneRotation" :scale="scale">
        <g-penrose-mesh tileType="p2" :iterations="pentagramIterations" :wireframe="wireframe" :initialTriangles="pentagramTriangles"/>
        <g-penrose-mesh tileType="p3" :iterations="pentagonIterations" :wireframe="wireframe" :initialTriangles="pentagonTriangles"/>
      </g-group>
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as math from 'mathjs'

export default {
  props: {
    wireframe: {type: Boolean, default: false},
    animated: {type: Boolean, default: true},
    scaleInterval: {type: Number, default: 30},
    canvasId: {type: String},
    canvasSize: {type: Object, default: () => {return {width: 512, height: 512}}}
  },
  data() {
    return {
      pentagramIterations: 5,
      pentagonIterations: 8,
      scale: 1,
      sceneRotation: new Three.Vector3()
    }
  },
  created() {
    //Consider a pentagon with sides of length 1
    let side = 1
    //Find the radius of the circle circumscribing it:
    let radius = 1 / (2 * Math.sin((180/5) * (Math.PI/180)))
    
    //Calculate 5 points around the pentagon:
    let pentagon = []
    let angle = 90
    for(let p=0; p < 5; p++) {
      let x = radius * Math.cos(angle * (Math.PI/180))
      let y = radius * Math.sin(angle * (Math.PI/180))
      pentagon.push(math.complex(x, y))
      angle += 72
    }
    
    //Side length of petagram inside pentagon is the golden ratio to the side:
    let phi = math.distance(pentagon[0].toVector(), pentagon[2].toVector())
    //Consider a smaller pentagon inside the pentagram
    //This pentagon has sides of (phi - 1/phi - 1/phi)
    let sideInner = phi - (1/phi) - (1/phi)
    //Find the radius of the circle circumscribing the inner pentagon:
    let radiusInner = sideInner / (2 * Math.sin((180/5) * (Math.PI/180)))
    //Calculate 5 points around the inner pentagon:
    let pentagonInner = []
    angle = -90
    for(let p=0; p < 5; p++) {
      let x = radiusInner * Math.cos(angle * (Math.PI/180))
      let y = radiusInner * Math.sin(angle * (Math.PI/180))
      pentagonInner.push(math.complex(x, y))
      angle += 72
    }
    
    this.pentagonTriangles = [
      //Construct pentagon as 5 golden gnomons around the outside
      ['gnomon', pentagonInner[3], pentagon[0], pentagon[1]],
      ['gnomon', pentagonInner[4], pentagon[1], pentagon[2]],
      ['gnomon', pentagonInner[0], pentagon[2], pentagon[3]],
      ['gnomon', pentagonInner[1], pentagon[3], pentagon[4]],
      ['gnomon', pentagonInner[2], pentagon[4], pentagon[0]],
      
    ]
    this.pentagramTriangles = [
      //Construct pentagram as 5 golden triangles around
      ['golden', pentagon[0], pentagonInner[2], pentagonInner[3]],
      ['golden', pentagon[1], pentagonInner[4], pentagonInner[3]],
      ['golden', pentagon[2], pentagonInner[4], pentagonInner[0]],
      ['golden', pentagon[3], pentagonInner[0], pentagonInner[1]],
      ['golden', pentagon[4], pentagonInner[1], pentagonInner[2]],
    ]
  }
}
</script>
