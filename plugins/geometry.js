import * as Three from 'three';
import Vue from 'vue';
import assert from 'assert'
import * as math from 'mathjs'

Vue.prototype.$geometry = { }

//------------ flowerPattern --------------------------------------
// Construct the flower of life pattern as an array of Vector3(x,y,z=0)
// specifying the center of each circle.
// Args:
//    origin     - the coordinates of the center of the first circle.
//    unitRadius - the radius of the circles.
//    levels     - the number of levels to compute.
//                 Level 1 is the seed, with 7 circles. Level 2 is 19 etc.
//    rotation   - Rotate flower n degress
Vue.prototype.$geometry.flowerPattern = (origin, unitRadius, levels, rotation=0) => {
  let points = [ origin.clone() ];
  let clockPattern = [
    //Down Right
    new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius),
    //Down
    new Three.Vector3(0, 1 * unitRadius),
    //Down Left
    new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), 0.5 * unitRadius),
    //Up Left
    new Three.Vector3(-0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius),
    //Up
    new Three.Vector3(0, -1 * unitRadius),
    //Up Right
    new Three.Vector3(0.5 * unitRadius * Math.sqrt(3), -0.5 * unitRadius)
  ];
  for (let level = 1; level <= levels; level++) {
    // Up Level
    points.push(new Three.Vector3(points[0].x, (points[0].y - level) * unitRadius, 0));
    // Around the outside clockwise
    for (let vec=0; vec < clockPattern.length; vec++) {
      //Edge length is the same as the level, except for the last segment:
      let edgeLength = (vec === clockPattern.length - 1) ? level -1 : level;
      for (let c=0; c < edgeLength; c++) {
        let p = points[points.length-1].clone();
        p.add(clockPattern[vec]);
        points.push(p);
      }
    }
  }
  if (rotation !== 0) {
    let rotatePoint = function( point, center, degrees ){
      let radians = degrees * (Math.PI / 180);
      let cosTheta = Math.cos(radians);
      let sinTheta = Math.sin(radians);
      return new Three.Vector3(
        (cosTheta * ( point.x - center.x) -
         sinTheta * ( point.y - center.y) + center.x),
        (sinTheta * (point.x - center.x) +
         cosTheta * (point.y - center.y) + center.y),
        0
      );
    };
    for(let p=0; p < points.length; p++){
      points[p] = rotatePoint(points[p], origin, rotation);
    }
  }
  return points;
}

// Heron's formula for calculating area of triangle from the three side lengths:
Vue.prototype.$geometry.areaOfTriangleBySides = (sideA, sideB, sideC) => {
  assert((sideA + sideB) > sideC)
  assert((sideB + sideC) > sideA)
  assert((sideC + sideA) > sideB)
  let s = 0.5 * (sideA + sideB + sideC)
  return Math.sqrt(s * (s-sideA) * (s-sideB) * (s-sideC))
}

// Penrose P2 tiling - Subdivide list of golden triangles and gnomon coordinates
const penroseP2Subdivision = Vue.prototype.$geometry.penroseP2Subdivision = (triangles, iterations=1) => {
  let goldenRatio = (1 + Math.sqrt(5)) / 2
  let subdivide = (triangles) => {
    let subdivisions = []
    for (let t = 0; t < triangles.length; t++) {
      let [triangleType, A, B, C] = triangles[t]
      if (triangleType === "golden") {
        let Q = math.add(B, math.divide(math.subtract(A, B), goldenRatio))
        let R = math.add(A, math.divide(math.subtract(C, A), goldenRatio))
        subdivisions.push(["golden", B, C, R])
        subdivisions.push(["golden", B, Q, R])
        subdivisions.push(["gnomon", Q, A, R])
      } else if (triangleType === "gnomon"){
        let P = math.add(B, math.divide(math.subtract(C, B), goldenRatio))
        subdivisions.push(["golden", A, B, P])
        subdivisions.push(["gnomon", A, C, P])
      } else {
        console.error("Unknown triangle type", triangleType)
      }
    }
    return subdivisions
  }

  let result = triangles
  for (let i=0; i < iterations; i++) {
    result = subdivide(result)
  }
  return result
}

// Penrose P3 tiling - Subdivide list of golden triangles and gnomon coordinates
// https://preshing.com/20110831/penrose-tiling-explained/
const penroseP3Subdivision = Vue.prototype.$geometry.penroseP3Subdivision = (triangles, iterations=1) => {
  let goldenRatio = (1 + Math.sqrt(5)) / 2
  let subdivide = (triangles) => {
    let subdivisions = []
    for (let t = 0; t < triangles.length; t++) {
      let [triangleType, A, B, C] = triangles[t]
      if (triangleType === "golden") {
        let P = math.add(A, math.divide(math.subtract(B, A), goldenRatio))
        subdivisions.push(["golden", C, P, B])
        subdivisions.push(["gnomon", P, C, A])
      } else if (triangleType === "gnomon"){
        let Q = math.add(B, math.divide(math.subtract(A, B), goldenRatio))
        let R = math.add(B, math.divide(math.subtract(C, B), goldenRatio))
        subdivisions.push(["gnomon", R, C, A])
        subdivisions.push(["gnomon", Q, R, B])
        subdivisions.push(["golden", R, Q, A])
      } else {
        console.error("Unknown triangle type", triangleType)
      }
    }
    return subdivisions
  }

  let result = triangles
  for (let i=0; i < iterations; i++) {
    result = subdivide(result)
  }
  return result
}

// Penrose Tiling for p2 or p3
// Specify initial triangles as list of type and coordinates [(type, A, B, C), ...]
// types must be either 'golden' or 'gnomon'
// Coordinates must be math.js complex numbers where real component is X coordinate and imaginary is Y coordinate
// Will start with a decagon of 10 golden triangles if none are specified
const penroseTileGeometry = Vue.prototype.$geometry.penroseTileGeometry = (tileType="p2", iterations=1, initialTriangles) => {
  if (typeof(initialTriangles) === "undefined" || initialTriangles.length === 0) {
    initialTriangles = []
    for (let i=0; i < 10; i++) {
      let B = math.complex({r: 1, phi: (2*i - 1) * Math.PI / 10})
      let C = math.complex({r: 1, phi: (2*i + 1) * math.PI / 10})
      if (i % 2 === 0) {
        //Mirror every second triangle:
        [B, C] = [C, B]
      }
      initialTriangles.push(['golden', math.complex(0), B, C])
    }
  }
  let subdivisionFunc
  if(tileType === 'p2') {
    subdivisionFunc = penroseP2Subdivision
  } else if (tileType === 'p3') {
    subdivisionFunc = penroseP3Subdivision
  }
  let coordinates = subdivisionFunc(initialTriangles, iterations)
  let geometry = new Three.Geometry()
  for (let c=0; c < coordinates.length; c++) {
    let [triangleType, A, B, C] = coordinates[c]
    geometry.vertices.push(new Three.Vector3(A.re, A.im, 0))
    geometry.vertices.push(new Three.Vector3(B.re, B.im, 0))
    geometry.vertices.push(new Three.Vector3(C.re, C.im, 0))
  }
  for (let f=0; f < geometry.vertices.length; f+=3) {
    geometry.faces.push(new Three.Face3(f, f+1, f+2))
  }
  geometry.elementsNeedUpdate = true
  return geometry
}
