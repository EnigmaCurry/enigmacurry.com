import * as Three from 'three';
import Vue from 'vue';
import assert from 'assert'
import * as math from 'mathjs'

const $geometry = Vue.prototype.$geometry = { }
export {
  $geometry
}

$geometry.lineIntersection = (line1a, line1b, line2a, line2b) => {
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

$geometry.lineCircleIntersection = (p1, p2, radius, center={x:0, y:0}) => {
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

$geometry.midpoint = (p1, p2) => {
  return new Three.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
}

$geometry.distance = (p1, p2) => {
  return math.distance([p1.x, p1.y], [p2.x, p2.y])
}

// Circle-Circle intersection
// MIT Licenced from: 
// https://github.com/williamfiset/Algorithms/blob/master/com/williamfiset/algorithms/geometry/CircleCircleIntersectionPoints.js
$geometry.circleCircleIntersection = (center1, radius1, center2, radius2) => {
  // Let EPS (epsilon) be a small value
  const EPS = 0.0000001
  // Let a point be a pair: (x, y)
  const Point = function(x, y) {
    this.x = x
    this.y = y
  }
  // Define a circle centered at (x,y) with radius r
  const Circle = function(x,y,r) {
    this.x = x
    this.y = y
    this.r = r
  }
  // Due to double rounding precision the value passed into the Math.acos
  // function may be outside its domain of [-1, +1] which would return
  // the value NaN which we do not want.
  const acossafe = function(x) {
    if (x >= +1.0) return 0
    if (x <= -1.0) return Math.PI
    return Math.acos(x)
  }
  // Rotates a point about a fixed point at some angle 'a'
  const rotatePoint = function(fp, pt, a) {
    let x = pt.x - fp.x;
    let y = pt.y - fp.y;
    let xRot = x * Math.cos(a) + y * Math.sin(a);
    let yRot = y * Math.cos(a) - x * Math.sin(a);
    return new Point(fp.x+xRot,fp.y+yRot);
  }
  let r, R, d, dx, dy, cx, cy, Cx, Cy;

  if (radius1 < radius2) {
    r  = radius1;  R = radius2;
    cx = center1.x; cy = center1.y;
    Cx = center2.x; Cy = center2.y;
  } else {
    r  = radius2; R  = radius1;
    Cx = center1.x; Cy = center1.y;
    cx = center2.x; cy = center2.y;
  }

  // Compute the vector <dx, dy>
  dx = cx - Cx;
  dy = cy - Cy;

  // Find the distance between two points.
  d = Math.sqrt( dx*dx + dy*dy );

  // There are an infinite number of solutions
  // Seems appropriate to also return null
  if (d < EPS && Math.abs(R-r) < EPS) return [];

  // No intersection (circles centered at the 
  // same place with different size)
  else if (d < EPS) return [];

  let x = (dx / d) * R + Cx;
  let y = (dy / d) * R + Cy;
  let P = new Point(x, y);

  // Single intersection (kissing circles)
  if (Math.abs((R+r)-d) < EPS || Math.abs(R-(r+d)) < EPS) return [P];

  // No intersection. Either the small circle contained within 
  // big circle or circles are simply disjoint.
  if ( (d+r) < R || (R+r < d) ) return [];

  let C = new Point(Cx, Cy);
  let angle = acossafe((r*r-d*d-R*R)/(-2.0*d*R));
  let pt1 = rotatePoint(C, P, +angle);
  let pt2 = rotatePoint(C, P, -angle);
  return [pt1, pt2];
}

//------------ flowerPattern --------------------------------------
// Construct the flower of life pattern as an array of Vector3(x,y,z=0)
// specifying the center of each circle.
// Args:
//    origin     - the coordinates of the center of the first circle.
//    unitRadius - the radius of the circles.
//    levels     - the number of levels to compute.
//                 Level 1 is the seed, with 7 circles. Level 2 is 19 etc.
//    rotation   - Rotate flower n degress
$geometry.flowerPattern = (origin, unitRadius, levels, rotation=0) => {
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
let areaOfTriangleBySides = $geometry.areaOfTriangleBySides = (sideA, sideB, sideC) => {
  assert((sideA + sideB) > sideC)
  assert((sideB + sideC) > sideA)
  assert((sideC + sideA) > sideB)
  let s = 0.5 * (sideA + sideB + sideC)
  return Math.sqrt(s * (s-sideA) * (s-sideB) * (s-sideC))
}

let pointOnCircle = $geometry.pointOnCircle = ({x, y}, radius, degrees) => {
  return new Three.Vector3(
    x + radius * Math.cos(degrees * (Math.PI/180)),
    y + radius * Math.sin(degrees * (Math.PI/180))
  )
}

// Penrose P2 tiling - Subdivide list of golden triangles and gnomon coordinates
$geometry.penroseP2Subdivision = (triangles, iterations=1) => {
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
        subdivisions.push(["golden", B,P,A])
        subdivisions.push(["gnomon", P,C,A])
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
$geometry.penroseP3Subdivision = (triangles, iterations=1) => {
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

$geometry.enigmacurryEC1Subdivision = (triangles, iterations=1) => {
  let ratio = (1 + Math.sqrt(8)) / 2
  let subdivide = (triangles) => {
    let subdivisions = []
    for (let t = 0; t < triangles.length; t++) {
      let [triangleType, A, B, C] = triangles[t]
      if (triangleType === "golden") {
        let Q = math.add(C, math.divide(math.add(A, B), ratio))
        let R = math.add(A, math.divide(math.add(C, A), ratio))
        subdivisions.push(["golden", C, B, R])
        subdivisions.push(["golden", B, Q, R])
        subdivisions.push(["gnomon", A, Q, R])
      } else if (triangleType === "gnomon"){
        let P = math.add(B, math.divide(math.subtract(C, B), ratio))
        subdivisions.push(["golden", P,B,A])
        subdivisions.push(["gnomon", C,P,A])
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
$geometry.penroseTileGeometry = (tileType="p2", iterations=1, initialTriangles) => {
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
    subdivisionFunc = $geometry.penroseP2Subdivision
  } else if (tileType === 'p3') {
    subdivisionFunc = $geometry.penroseP3Subdivision
  } else if (tileType === "ec1") {
    subdivisionFunc = $geometry.enigmacurryEC1Subdivision
  }
  let coordinates = subdivisionFunc(initialTriangles, iterations)
  let geometry = new Three.Geometry()
  geometry.faceVertexUvs = [[],[],[],[]]
  for (let c=0; c < coordinates.length; c++) {
    let [triangleType, A, B, C] = coordinates[c]
    let v = geometry.vertices.length
    geometry.vertices.push(new Three.Vector3(A.re, A.im, 0))
    geometry.vertices.push(new Three.Vector3(B.re, B.im, 0))
    geometry.vertices.push(new Three.Vector3(C.re, C.im, 0))
    let face = new Three.Face3(v+2, v+1, v, null, null, triangleType === "golden" ? 0 : 1)
    face.triangleType = triangleType
    if (triangleType === "golden") {
      geometry.faces.push(face)
      geometry.faceVertexUvs[0].push([
        new Three.Vector2(0.5, 0.5),
        new Three.Vector2(0.69, 0.1),
        new Three.Vector2(0, 0),
      ])
    } else {
      geometry.faces.push(face)
      geometry.faceVertexUvs[0].push([
        new Three.Vector2(1.13, 0.14),
        new Three.Vector2(0, 0),
        new Three.Vector2(0.5, 0.5),
      ])
    }
  }
  geometry.uvsNeedUpdate = true

  // Replace faces that are faceing the wrong way with opposide vertex winding:
  geometry.computeFaceNormals()
  for(let f=0; f<geometry.faces.length; f++){
    let face = geometry.faces[f]
    if(face.normal.z < 0) {
      let [a, b, c, material, triangleType] = [face.a, face.b, face.c, face.materialIndex, face.triangleType]
      face = geometry.faces[f] = new Three.Face3(c, b, a, null, null, material)
      face.triangleType = triangleType + "-left"
      if (triangleType === 'golden') {
        geometry.faceVertexUvs[0][f] = [
          new Three.Vector2(0, 0),
          new Three.Vector2(0.69, 0.1),
          new Three.Vector2(0.5, 0.5),
        ]
      } else {
        geometry.faceVertexUvs[0][f] = [
          new Three.Vector2(0.5, 0.5),
          new Three.Vector2(0, 0),
          new Three.Vector2(1.13, 0.14),
        ]
      }
    }
  }
  return geometry
}

// Create outline geometry for an existing penrose P2 geometry
// The faces must have the triangleType property set as above.
$geometry.penroseTileP2OutlineGeometry = (penroseGeometry) => {
  let geometry = new Three.Geometry()
  for(let f=0; f < penroseGeometry.faces.length; f++){
    let face = penroseGeometry.faces[f]
    if(face.triangleType === 'golden' || face.triangleType == 'golden-left') {
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
    } else if(face.triangleType === 'gnomon') {
      //Right gnomon
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
    } 
  }
  return geometry
}

// Create outline geometry for an existing penrose P3 geometry
// The faces must have the triangleType property set as above.
$geometry.penroseTileP3OutlineGeometry = (penroseGeometry) => {
  let geometry = new Three.Geometry()
  for(let f=0; f < penroseGeometry.faces.length; f++){
    let face = penroseGeometry.faces[f]
    if(face.triangleType === 'golden' ) {
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
    } else if(face.triangleType === 'golden-left') {
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
      geometry.vertices.push(penroseGeometry.vertices[face.a])
    } else if(face.triangleType == 'gnomon') {
      geometry.vertices.push(penroseGeometry.vertices[face.a])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
      geometry.vertices.push(penroseGeometry.vertices[face.c])
      geometry.vertices.push(penroseGeometry.vertices[face.b])
    }
  }
  return geometry
}


//Epicycle function generator, which calculates the orbit of an orbit (of an orbit...) recursively as a function of time
$geometry.epicycle = (orbitRadius, orbitPeriod, centerFunc, offset=-17) => {
  // Center position of the orbit is calculated by time, or assumed to be 0,0 if not given:
  if (typeof(centerFunc) === 'undefined') {
    centerFunc = (time) => {return {x: 0, y: 0}}
  }
  // Return a new function that uses centerFunc and calculates the nested orbit position based on time:
  return (time) => {
    let center = centerFunc(time)
    let angle = (time === 0 ? 0 : 360 / (orbitPeriod / time))
    let revolutions = Math.floor(angle / 360)
    let x = center.x + orbitRadius * math.cos(math.unit(angle + offset, "deg"))
    let y = center.y + orbitRadius * math.sin(math.unit(angle + offset, "deg"))
    return {x, y, revolutions}
  }
}

// Find a circle given three points on its circumference
// http://web.archive.org/web/20161011113446/http://www.abecedarical.com/zenosamples/zs_circle3pts.html
$geometry.circleFromThreePoints = (p1, p2, p3) => {
  let p = [p1, p2, p3]

  // Minor 11
  let a = []
  for (let i=0; i<3; i++){
    a.push([p[i].x, p[i].y, 1])
  }
  const m11 = math.det(a)

  // Minor 12
  a = []
  for (let i=0; i<3; i++){
    a.push([Math.pow(p[i].x, 2) + Math.pow(p[i].y, 2), p[i].y, 1])
  }
  const m12 = math.det(a)

  // Minor 13
  a = []
  for (let i=0; i<3; i++) {
    a.push([Math.pow(p[i].x, 2) + Math.pow(p[i].y, 2), p[i].x, 1])
  }
  const m13 = math.det(a)

  // Minor 14
  a = []
  for (let i=0; i<3; i++) {
    a.push([Math.pow(p[i].x, 2) + Math.pow(p[i].y, 2), p[i].x, p[i].y])
  }
  const m14 = math.det(a)

  let center = new Three.Vector2(0, 0)
  let radius = 0
  let isCircle = false
  if (m11 != 0) {
    isCircle = true
    center.x = 0.5 * m12 / m11
    center.y = -0.5 * m13 / m11
    radius = Math.sqrt(Math.pow(center.x, 2) + Math.pow(center.y, 2) + m14/m11)
  }
  return {center, radius, isCircle}
}
