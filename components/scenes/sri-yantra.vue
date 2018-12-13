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
      innerGeometry: new Three.Geometry(),
      wireMaterial: new Three.LineBasicMaterial({color: 'white'}),
      testMaterial: new Three.MeshBasicMaterial({color: "red"}),
      innerMaterials: [
        new Three.MeshBasicMaterial({color: "#ffffff"}), //0 - bindu
        new Three.MeshBasicMaterial({color: "#fb0203"}), //1 - innermost triangle
        new Three.MeshBasicMaterial({color: "#fff000"}), //2 - surrounding quadralaterals
        new Three.MeshBasicMaterial({color: "#f84302"}), //3 - triangles
        new Three.MeshBasicMaterial({color: "#00fff1"}), //4 
        new Three.MeshBasicMaterial({color: "#fa0378"}), //5 - triangles
        new Three.MeshBasicMaterial({color: "#01f37a"}), //6
        new Three.MeshBasicMaterial({color: "#fe0000"}), //7 - triangles
        new Three.MeshBasicMaterial({color: "#ba05d0"}), //8
        new Three.MeshBasicMaterial({color: "#246d01"}), //9 - triangles        
      ],
      center: new Three.Vector3()
    }
  },
  created() {
    /// Create wire mesh from triangles:
    this.createInnerGeometry()
    let wires = new Three.LineSegments(new Three.EdgesGeometry(this.wireGeometry), this.wireMaterial)
    let mesh = new Three.Mesh(this.innerGeometry, this.innerMaterials)
    this.scene.add(mesh)
    this.scene.add(wires)
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
    createInnerGeometry() {
      const addWireTriangle = (p1, p2, p3) => {
        let index = this.wireGeometry.vertices.length
        this.wireGeometry.vertices.push(p1, p2, p3)
        this.wireGeometry.faces.push(new Three.Face3(index, index+1, index+2))
      }
      const addMeshTriangle = (p1, p2, p3, level) => {
        let normal = new Three.Vector3(0, 0, -1)
        let index = this.innerGeometry.vertices.length
        this.innerGeometry.vertices.push(p1, p2, p3)
        this.innerGeometry.faces.push(new Three.Face3(
          index, index+1, index+2, normal, this.innerMaterials[level].color, level))
        //TODO: might not need uv map?
        //this.innerGeometry.faceVertexUvs[0].push([new Three.Vector2(),new Three.Vector2(),new Three.Vector2()])
      }
      
      let dodecagon = new Three.CircleGeometry(this.innerRadius, 12).translate(this.center.x, this.center.y, 0)
      
      /// First big triangle pointing up
      let t1Point = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[12],
                                                    dodecagon.vertices[8], dodecagon.vertices[1])
      let t1Base = this.$geometry.lineCircleIntersection(t1Point, t1Point.clone().setX(t1Point.x+1), this.innerRadius, this.center)
      let t1 = [t1Base[0], t1Base[1], dodecagon.vertices[4]]
      
      /// Second big triangle pointing down
      let t2Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                                    dodecagon.vertices[8], dodecagon.vertices[5])
      let t2Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[1],
                                                    dodecagon.vertices[12], dodecagon.vertices[3])
      let t2Side1 = this.$geometry.lineCircleIntersection(t2Temp1, dodecagon.vertices[10], this.innerRadius, this.center)
      let t2Side2 = this.$geometry.lineCircleIntersection(t2Temp2, dodecagon.vertices[10], this.innerRadius, this.center)
      let t2 = [t2Side1[1], t2Side2[1], dodecagon.vertices[10]]
      
      //Find all intersections between first and second triangles
      let t1t2 = [
        this.$geometry.lineIntersection(t1[0], t1[2], t2[0], dodecagon.vertices[10]),
        this.$geometry.lineIntersection(t2[0], t2[1], t1[0], dodecagon.vertices[4]),
        this.$geometry.lineIntersection(t2Side1[0], t2[0], t1[0], t1[1]),
        this.$geometry.lineIntersection(t1[1], t1[2], t2[1], dodecagon.vertices[10]),
        this.$geometry.lineIntersection(t1[1], t1[2], t2[1], t2[0]),
        this.$geometry.lineIntersection(t1[0], t1[1], t2[1], dodecagon.vertices[10]),
      ]
      
      /// Begin third triangle pointing up, but finish later..
      let t3Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[12], dodecagon.vertices[5],
                                                    dodecagon.vertices[6], dodecagon.vertices[4])
      let t3Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[8], dodecagon.vertices[3],
                                                    dodecagon.vertices[2], dodecagon.vertices[4])
      let t3Point1 = new Three.Vector3(0, t3Temp1.y, 0)
      let t3Temp3 = t1t2[2] //t3Point2 will extend from t3Point1 through this point
      let t3Temp4 = t1t2[5] //t3Point3 will extend from t3Point1 through this point
      
      /// Begin fourth triangle pointing down, but finish later..
      let t4Temp1 = this.$geometry.lineIntersection(dodecagon.vertices[7], dodecagon.vertices[10],
                                                    dodecagon.vertices[9], dodecagon.vertices[1])
      let t4Temp2 = this.$geometry.lineIntersection(dodecagon.vertices[1], dodecagon.vertices[10],
                                                    dodecagon.vertices[7], dodecagon.vertices[11])
      let t4Point1 = new Three.Vector3(0, t4Temp1.y, 0)
      let t4Temp3 = t1t2[1] //t4Point2 extends through this
      let t4Temp4 = t1t2[4] //t4Point3 extends through this
      
      let t4t1 = [
        this.$geometry.lineIntersection(t4Temp3, t4Point1, t1[0], t1[1]),
        this.$geometry.lineIntersection(t4Temp4, t4Point1, t1[0], t1[1])
      ]
      let t3t4 = [
        this.$geometry.lineIntersection(t3Point1, t3Temp3, t4Point1, t4Temp3),
        this.$geometry.lineIntersection(t3Point1, t3Temp4, t4Point1, t4Temp4),
        //There's four more that we don't need..
      ]
      
      /// Fifth triangle pointing up
      let t5Point1 = new Three.Vector3(0, t1t2[1].y, 0)
      let t5 = [
        t5Point1,
        this.$geometry.lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1[0]),
        this.$geometry.lineIntersection(t4Temp1, t4Temp2, t5Point1, t4t1[1])
      ]
      
      let t5t2 = [
        this.$geometry.lineIntersection(t5[0], t4t1[0], t2Side1[0], t2[0]),
        this.$geometry.lineIntersection(t5[0], t4t1[1], t2Side2[0], t2[1]),
        this.$geometry.lineIntersection(t5[1], t5[2], t2Side1[0], t2[0]),
        this.$geometry.lineIntersection(t5[1], t5[2], t2Side2[0], t2[1]),
      ]
      
      /// Now complete triangle 3:
      let t3 = [
        t3Point1,
        this.$geometry.lineIntersection(t3Point1, t3Temp3, t5t2[0], t5t2[1]),
        this.$geometry.lineIntersection(t3Point1, t3Temp4, t5t2[0], t5t2[1])
      ]
      
      let t3t2 = [
        this.$geometry.lineIntersection(t3[1], t3[0], t2[0], t2[1]),
        this.$geometry.lineIntersection(t3[2], t3[0], t2[0], t2[1])
      ]
      
      /// Sixth triangle pointing down
      let t6Temp1 = this.$geometry.midpoint(t3t4[0], t4t1[0])
      let t6Point1 = new Three.Vector3(0, t6Temp1.y, 0)
      let t6 = [
        t6Point1,
        this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2[0]),
        this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t3t2[1])
      ]
      
      let t6t1 = [
        this.$geometry.lineIntersection(t6[0], t6[1], t1[0], t1[2]),
        this.$geometry.lineIntersection(t6[0], t6[2], t1[1], t1[2])
      ]
      
      /// Now complete triangle 4:
      let t4 = [
        t4Point1,
        this.$geometry.lineIntersection(t6t1[0], t6t1[1], t4Point1, t4Temp3),
        this.$geometry.lineIntersection(t6t1[0], t6t1[1], t4Point1, t4Temp4)
      ]
      
      /// Seventh triangle pointing up
      let t7 = [
        new Three.Vector3(0, t4[1].y, 0),
        this.$geometry.midpoint(t3t4[0], t4t1[0]),
        this.$geometry.midpoint(t3t4[1], t4t1[1])
      ]
      
      /// Eighth triangle pointing down
      let t8Temp1 = this.$geometry.lineIntersection(t6[0], t6[1], t7[0], t7[1])
      let t8Temp2 = this.$geometry.lineIntersection(t6[0], t6[2], t7[0], t7[2])
      let t8 = [
        new Three.Vector3(0, t3[1].y, 0),
        this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3[0], t3[1]),
        this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3[0], t3[2])
      ]
      
      /// Ninth triangle pointing down
      let t9Temp1 = this.$geometry.lineIntersection(t6[0], t6[1], t5[0], t5[1])
      let t9Temp2 = this.$geometry.lineIntersection(t6[0], t6[2], t5[0], t5[2])
      let t9 = [
        new Three.Vector3(0, t1[0].y, 0),
        this.$geometry.lineIntersection(t7[0], t7[1], t9Temp1, t9Temp2),
        this.$geometry.lineIntersection(t7[0], t7[2], t9Temp1, t9Temp2)
      ]

      let triangles = [t1, t2, t3, t4, t5, t6, t7, t8, t9]
      for(let t=0; t < triangles.length; t++) {
        addWireTriangle(...triangles[t])
      }

      /// Add bounding circle
      let circle = new Three.CircleGeometry(this.innerRadius, 128).translate(this.center.x, this.center.y, 0)
      this.wireGeometry.merge(circle)
      
      ///// Done with wire mesh
      ///// Start making full mesh
      let allpoints = [t1Point, t1[0], t1[1], t1[2], t2Side1[0], t2[0], t2[1],
                       t1t2[0],t1t2[1],t1t2[2],t1t2[3],t1t2[4], t1t2[5],
                       t3[0], t3[1], t3[2], t3Temp3, t3Temp4, t4[0], t4Temp3, t4Temp4, t4t1[0], t4t1[1],
                       t3t4[0], t3t4[1],
                       t5[0], t5[1], t5[2], t5t2[0], t5t2[1], t5t2[2], t5t2[3],
                       t3t2[0], t3t2[1],
                       t6[0], t6[1], t6[2], t6t1[0], t6t1[1],
                       t4[1], t4[2],
                       t7[0], t7[1], t7[2],
                       t8[0], t8[1], t8[2],
                       t9[0], t9[1], t9[2],
                      ]
      this.marker(allpoints)

      /// Add innermost triangle (material index 1)
      addMeshTriangle(t6[0],t9Temp2,t9Temp1, 1)

      /// Add second layer of 9 triangles (material index 3)
      //this.marker([t5[0], t8Temp1])
    }
  }
}
</script>
