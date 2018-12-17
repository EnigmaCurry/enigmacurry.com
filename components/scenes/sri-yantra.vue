<template>
  <g-renderer :animated="animated" class="renderer" ref="renderer" :transparent="true" :antialias="true">
    <scene :obj="scene">
      <g-camera orthographic :zoomScale="zoom"/>

      <g-grid :divisions="10" v-if="showGrid"/>
      <animation :fn="animate" />
    </scene>
  </g-renderer>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import ColorScheme from 'color-scheme'
import {shuffle} from 'underscore'
import Visibility from 'visibilityjs'

export default {
  props: {
    animated: {type: Boolean, default: true},
    backgroundClass: {type: String, default: "pare4Dolia-pair-of-four-dull-olyas"},
    showGrid: {type: Boolean, default: false},
    showWires: {type: Boolean, default: true},
    zoom: {type: Number, default: 2},
    innerRadius: {type: Number, default: 1},
    colorInterval: {type: Number, default: 15},
  },
  data() {
    return {
      scene: new Three.Scene(),
      wireGeometry: new Three.Geometry(),
      foregroundMeshes: [],
      backgroundMeshes: [],
      wireMaterial: new Three.LineBasicMaterial({color: 'white', linewidth: 5}),
      testMaterial: new Three.MeshBasicMaterial({color: "red"}),
      foregroundMaterials: [
        new Three.MeshBasicMaterial({color: "#fb0203"}), //0 - innermost triangle
        new Three.MeshBasicMaterial({color: "#f84302"}), //1 - triangles
        new Three.MeshBasicMaterial({color: "#fa0378"}), //2 - triangles
        new Three.MeshBasicMaterial({color: "#fe0000"}), //3 - triangles
        new Three.MeshBasicMaterial({color: "#246d01"}), //4 - triangles
        new Three.MeshBasicMaterial({color: "#f91c53"}), //5 - petals 1
        new Three.MeshBasicMaterial({color: "#fd615c"}), //6 - petals 2
      ],
      backgroundMaterials: [
        new Three.MeshBasicMaterial({color: "#fff000"}), //0 - outside innermost triangle
        new Three.MeshBasicMaterial({color: "#00feef"}), //1 - outside triangles
        new Three.MeshBasicMaterial({color: "#01f37a"}), //2 - outside triangles
        new Three.MeshBasicMaterial({color: "#ba05d0"}), //3 - outside triangles
        new Three.MeshBasicMaterial({color: "#f1d006"}), //4 - inside circle
        new Three.MeshBasicMaterial({color: "#f6f49d"}), //5 - inside petals
        new Three.MeshBasicMaterial({color: "#ababab"}), //6 - inside gateway
        new Three.MeshBasicMaterial({color: "#fefdfd"}), //7 - gateway threshold
        new Three.MeshBasicMaterial({color: "#37f0f8"}), //7 - innermost gateway
        new Three.MeshBasicMaterial({color: "#fefdfd"}), //8 - intergateway
        new Three.MeshBasicMaterial({color: "#46f87e"}), //9 - second gateway
        new Three.MeshBasicMaterial({color: "#fefdfd"}), //10 - intergateway
        new Three.MeshBasicMaterial({color: "#ababab"}), //11 - third gateway
      ],
      center: new Three.Vector3(),
      tweenGroup: new TWEEN.Group()
    }
  },
  created() {
    /// Create wire mesh from triangles:
    this.createGeometry()
    let wires = new Three.LineSegments(new Three.EdgesGeometry(this.wireGeometry), this.wireMaterial)
    for(let fg=0; fg < this.foregroundMeshes.length; fg++) {
      this.foregroundMeshes[fg].renderOrder = 2
      this.scene.add(this.foregroundMeshes[fg])
    }
    for(let bg=0; bg < this.backgroundMeshes.length; bg++) {
      this.backgroundMeshes[bg].renderOrder = -1 * bg
      this.scene.add(this.backgroundMeshes[bg])
    }
    this.scene.add(wires)
    this.newColorInterval()
    this.visibilityInterval = Visibility.every(this.colorInterval * 1000, this.newColorInterval)
  },
  mounted() {
    document.getElementById('bg').classList.add(this.backgroundClass)
  },
  beforeDestroy() {
    this.tweenGroup.removeAll()
    Visibility.stop(this.visibilityInterval)
    document.getElementById('bg').classList.remove(this.backgroundClass)    
  },
  methods: {
    animate() {
      this.tweenGroup.update()
    },
    tweenMaterialColor(material, toColor, interval) {
      let color = {r: material.color.r, g: material.color.g, b: material.color.b}
      toColor = {r: toColor.r, g: toColor.g, b: toColor.b}
      return new TWEEN.Tween(color, this.tweenGroup)
        .to(toColor, interval * 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          material.color.setRGB(color.r, color.g, color.b)
        })
        .start()
    },
    newColorInterval() {
      let scheme = new ColorScheme()
          .from_hue( Math.random() * 360 )
          .scheme(shuffle(['triade','tetrade','analogic', 'contrast'])[0])
          .variation('default')
      let fgColors = scheme.colors()
      let bgColors = shuffle(scheme.colors())
      for (let m=0; m < this.foregroundMaterials.length; m++) {
        this.tweenMaterialColor(this.foregroundMaterials[m], new Three.Color('#' + fgColors[m % fgColors.length]), this.colorInterval)
      }
      for (let m=0; m < this.backgroundMaterials.length; m++) {
        this.tweenMaterialColor(this.backgroundMaterials[m], new Three.Color('#' + bgColors[m % bgColors.length]), this.colorInterval)
      }

    },
    marker(vectors, color="red", radius=0.01) {
      let mat = new Three.MeshBasicMaterial({color})
      if(vectors.isVector2 || vectors.isVector3) {
        vectors = [ vectors ]
      }
      for(let v=0; v < vectors.length; v++) {
        let m = new Three.Mesh(new Three.CircleGeometry(radius, 32).translate(vectors[v].x, vectors[v].y, 0), mat)
        m.renderOrder = 5000
        this.scene.add(m)
      }
    },
    createGeometry() {
      const addWireTriangle = (p1, p2, p3) => {
        let index = this.wireGeometry.vertices.length
        this.wireGeometry.vertices.push(p1, p2, p3)
        this.wireGeometry.faces.push(new Three.Face3(index, index+1, index+2))
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
        //Four more to be added below...
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
      
      let t2t3 = [
        this.$geometry.lineIntersection(t3[1], t3[0], t2[0], t2[1]),
        this.$geometry.lineIntersection(t3[2], t3[0], t2[0], t2[1])
      ]
      
      /// Sixth triangle pointing down
      let t6Temp1 = this.$geometry.midpoint(t3t4[0], t4t1[0])
      let t6Point1 = new Three.Vector3(0, t6Temp1.y, 0)
      let t6 = [
        t6Point1,
        this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t2t3[0]),
        this.$geometry.lineIntersection(t3Temp1, t3Temp2, t6Point1, t2t3[1])
      ]
      
      let t6t1 = [
        this.$geometry.lineIntersection(t6[0], t6[1], t1[0], t1[2]),
        this.$geometry.lineIntersection(t6[0], t6[2], t1[1], t1[2]),
        this.$geometry.lineIntersection(t6[1], t6[2], t1[0], t1[2]),
        this.$geometry.lineIntersection(t6[1], t6[2], t1[1], t1[2]) 
      ]
      
      let t5t6 = [
        this.$geometry.lineIntersection(t5[0], t5[1], t6[0], t6[1]),
        this.$geometry.lineIntersection(t5[0], t5[2], t6[0], t6[2])
      ]
      
      /// Now complete triangle 4:
      let t4 = [
        t4Point1,
        this.$geometry.lineIntersection(t6t1[0], t6t1[1], t4Point1, t4Temp3),
        this.$geometry.lineIntersection(t6t1[0], t6t1[1], t4Point1, t4Temp4)
      ]
      
      t3t4[2] = this.$geometry.lineIntersection(t3[0], t3[1], t4[1], t4[2])
      t3t4[3] = this.$geometry.lineIntersection(t3[0], t3[2], t4[1], t4[2])
      t3t4[4] = this.$geometry.lineIntersection(t4[0], t4[1], t3[1], t3[2])
      t3t4[5] = this.$geometry.lineIntersection(t4[0], t4[2], t3[1], t3[2])
      
      /// Seventh triangle pointing up
      let t7 = [
        new Three.Vector3(0, t4[1].y, 0),
        this.$geometry.midpoint(t3t4[0], t4t1[0]),
        this.$geometry.midpoint(t3t4[1], t4t1[1])
      ]
      
      let t2t7 = [
        this.$geometry.lineIntersection(t2[1], t2[0], t7[0], t7[1]),
        this.$geometry.lineIntersection(t2[1], t2[0], t7[0], t7[2]),
      ]
      
      let t6t7 = [
        this.$geometry.lineIntersection(t6[0], t6[1], t7[0], t7[1]),
        this.$geometry.lineIntersection(t6[0], t6[2], t7[0], t7[2])
      ]
      
      /// Eighth triangle pointing down
      let t8Temp1 = this.$geometry.lineIntersection(t6[0], t6[1], t7[0], t7[1])
      let t8Temp2 = this.$geometry.lineIntersection(t6[0], t6[2], t7[0], t7[2])
      let t8 = [
        new Three.Vector3(0, t3[1].y, 0),
        this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3[0], t3[1]),
        this.$geometry.lineIntersection(t8Temp1, t8Temp2, t3[0], t3[2])
      ]
      
      let t1t8 = [
        this.$geometry.lineIntersection(t1[0], t1[1], t8[0], t8[1]),
        this.$geometry.lineIntersection(t1[0], t1[1], t8[0], t8[2]),
      ]
      
      let t7t8 = [
        this.$geometry.lineIntersection(t8[0], t8[1], t7[0], t7[1]),
        this.$geometry.lineIntersection(t8[0], t8[2], t7[0], t7[2])
      ]
      
      let t5t8 = [
        this.$geometry.lineIntersection(t5[0], t5[1], t8[1], t8[2]),
        this.$geometry.lineIntersection(t5[0], t5[2], t8[1], t8[2]),
        this.$geometry.lineIntersection(t5[0], t5[1], t8[0], t8[1]),
        this.$geometry.lineIntersection(t5[0], t5[2], t8[0], t8[2]),
      ]
      
      /// Ninth triangle pointing down
      let t9Temp1 = this.$geometry.lineIntersection(t6[0], t6[1], t5[0], t5[1])
      let t9Temp2 = this.$geometry.lineIntersection(t6[0], t6[2], t5[0], t5[2])
      let t9 = [
        new Three.Vector3(0, t1[0].y, 0),
        this.$geometry.lineIntersection(t7[0], t7[1], t9Temp1, t9Temp2),
        this.$geometry.lineIntersection(t7[0], t7[2], t9Temp1, t9Temp2)
      ]
      
      let t5t9 = [
        this.$geometry.lineIntersection(t5[0], t5[1], t9[0], t9[1]),
        this.$geometry.lineIntersection(t5[0], t5[2], t9[0], t9[2])
      ]
      
      let t7t9 = [
        this.$geometry.lineIntersection(t7[1], t7[2], t9[0], t9[1]),
        this.$geometry.lineIntersection(t7[1], t7[2], t9[0], t9[2])
      ]
      
      let triangles = [t1, t2, t3, t4, t5, t6, t7, t8, t9]
      if (this.showWires) {
        for(let t=0; t < triangles.length; t++) {
          addWireTriangle(...triangles[t])
        }
      }
      
      ///// Done with wire mesh
      ///// Start making full mesh
      const trianglesGeometry = new Three.Geometry()
      
      const addMeshTriangle = (triTuple, level) => {
        let normal = new Three.Vector3(0, 0, -1)
        let index = trianglesGeometry.vertices.length
        trianglesGeometry.vertices.push(triTuple[0], triTuple[1], triTuple[2])
        trianglesGeometry.faces.push(new Three.Face3(
          index+2, index+1, index, normal, this.foregroundMaterials[level].color, level))
        //TODO: might not need uv map?
        //this.foregroundGeometry.faceVertexUvs[0].push([new Three.Vector2(),new Three.Vector2(),new Three.Vector2()])
      }
      
      /// Add innermost triangle (material index 0)
      addMeshTriangle([t6[0],t5t6[0],t5t6[1]], 0)
      
      /// Add second layer of 9 triangles (material index 1)
      addMeshTriangle([t5[0], t5t8[1], t5t8[0]], 1)
      addMeshTriangle([t5t8[1], t6t7[1], t5t6[1]], 1)
      addMeshTriangle([t5t6[1], t9[2], t5t9[1]], 1)
      addMeshTriangle([t5t9[1], t5t8[3], t7t9[1]], 1)
      addMeshTriangle([t7t9[0], t7t9[1], t9[0]], 1)
      addMeshTriangle([t5t9[0], t7t9[0], t5t8[2]], 1)
      addMeshTriangle([t5t6[0], t5t9[0], t9[1]], 1)
      addMeshTriangle([t5t8[0], t5t6[0], t6t7[0]], 1)
      
      /// Add third layer of 10 triangles (material index 2)
      addMeshTriangle([t2t7[1], t2t7[0], t7[0]], 2)
      addMeshTriangle([t2t7[1], t2t3[1], t6t7[1]], 2)
      addMeshTriangle([t6t7[1], t8[2], t7t8[1]], 2)
      addMeshTriangle([t7t8[1], t7[2], t5t8[3]], 2)
      addMeshTriangle([t5t8[3], t4t1[1], t1t8[1]], 2)
      addMeshTriangle([t1t8[1], t8[0], t1t8[0]], 2)
      addMeshTriangle([t5t8[2], t1t8[0], t4t1[0]], 2)
      addMeshTriangle([t7t8[0], t5t8[2], t7[1]], 2)
      addMeshTriangle([t6t7[0], t7t8[0], t8[1]], 2)
      addMeshTriangle([t2t7[0], t6t7[0], t2t3[0]], 2)
      
      /// Add fourth layer of 10 triangles (material index 3)
      addMeshTriangle([t3[0], t3t4[3], t3t4[2]], 3)
      addMeshTriangle([t3t4[3], t6t1[1], t2t3[1]], 3)
      addMeshTriangle([t2t3[1], t1t2[4], t3t4[1]], 3)
      addMeshTriangle([t3t4[1], t1t2[5], t4t1[1]], 3)
      addMeshTriangle([t4t1[1], t5t2[1], t3t4[5]], 3)
      addMeshTriangle([t3t4[5], t4[0], t3t4[4]], 3)
      addMeshTriangle([t4t1[0], t3t4[4], t5t2[0]], 3)
      addMeshTriangle([t3t4[0], t4t1[0], t1t2[2]], 3)
      addMeshTriangle([t2t3[0], t3t4[0], t1t2[1]], 3)
      addMeshTriangle([t6t1[0], t3t4[2], t2t3[0]], 3)
      
      /// Add fifth layer of 14 triangles (material index 4)
      addMeshTriangle([t1[2], t6t1[3], t6t1[2]], 4)
      addMeshTriangle([t6t1[3], t6[2], t6t1[1]], 4)
      addMeshTriangle([t6t1[1], t4[2], t1t2[4]], 4)
      addMeshTriangle([t1t2[4], t2[1], t1t2[3]], 4)
      addMeshTriangle([t1t2[3], t1[1], t1t2[5]], 4)
      addMeshTriangle([t1t2[5], t3[2], t5t2[1]], 4)
      addMeshTriangle([t5t2[1], t5[2], t5t2[3]], 4)
      addMeshTriangle([t5t2[3], t2[2], t5t2[2]], 4)
      addMeshTriangle([t5t2[0], t5t2[2], t5[1]], 4)
      addMeshTriangle([t1t2[2], t5t2[0], t3[1]], 4)
      addMeshTriangle([t1t2[2], t1[0], t1t2[0]], 4)
      addMeshTriangle([t1t2[1], t1t2[0], t2[0]], 4)
      addMeshTriangle([t6t1[0], t1t2[1], t4[1]], 4)
      addMeshTriangle([t6t1[2], t6t1[0], t6[1]], 4)
      
      this.foregroundMeshes.push(new Three.Mesh(trianglesGeometry, this.foregroundMaterials))
      
      /// Add Bindu
      this.marker(this.center, 'white', 0.01)
      
      /// Add Bhupura
      const circle1 = new Three.CircleGeometry(
        this.innerRadius, 256).translate(this.center.x, this.center.y, 0)
      const circle2Radius = this.$geometry.distance(t6[0], dodecagon.vertices[4])
      const circle2 = new Three.CircleGeometry(
        circle2Radius, 256).translate(this.center.x, this.center.y, 0)
      const circle3Radius = this.$geometry.distance(t5[0], dodecagon.vertices[10])
      const circle3 = new Three.CircleGeometry(
        circle3Radius, 256).translate(this.center.x, this.center.y, 0)
      const circle4Radius = circle3Radius + 0.03 * this.innerRadius
      const circle4 = new Three.CircleGeometry(
        circle4Radius, 256).translate(this.center.x, this.center.y, 0)
      const circle5Radius = circle3Radius + 0.06 * this.innerRadius
      const circle5 = new Three.CircleGeometry(
        circle5Radius, 256).translate(this.center.x, this.center.y, 0)
      const circle6Radius = circle3Radius + 0.09 * this.innerRadius
      const circle6 = new Three.CircleGeometry(
        circle6Radius, 256).translate(this.center.x, this.center.y, 0)
      this.wireGeometry.merge(circle1)
      this.wireGeometry.merge(circle2)
      this.wireGeometry.merge(circle3)
      this.wireGeometry.merge(circle4)
      this.wireGeometry.merge(circle5)
      this.wireGeometry.merge(circle6)
      
      /// Add Petals level 1
      const petal1Top = this.$geometry.pointOnCircle(this.center, circle2Radius,  90)
      const petal1BottomLeft = this.$geometry.pointOnCircle(this.center, this.innerRadius, 90 + (360 / 16))
      const petal1BottomRight = this.$geometry.pointOnCircle(this.center, this.innerRadius, 90 - (360 / 16))
      const petal1MidLeft = this.$geometry.midpoint(petal1Top, petal1BottomLeft)
      const petal1MidRight = this.$geometry.midpoint(petal1Top, petal1BottomRight)
      const petal1CP1 = new Three.Vector3(petal1Top.x, petal1Top.y - 0.08 * this.innerRadius, 0)
      const petal1CP2 = new Three.Vector3(petal1MidLeft.x - 0.20 * this.innerRadius, petal1MidLeft.y + 0.03 * this.innerRadius)
      const petal1CP3 = new Three.Vector3(-1 * petal1CP2.x, petal1CP2.y)
      const petal1Shape = new Three.Shape()
      petal1Shape.moveTo(petal1Top.x, petal1Top.y)
      petal1Shape.bezierCurveTo(petal1CP1.x, petal1CP1.y, petal1CP2.x, petal1CP2.y, petal1BottomLeft.x, petal1BottomLeft.y)
      //petal1Shape.lineTo(petal1BottomLeft.x, petal1BottomLeft.y)
      let angle1 = 90 + (360 / 16)
      const segments1 = 16
      for (let i=0; i < segments1; i++) {
        angle1 = angle1 - (1/segments1) * (360/8)
        let p = this.$geometry.pointOnCircle(this.center, this.innerRadius, angle1)
        petal1Shape.lineTo(p.x, p.y)
      }
      petal1Shape.bezierCurveTo(petal1CP3.x, petal1CP3.y, petal1CP1.x, petal1CP1.y, petal1Top.x, petal1Top.y)
      const petal1 = new Three.Mesh(new Three.ShapeGeometry(petal1Shape), this.foregroundMaterials[5])
      for (let i=0; i < 8; i++) {
        let p = petal1.clone()
        p.rotation.z = i * (360/8) * (Math.PI/180)
        this.foregroundMeshes.push(p)
      }
      
      /// Add Petals level 2
      const petal2Top = this.$geometry.pointOnCircle(this.center, circle3Radius, 90)
      const petal2BottomLeft = this.$geometry.pointOnCircle(this.center, circle2Radius, 90 + (360 / 32))
      const petal2BottomRight = this.$geometry.pointOnCircle(this.center, circle2Radius, 90 - (360 / 32))
      const petal2MidLeft = this.$geometry.midpoint(petal2Top, petal2BottomLeft)
      const petal2MidRight = this.$geometry.midpoint(petal2Top, petal2BottomRight)
      const petal2CP1 = new Three.Vector3(petal2Top.x, petal2Top.y - 0.08 * this.innerRadius, 0)
      const petal2CP2 = new Three.Vector3(petal2MidLeft.x - 0.20 * this.innerRadius, petal2MidLeft.y + 0.03 * this.innerRadius)
      const petal2CP3 = new Three.Vector3(-1 * petal2CP2.x, petal2CP2.y)
      const petal2Shape = new Three.Shape()
      petal2Shape.moveTo(petal2Top.x, petal2Top.y)
      petal2Shape.bezierCurveTo(petal2CP1.x, petal2CP1.y, petal2CP2.x, petal2CP2.y, petal2BottomLeft.x, petal2BottomLeft.y)
      //petal2Shape.lineTo(petal2BottomLeft.x, petal2BottomLeft.y)
      let angle2 = 90 + (360 / 32)
      const segments2 = 16
      for (let i=0; i < segments2; i++) {
        angle2 = angle2 - (1/segments2) * (360/16)
        let p = this.$geometry.pointOnCircle(this.center, circle2Radius, angle2)
        petal2Shape.lineTo(p.x, p.y)
      }
      petal2Shape.bezierCurveTo(petal2CP3.x, petal2CP3.y, petal2CP1.x, petal2CP1.y, petal2Top.x, petal2Top.y)
      const petal2 = new Three.Mesh(new Three.ShapeGeometry(petal2Shape), this.foregroundMaterials[6])
      for (let i=0; i < 16; i++) {
        let p = petal2.clone()
        p.rotation.z = i * (360/16) * (Math.PI/180)
        this.foregroundMeshes.push(p)
      }
      
      /// Add background layers
      const triangleBG4 = new Three.Geometry()
      triangleBG4.vertices.push(t5t8[2], t5t8[3], t5[0])
      triangleBG4.faces.push(new Three.Face3(0, 1, 2))
      this.backgroundMeshes.push(new Three.Mesh(triangleBG4, this.backgroundMaterials[0]))
      const triangleBG3 = new Three.Geometry()
      triangleBG3.vertices.push(t7t8[0], t7t8[1], t7[0], t8[0])
      triangleBG3.faces.push(new Three.Face3(0, 1, 2), new Three.Face3(0, 3, 1))
      this.backgroundMeshes.push(new Three.Mesh(triangleBG3, this.backgroundMaterials[1]))
      const triangleBG2 = new Three.Geometry()
      triangleBG2.vertices.push(t3t4[0], t3t4[1], t3[0], t4[0])
      triangleBG2.faces.push(new Three.Face3(0, 1, 2), new Three.Face3(0, 3, 1))
      this.backgroundMeshes.push(new Three.Mesh(triangleBG2, this.backgroundMaterials[2]))
      const triangleBG1 = new Three.Geometry()
      triangleBG1.vertices.push(t1t2[0], t1t2[3], t1[2], t2[2])
      triangleBG1.faces.push(new Three.Face3(0, 1, 2), new Three.Face3(0, 3, 1))
      this.backgroundMeshes.push(new Three.Mesh(triangleBG1, this.backgroundMaterials[3]))
      this.backgroundMeshes.push(new Three.Mesh(new Three.CircleGeometry(this.innerRadius, 64), this.backgroundMaterials[4]))
      this.backgroundMeshes.push(new Three.Mesh(new Three.CircleGeometry(circle3Radius, 64), this.backgroundMaterials[5]))

      /// Add gateway
      const squareGuide1 = new Three.PlaneGeometry(circle6Radius * 2, circle6Radius * 2)
      const gwLevel = (level) => {
        const levelIncrease = level * 0.02 * this.innerRadius
        let array = []
        array[0] = new Three.Vector3(squareGuide1.vertices[0].x - levelIncrease, squareGuide1.vertices[0].y + levelIncrease)
        array[1] = new Three.Vector3(((circle6Radius * 2) / 3) - circle6Radius - levelIncrease, squareGuide1.vertices[0].y + levelIncrease)
        array[2] = new Three.Vector3(array[1].x, 0.05 * this.innerRadius + t7[0].y - t2[2].y - levelIncrease)
        array[3] = new Three.Vector3(array[1].x - 0.1 * this.innerRadius, array[2].y)
        array[4] = new Three.Vector3(array[3].x, array[3].y + 0.1 * this.innerRadius + 2*levelIncrease)
        array[5] = new Three.Vector3(-1 * array[4].x, array[4].y)
        array[6] = new Three.Vector3(-1 * array[3].x, array[3].y)
        array[7] = new Three.Vector3(-1 * array[2].x, array[2].y)
        array[8] = new Three.Vector3(-1 * array[1].x, array[1].y)
        array[9] = new Three.Vector3(squareGuide1.vertices[1].x + levelIncrease, squareGuide1.vertices[1].y + levelIncrease)
        array[10] = new Three.Vector3(array[9].x, 0.5 * ((circle6Radius * 2) / 3) + levelIncrease)
        array[11] = new Three.Vector3(array[2].y, array[10].y)
        array[12] = new Three.Vector3(array[11].x, array[11].y + 0.1 * this.innerRadius)
        array[13] = new Three.Vector3(array[11].x + 0.1 * this.innerRadius + 2*levelIncrease, array[12].y)
        array[14] = new Three.Vector3(array[13].x, -1 * array[13].y)
        array[15] = new Three.Vector3(array[12].x, -1 * array[12].y)
        array[16] = new Three.Vector3(array[11].x, -1 * array[11].y)
        array[17] = new Three.Vector3(array[10].x, -1 * array[10].y)
        array[18] = new Three.Vector3(squareGuide1.vertices[3].x + levelIncrease, squareGuide1.vertices[3].y - levelIncrease)
        array[19] = new Three.Vector3(array[8].x, -1 * array[8].y)
        array[20] = new Three.Vector3(array[7].x, -1 * array[7].y)
        array[21] = new Three.Vector3(array[6].x, -1 * array[6].y)
        array[22] = new Three.Vector3(array[5].x, -1 * array[5].y)
        array[23] = new Three.Vector3(array[4].x, -1 * array[4].y)
        array[24] = new Three.Vector3(array[3].x, -1 * array[3].y)
        array[25] = new Three.Vector3(array[2].x, -1 * array[2].y)
        array[26] = new Three.Vector3(array[1].x, -1 * array[1].y)
        array[27] = new Three.Vector3(squareGuide1.vertices[2].x - levelIncrease, squareGuide1.vertices[2].y - levelIncrease)
        array[28] = new Three.Vector3(-1 * array[17].x, array[17].y)
        array[29] = new Three.Vector3(-1 * array[16].x, array[16].y)
        array[30] = new Three.Vector3(-1 * array[15].x, array[15].y)
        array[31] = new Three.Vector3(-1 * array[14].x, array[14].y) 
        array[32] = new Three.Vector3(-1 * array[13].x, array[13].y)
        array[33] = new Three.Vector3(-1 * array[12].x, array[12].y)
        array[34] = new Three.Vector3(-1 * array[11].x, array[11].y)
        array[35] = new Three.Vector3(-1 * array[10].x, array[10].y)
        array[36] = array[0]
        return array
      }
      
      const gateMesh = (points, material) => {
        const gateShape = new Three.Shape()
        gateShape.moveTo(points[0].x, points[0].y)
        for(let i=1; i < points.length; i++) {
          gateShape.lineTo(points[i].x, points[i].y)
        }
        const gateGeometry = new Three.ShapeGeometry(gateShape)
        this.backgroundMeshes.push(new Three.Mesh(gateGeometry, material))
      }
      for (let level=-2; level < 5; level++) {
        gateMesh(gwLevel(level), this.backgroundMaterials[8 + level])
      }


    }
  }
}
</script>
