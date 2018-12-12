<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :divisions="10" v-if="showGrid"/>

    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'

const lineIntersection = (line1a, line1b, line2a, line2b) => {
  return new Three.Vector3(
    ((line1a.x*line1b.y - line1a.y*line1b.x) * (line2a.x - line2b.x) -
     (line1a.x - line1b.x) * (line2a.x*line2b.y - line2a.y*line2b.x)) /
      ((line1a.x -line1b.x) * (line2a.y - line2b.y) -
       (line1a.y - line1b.y) * (line2a.x - line2b.x)),
    ((line1a.x*line1b.y - line1a.y*line1b.x) * (line2a.y - line2b.y) -
     (line1a.y - line1b.y) * (line2a.x*line2b.y - line2a.y*line2b.x)) /
      ((line1a.x - line1b.x) * (line2a.y - line2b.y) -
       (line1a.y - line1b.y) * (line2a.x - line2b.x))
    , 0)
}

const lineCircleIntersection = (p1, p2, radius, center={x:0, y:0}) => {
  // http://mathworld.wolfram.com/Circle-LineIntersection.html
  // p1 and p2 are points on an infinite line
  // radius and center describe the size and position of a circle
  p1 = p1.clone().sub(center)
  p2 = p2.clone().sub(center)
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  const D = p1.x*p2.y - p2.x*p1.y
  const sgn = (x) => {return x < 0 ? -1 : 1}
  const discriminant = Math.pow(radius, 2) * Math.pow(dr, 2) - Math.pow(D, 2)
  let intersections
  if (discriminant === 0) {
    // Line is tangent at one point
    intersections = [
      new Three.Vector3(D * dy / Math.pow(dr, 2),
                        -D * dx / Math.pow(dr, 2),
                        0).add(center) ]
  } else if (discriminant > 0) {
    // Line intersects at two points
    intersections = [
      new Three.Vector3(
        (D * dy - sgn(dy) * dx * Math.sqrt(discriminant)) / Math.pow(dr, 2),
        (-D * dx - Math.abs(dy) * Math.sqrt(discriminant)) / Math.pow(dr, 2),
        0).add(center),
      new Three.Vector3(
        (D * dy + sgn(dy) * dx * Math.sqrt(discriminant)) / Math.pow(dr, 2),
        (-D * dx + Math.abs(dy) * Math.sqrt(discriminant)) / Math.pow(dr, 2),
        0).add(center)
    ]
  } else {
    // Line does not intersect
    intersections = []
  }
  return intersections
}

const midpoint = (p1, p2) => {
  return new Three.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
}

