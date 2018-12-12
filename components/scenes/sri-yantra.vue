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

export default {
  props: {
    animated: {type: Boolean, default: false},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 1.2},
    innerRadius: {type: Number, default: 1}
  },
  data() {
    return {
      scene: new Three.Scene(),
      wireGeometry: new Three.Geometry(),
      wireMaterial: new Three.LineBasicMaterial({color: 'white'}),
      testMaterial: new Three.MeshBasicMaterial({color: "red"}),
      center: new Three.Vector3()
    }
  },
  created() {    
    /// Create wire mesh from triangles:
    this.createWireGeometry()
    let wires = new Three.LineSegments(new Three.EdgesGeometry(this.wireGeometry), this.wireMaterial)
    this.scene.add(wires)
    
    /// Add the bindu
    this.marker(this.center, 0.01, this.wireMaterial)
  },
  methods: {
    marker(vectors, radius=0.01, material=this.testMaterial) {
      if(vectors.isVector2 || vectors.isVector3) {
        vectors = [ vectors ]
      }
      for(let v=0; v < vectors.length; v++) {
        this.scene.add(new Three.Mesh(
          new Three.CircleGeometry(radius, 32).translate(vectors[v].x, vectors[v].y, 0), material)
                      )
      }
    },
    addTriangle(p1, p2, p3) {
      let index = this.wireGeometry.vertices.length
      this.wireGeometry.vertices.push(p1, p2, p3)
      this.wireGeometry.faces.push(new Three.Face3(index, index+1, index+2))
    },
    createWireGeometry() {
      let dodecagon = new Three.CircleGeometry(this.innerRadius, 12).translate(this.center.x, this.center.y, 0)
      
      /// First big triangle pointing up
      let t1Point = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[12],
                                                    dodecagon.vertices[8], dodecagon.vertices[1])
      let t1Base = this.$geometry.lineCircleIntersection(t1Point, t1Point.clone().setX(t1Point.x+1), this.innerRadius, this.center)
      this.addTriangle(t1Base[0], t1Base[1], dodecagon.vertices[4])
      
      /// Second big triangle pointing down
      let t2Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                                    dodecagon.vertices[8], dodecagon.vertices[5])
      let t2Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                                    dodecagon.vertices[12], dodecagon.vertices[3])
      let t2Side1 = this.$geometry.lineCircleIntersection(t2Temp1, dodecagon.vertices[10], this.innerRadius, this.center)
      let t2Side2 = this.$geometry.lineCircleIntersection(t2Temp2, dodecagon.vertices[10], this.innerRadius, this.center)
      this.addTriangle(t2Side1[1], t2Side2[1], dodecagon.vertices[10] )
      
      //Find all intersections between first and second triangles
      let t1t2Intersect = [
        this.$geometry.lineIntersection(t1Base[0], dodecagon.vertices[4], t2Side1[1], dodecagon.vertices[10]),
        this.$geometry.lineIntersection(t2Side1[1], t2Side2[1], t1Base[0], dodecagon.vertices[4]),
        this.$geometry.lineIntersection(t2Side1[0], t2Side1[1], t1Base[0], t1Base[1]),
        this.$geometry.lineIntersection(t1Base[1], dodecagon.vertices[4], t2Side2[1], dodecagon.vertices[10]),
        this.$geometry.lineIntersection(t1Base[1], dodecagon.vertices[4], t2Side2[1], t2Side1[1]),
        this.$geometry.lineIntersection(t1Base[0], t1Base[1], t2Side2[1], dodecagon.vertices[10]),
      ]
      
      /// Begin third triangle pointing up, but finish later..
      let t3Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[12], dodecagon.vertices[5],
                                                    dodecagon.vertices[6], dodecagon.vertices[4])
      let t3Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[8], dodecagon.vertices[3],
                                                    dodecagon.vertices[2], dodecagon.vertices[4])
      let t3Point1 = new Three.Vector3(0, t3Temp1.y, 0)
      let t3Temp3 = t1t2Intersect[2] //t3Point2 will extend from t3Point1 through this point
      let t3Temp4 = t1t2Intersect[5] //t3Point3 will extend from t3Point1 through this point
      
      /// Begin fourth triangle pointing down, but finish later..
      let t4Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[10],
                                                    dodecagon.vertices[9], dodecagon.vertices[1])
      let t4Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[1], dodecagon.vertices[10],
                                                    dodecagon.vertices[7], dodecagon.vertices[11])
      let t4Point1 = new Three.Vector3(0, t4Temp1.y, 0)
      let t4Temp3 = t1t2Intersect[1] //t4Point2 extends through this
      let t4Temp4 = t1t2Intersect[4] //t4Point3 extends through this
      
      let t4t1Intersect = [
        this.$geometry.lineIntersection(t4Temp3, t4Point1, t1Base[0], t1Base[1]),
        this.$geometry.lineIntersection(t4Temp4, t4Point1, t1Base[0], t1Base[1])
      ]
      let t3t4Intersect = [
        this.$geometry.lineIntersection(t3Point1, t3Temp3, t4Point1, t4Temp3),
        this.$geometry.lineIntersection(t3Point1, t3Temp4, t4Point1, t4Temp4),
        //There's four more that we don't need..
      ]
      
      /// Fifth triangle pointing up
      let t5Point1 = new Three.Vector3(0, t1t2Intersect[1].y, 0)
      let t5Point2 = this.$geometry.lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1Intersect[0])
      let t5Point3 = this.$geometry.lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1Intersect[1])
      this.addTriangle(t5Point1, t5Point2, t5Point3)
      
      let t5t2Intersect = [
        this.$geometry.lineIntersection(t5Point1, t4t1Intersect[0], t2Side1[0], t2Side1[1]),
        this.$geometry.lineIntersection(t5Point1, t4t1Intersect[1], t2Side2[0], t2Side2[1]),
        this.$geometry.lineIntersection(t5Point2, t5Point3, t2Side1[0], t2Side1[1]),
        this.$geometry.lineIntersection(t5Point2, t5Point3, t2Side2[0], t2Side2[1]),
      ]
      
      /// Now complete triangle 3:
      let t3Point2 = this.$geometry.lineIntersection(t3Point1, t3Temp3, t5t2Intersect[0], t5t2Intersect[1])
      let t3Point3 = this.$geometry.lineIntersection(t3Point1, t3Temp4, t5t2Intersect[0], t5t2Intersect[1])
      this.addTriangle(t3Point1, t3Point2, t3Point3)
      
      let t3t2Intersect = [
        this.$geometry.lineIntersection(t3Point2, t3Point1, t2Side1[1], t2Side2[1]),
        this.$geometry.lineIntersection(t3Point3, t3Point1, t2Side1[1], t2Side2[1])
      ]
      
      /// Sixth triangle pointing down
      let t6Temp1 = this.$geometry.midpoint(t3t4Intersect[0], t4t1Intersect[0])
      let t6Point1 = new Three.Vector3(0, t6Temp1.y, 0)
      let t6Point2 = this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2Intersect[0])
      let t6Point3 = this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2Intersect[1])
      this.addTriangle(t6Point1, t6Point2, t6Point3)
      
      let t6t1Intersect = [
        this.$geometry.lineIntersection(t6Point1, t6Point2, t1Base[0], dodecagon.vertices[4]),
        this.$geometry.lineIntersection(t6Point1, t6Point3, t1Base[1], dodecagon.vertices[4])
      ]
      
      /// Now complete triangle 4:
      let t4Point2 = this.$geometry.lineIntersection(t6t1Intersect[0], t6t1Intersect[1], t4Point1, t4Temp3)
      let t4Point3 = this.$geometry.lineIntersection(t6t1Intersect[0], t6t1Intersect[1], t4Point1, t4Temp4)
      this.addTriangle(t4Point1, t4Point2, t4Point3)
      
      /// Seventh triangle pointing up
      let t7Point1 = new Three.Vector3(0, t4Point2.y, 0)
      let t7Point2 = this.$geometry.midpoint(t3t4Intersect[0], t4t1Intersect[0])
      let t7Point3 = this.$geometry.midpoint(t3t4Intersect[1], t4t1Intersect[1])
      this.addTriangle(t7Point1, t7Point2, t7Point3)
      
      /// Eighth triangle pointing down
      let t8Temp1 = this.$geometry.lineIntersection(t6Point1, t6Point2, t7Point1, t7Point2)
      let t8Temp2 = this.$geometry.lineIntersection(t6Point1, t6Point3, t7Point1, t7Point3)
      let t8Point1 = new Three.Vector3(0, t3Point2.y, 0)
      let t8Point2 = this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3Point1, t3Point2)
      let t8Point3 = this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3Point1, t3Point3)
      this.addTriangle(t8Point1, t8Point2, t8Point3)
      
      /// Ninth triangle pointing down
      let t9Temp1 = this.$geometry.lineIntersection(t6Point1, t6Point2, t5Point1, t5Point2)
      let t9Temp2 = this.$geometry.lineIntersection(t6Point1, t6Point3, t5Point1, t5Point3)
      let t9Point1 = new Three.Vector3(0, t1Base[0].y, 0)
      let t9Point2 = this.$geometry.lineIntersection(t7Point1, t7Point2, t9Temp1, t9Temp2)
      let t9Point3 = this.$geometry.lineIntersection(t7Point1, t7Point3, t9Temp1, t9Temp2)
      this.addTriangle(t9Point1, t9Point2, t9Point3)
      
      /// Add bounding circle
      let circle = new Three.CircleGeometry(this.innerRadius, 128).translate(this.center.x, this.center.y, 0)
      this.wireGeometry.merge(circle)
    }
  }
}
</script>