export default {
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 1.2}
  },
  data() {
    return {
      scene: new Three.Scene()
    }
  },
  created() {
    const testMaterial = new Three.MeshBasicMaterial({color: "red"})
    const wireMaterial = new Three.LineBasicMaterial({color: 'white'})
    const marker = (vectors, radius=0.01, material=testMaterial) => {
      if(vectors.isVector2 || vectors.isVector3) {
        vectors = [ vectors ]
      }
      for(let v=0; v < vectors.length; v++) {
        console.log(vectors[v])
        this.scene.add(new Three.Mesh(
          new Three.CircleGeometry(radius, 32).translate(vectors[v].x, vectors[v].y, 0), material)
        )
      }
    }
    const makeTriangle = (p1, p2, p3, material=wireMaterial) => {
      let g = new Three.Geometry()
      g.vertices.push(p1, p2, p3)
      g.faces.push(new Three.Face3(0, 1, 2))
      return new Three.LineSegments(new Three.EdgesGeometry(g), material)
    }
    
    let radius = 1
    let center = new Three.Vector3()
    let circle = new Three.LineSegments(
      new Three.EdgesGeometry(new Three.CircleGeometry(radius, 128).translate(center.x, center.y, 0)),
      wireMaterial)
    this.scene.add(circle)
    
    let dodecagon = new Three.CircleGeometry(radius, 12).translate(center.x, center.y, 0)
    //this.scene.add(dodecagon)
    
    /// First big triangle pointing up
    let t1Point = lineIntersection(dodecagon.vertices[7], dodecagon.vertices[12],
                                   dodecagon.vertices[8], dodecagon.vertices[1])
    let t1Base = lineCircleIntersection(t1Point, t1Point.clone().setX(t1Point.x+1), radius, center)
    let t1 = makeTriangle(
      t1Base[0],
      t1Base[1],
      dodecagon.vertices[4]
    )
    this.scene.add(t1)
    
    /// Second big triangle pointing down
    let t2Temp1 = lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                   dodecagon.vertices[8], dodecagon.vertices[5])
    let t2Temp2 = lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                   dodecagon.vertices[12], dodecagon.vertices[3])
    let t2Side1 = lineCircleIntersection(t2Temp1, dodecagon.vertices[10], radius, center)
    let t2Side2 = lineCircleIntersection(t2Temp2, dodecagon.vertices[10], radius, center)
    let t2 = makeTriangle(
      t2Side1[1],
      t2Side2[1],
      dodecagon.vertices[10]
    )
    this.scene.add(t2)
    
    //Find all intersections between first and second triangles
    let t1t2Intersect = [
      lineIntersection(t1Base[0], dodecagon.vertices[4], t2Side1[1], dodecagon.vertices[10]),
      lineIntersection(t2Side1[1], t2Side2[1], t1Base[0], dodecagon.vertices[4]),
      lineIntersection(t2Side1[0], t2Side1[1], t1Base[0], t1Base[1]),
      lineIntersection(t1Base[1], dodecagon.vertices[4], t2Side2[1], dodecagon.vertices[10]),
      lineIntersection(t1Base[1], dodecagon.vertices[4], t2Side2[1], t2Side1[1]),
      lineIntersection(t1Base[0], t1Base[1], t2Side2[1], dodecagon.vertices[10]),
    ]
    
    /// Begin third triangle pointing up, but finish later..
    let t3Temp1 = lineIntersection(dodecagon.vertices[12], dodecagon.vertices[5],
                                   dodecagon.vertices[6], dodecagon.vertices[4])
    let t3Temp2 = lineIntersection(dodecagon.vertices[8], dodecagon.vertices[3],
                                   dodecagon.vertices[2], dodecagon.vertices[4])
    let t3Point1 = new Three.Vector3(0, t3Temp1.y, 0)
    let t3Temp3 = t1t2Intersect[2] //t3Point2 will extend from t3Point1 through this point
    let t3Temp4 = t1t2Intersect[5] //t3Point3 will extend from t3Point1 through this point
    
    /// Begin fourth triangle pointing down, but finish later..
    let t4Temp1 = lineIntersection(dodecagon.vertices[7], dodecagon.vertices[10],
                                   dodecagon.vertices[9], dodecagon.vertices[1])
    let t4Temp2 = lineIntersection(dodecagon.vertices[1], dodecagon.vertices[10],
                                   dodecagon.vertices[7], dodecagon.vertices[11])
    let t4Point1 = new Three.Vector3(0, t4Temp1.y, 0)
    let t4Temp3 = t1t2Intersect[1] //t4Point2 extends through this
    let t4Temp4 = t1t2Intersect[4] //t4Point3 extends through this
    
    let t4t1Intersect = [
      lineIntersection(t4Temp3, t4Point1, t1Base[0], t1Base[1]),
      lineIntersection(t4Temp4, t4Point1, t1Base[0], t1Base[1])
    ]
    let t3t4Intersect = [
      lineIntersection(t3Point1, t3Temp3, t4Point1, t4Temp3),
      lineIntersection(t3Point1, t3Temp4, t4Point1, t4Temp4),
      //And four more to add in later steps....
    ]
    
    /// Fifth triangle pointing up
    let t5Point1 = new Three.Vector3(0, t1t2Intersect[1].y, 0)
    let t5Point2 = lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1Intersect[0])
    let t5Point3 = lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1Intersect[1])
    let t5 = makeTriangle(t5Point1, t5Point2, t5Point3)
    this.scene.add(t5)
    
    let t5t2Intersect = [
      lineIntersection(t5Point1, t4t1Intersect[0], t2Side1[0], t2Side1[1]),
      lineIntersection(t5Point1, t4t1Intersect[1], t2Side2[0], t2Side2[1]),
      lineIntersection(t5Point2, t5Point3, t2Side1[0], t2Side1[1]),
      lineIntersection(t5Point2, t5Point3, t2Side2[0], t2Side2[1]),
    ]
    
    /// Now complete triangle 3:
    let t3Point2 = lineIntersection(t3Point1, t3Temp3, t5t2Intersect[0], t5t2Intersect[1])
    let t3Point3 = lineIntersection(t3Point1, t3Temp4, t5t2Intersect[0], t5t2Intersect[1])
    let t3 = makeTriangle(t3Point1, t3Point2, t3Point3)
    this.scene.add(t3)
    
    let t3t2Intersect = [
      lineIntersection(t3Point2, t3Point1, t2Side1[1], t2Side2[1]),
      lineIntersection(t3Point3, t3Point1, t2Side1[1], t2Side2[1])
    ]
    
    /// Sixth triangle pointing down
    let t6Temp1 = midpoint(t3t4Intersect[0], t4t1Intersect[0])
    let t6Point1 = new Three.Vector3(0, t6Temp1.y, 0)
    let t6Point2 = lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2Intersect[0])
    let t6Point3 = lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2Intersect[1])
    let t6 = makeTriangle(t6Point1, t6Point2, t6Point3)
    this.scene.add(t6)
    
    let t6t1Intersect = [
      lineIntersection(t6Point1, t6Point2, t1Base[0], dodecagon.vertices[4]),
      lineIntersection(t6Point1, t6Point3, t1Base[1], dodecagon.vertices[4])
    ]
    
    /// Now complete triangle 4:
    let t4Point2 = lineIntersection(t6t1Intersect[0], t6t1Intersect[1], t4Point1, t4Temp3)
    let t4Point3 = lineIntersection(t6t1Intersect[0], t6t1Intersect[1], t4Point1, t4Temp4)
    let t4 = makeTriangle(t4Point1, t4Point2, t4Point3)
    this.scene.add(t4)
    
    /// Seventh triangle pointing up
    let t7Point1 = new Three.Vector3(0, t4Point2.y, 0)
    let t7Point2 = midpoint(t3t4Intersect[0], t4t1Intersect[0])
    let t7Point3 = midpoint(t3t4Intersect[1], t4t1Intersect[1])
    let t7 = makeTriangle(t7Point1, t7Point2, t7Point3)
    this.scene.add(t7)
    
    /// Eighth triangle pointing down
    let t8Temp1 = lineIntersection(t6Point1, t6Point2, t7Point1, t7Point2)
    let t8Temp2 = lineIntersection(t6Point1, t6Point3, t7Point1, t7Point3)
    let t8Point1 = new Three.Vector3(0, t3Point2.y, 0)
    let t8Point2 = lineIntersection(t8Temp1, t8Temp2, t3Point1, t3Point2)
    let t8Point3 = lineIntersection(t8Temp1, t8Temp2, t3Point1, t3Point3)
    let t8 = makeTriangle(t8Point1, t8Point2, t8Point3)
    this.scene.add(t8)
    
    /// Ninth triangle pointing down
    let t9Temp1 = lineIntersection(t6Point1, t6Point2, t5Point1, t5Point2)
    let t9Temp2 = lineIntersection(t6Point1, t6Point3, t5Point1, t5Point3)
    let t9Point1 = new Three.Vector3(0, t1Base[0].y, 0)
    let t9Point2 = lineIntersection(t7Point1, t7Point2, t9Temp1, t9Temp2)
    let t9Point3 = lineIntersection(t7Point1, t7Point3, t9Temp1, t9Temp2)
    let t9 = makeTriangle(t9Point1, t9Point2, t9Point3)
    this.scene.add(t9)

    /// Add the bindu
    marker(center, 0.01, wireMaterial)
  }
}
</script>
