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
let areaOfTriangleBySides = Vue.prototype.$geometry.areaOfTriangleBySides = (sideA, sideB, sideC) => {
  assert((sideA + sideB) > sideC)
  assert((sideB + sideC) > sideA)
  assert((sideC + sideA) > sideB)
  let s = 0.5 * (sideA + sideB + sideC)
  return Math.sqrt(s * (s-sideA) * (s-sideB) * (s-sideC))
}

let pointOnCircle = Vue.prototype.$geometry.pointOnCircle = ({x, y}, radius, degrees) => {
  return {
    x: x + radius * Math.cos(degrees * (Math.PI/180)),
    y: y + radius * Math.sin(degrees * (Math.PI/180))
  }
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

const enigmacurryEC1Subdivision = Vue.prototype.$geometry.enigmacurryEC1Subdivision = (triangles, iterations=1) => {
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
  } else if (tileType === "ec1") {
    subdivisionFunc = enigmacurryEC1Subdivision
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
const penroseTileP2OutlineGeometry = Vue.prototype.$geometry.penroseTileP2OutlineGeometry = (penroseGeometry) => {
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
const penroseTileP3OutlineGeometry = Vue.prototype.$geometry.penroseTileP3OutlineGeometry = (penroseGeometry) => {
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
const epicycle = Vue.prototype.$geometry.epicycle = (orbitRadius, orbitPeriod, centerFunc, offset=-17) => {
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

// Regular tiling polygons
// https://morphingtiling.wordpress.com/2010/12/27/regular-and-semi-regular-tilings/
const regularTilingGeometry = Vue.prototype.$geometry.regularTilingGeometry = {
  triangles: (repeatX=1, repeatY=1) => {
    let normal = new Three.Vector3(0, 0, 0)
    let yellow = new Three.Color("yellow")
    let blue = new Three.Color("blue")
    let g = new Three.Geometry()
    g.vertices[0] = new Three.Vector3(0, 0, 0)
    g.vertices[1] = new Three.Vector3(Math.sqrt(3), -1, 0)
    g.vertices[2] = new Three.Vector3(0, -2, 0)
    g.faces[0] = new Three.Face3(2, 1, 0, normal, yellow, 0)
    g.vertices[3] = new Three.Vector3(Math.sqrt(3), -3, 0)
    g.faces[1] = new Three.Face3(2, 3, 1, normal, blue, 1)
    g.vertices[4] = new Three.Vector3(2*Math.sqrt(3), -2, 0)
    g.faces[2] = new Three.Face3(3, 4, 1, normal, yellow, 0)
    g.vertices[5] = new Three.Vector3(2*Math.sqrt(3), 0, 0)
    g.faces[3] = new Three.Face3(1, 4, 5, normal, blue, 1)

    let xTranslate = 2 * Math.sqrt(3)
    let yTranslate = -2
    let geometry = new Three.Geometry()
    for (let x=0; x < repeatX; x++) {
      for (let y=0; y < repeatY; y++) {
        geometry.merge(g.clone().translate(x * xTranslate, y * yTranslate, 0))
      }
    }
    geometry.computeBoundingBox()
    geometry.translate(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2, 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
 },
  squares: (repeatX=1, repeatY=1) => {
    let normal = new Three.Vector3(0, 0, 0)
    let yellow = new Three.Color("yellow")
    let red = new Three.Color("red")

    let square = (color, translateX=0, translateY=0) => {
      let s = new Three.Geometry()
      let materialIndex = color === red ? 1 : 0
      s.vertices[0] = new Three.Vector3(0 + translateX, 0 + translateY, 0)
      s.vertices[1] = new Three.Vector3(2 + translateX, 0 + translateY, 0)
      s.vertices[2] = new Three.Vector3(2 + translateX, -2 + translateY, 0)
      s.faces[0] = new Three.Face3(2, 1, 0, normal, color, materialIndex)
      s.vertices[3] = new Three.Vector3(0 + translateX, -2 + translateY, 0)
      s.faces[1] = new Three.Face3(3, 2, 0, normal, color, materialIndex)
      return s
    }

    let g = new Three.Geometry()
    g.merge(square(yellow))
    g.merge(square(red, 0, -2))
    g.merge(square(yellow, 2, -2))
    g.merge(square(red, 2, 0))

    let xTranslate = 4
    let yTranslate = -4
    let geometry = new Three.Geometry()
    for (let x=0; x < repeatX; x++) {
      for (let y=0; y < repeatY; y++) {
        geometry.merge(g.clone().translate(x * xTranslate, y * yTranslate, 0))
      }
    }
    geometry.computeBoundingBox()
    geometry.translate(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2, 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
  },
  hexagons: (repeatX, repeatY) => {
    let normal = new Three.Vector3(0, 0, 0)
    let red = new Three.Color("red")
    let blue = new Three.Color("blue")
    let yellow = new Three.Color("yellow")

    let triangle = (color, translateX=0, translateY=0) => {
      let t = new Three.Geometry()
      let materialIndex
      if (color === red) { materialIndex = 0 }
      else if (color === blue) { materialIndex = 1 }
      else if (color === yellow) { materialIndex = 2 }
      t.vertices[0] = new Three.Vector3(0 + translateX, 0 + translateY, 0)
      t.vertices[1] = new Three.Vector3(Math.sqrt(3) + translateX, 1 + translateY, 0)
      t.vertices[2] = new Three.Vector3(Math.sqrt(3) + translateX, -1 + translateY, 0)
      t.faces[0] = new Three.Face3(2, 1, 0, normal, color, materialIndex)
      return t
    }

    let hexagon = (color, translateX=0, translateY=0) => {
      let h = new Three.Geometry()
      let angle = 0
      for (let a=0; a < 6; a++) {
        let t = triangle(color)
        t.rotateZ(angle * (Math.PI/180))
        h.merge(t)
        angle += 60
      }
      return h
    }

    let xTranslate = 6 * Math.sqrt(3)
    let yTranslate = -6
    let geometry = new Three.Geometry()
    for (let x=0; x < repeatX; x++) {
      for (let y=0; y < repeatY; y++) {
        geometry.merge(hexagon(red).translate(x * xTranslate, y * yTranslate, 0))
        geometry.merge(hexagon(blue).translate(x * xTranslate + 2*Math.sqrt(3), y * yTranslate, 0)) 
        geometry.merge(hexagon(yellow).translate(x * xTranslate + 4*Math.sqrt(3), y * yTranslate, 0))
        geometry.merge(hexagon(yellow).translate(x * xTranslate + Math.sqrt(3), y * yTranslate - 3, 0))
        geometry.merge(hexagon(red).translate(x * xTranslate + 3*Math.sqrt(3), y * yTranslate - 3, 0))
        geometry.merge(hexagon(blue).translate(x * xTranslate + 5*Math.sqrt(3), y * yTranslate - 3, 0))
     }
    }
    geometry.computeBoundingBox()
    geometry.translate(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2, 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
  }
}

// Regular tiling polygons
// https://morphingtiling.wordpress.com/2010/12/27/regular-and-semi-regular-tilings/
const semiRegularTilingGeometry = Vue.prototype.$geometry.semiRegularTilingGeometry = {
  hexagonsTriangles: (repeatX=1, repeatY=1) => {
    let red = new Three.Color("red")
    let yellow = new Three.Color("yellow")
    let hexUnit = 1
    let hex = new Three.CircleGeometry(hexUnit, 6)
    let hexApothem = hexUnit * Math.cos((180*(Math.PI/180)) / 6)
    let hexSide = hexApothem * 2 * Math.tan((180*(Math.PI/180)) / 6)
    let triUnit = hexApothem * (2/3)
    let tri = new Three.CircleGeometry(triUnit, 3)
    let triApothem = triUnit * Math.cos((180*(Math.PI/180)) / 3)
    let triSide = triApothem * 2 * Math.tan((180*(Math.PI/180)) / 3)
    tri.rotateZ(-30 * (Math.PI/180))
    tri.translate(0, triApothem + hexApothem, 0)

    for(let f=0; f < hex.faces.length; f++) {
      hex.faces[f].color = red
      hex.faces[f].materialIndex = 0
    }
    for(let f=0; f < tri.faces.length; f++) {
      tri.faces[f].color = yellow
      tri.faces[f].materialIndex = 1
    }

    let g = new Three.Geometry()
    g.merge(hex)
    g.merge(tri.clone())
    g.merge(tri.clone().rotateZ(60 * (Math.PI/180)))
    g.merge(g.clone().translate(hexUnit, -2*hexApothem))

    let xTranslate = 2*hexUnit
    let yTranslate = -4*hexApothem
    let geometry = new Three.Geometry()
    for (let x=0; x < repeatX; x++) {
      for (let y=0; y < repeatY; y++) {
        geometry.merge(g.clone().translate(x * xTranslate, y * yTranslate, 0))
      }
    }
    geometry.computeBoundingBox()
    geometry.translate(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2, 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
  },
  trianglesSquares1: (repeatX=1, repeatY=1) => {
    let red = new Three.Color("red")
    let yellow = new Three.Color("yellow")
    let blue = new Three.Color("blue")
    let unitSide = 1
    let square = new Three.PlaneGeometry(unitSide, unitSide)
    square.translate(0.5*unitSide, 0.5*unitSide)
    let triUnit = unitSide / Math.sqrt(3)
    let triApothem = triUnit * Math.cos((180*(Math.PI/180)) / 3)
    let blueTri = new Three.CircleGeometry( triUnit, 3)
    blueTri.translate(triApothem,0.5*unitSide,0)
    let redTri = blueTri.clone()

    for(let f=0; f < square.faces.length; f++) {
      square.faces[f].color = yellow
      square.faces[f].materialIndex = 0
    }
    for(let f=0; f < blueTri.faces.length; f++) {
      blueTri.faces[f].color = blue
      blueTri.faces[f].materialIndex = 1
      redTri.faces[f].color = red
      redTri.faces[f].materialIndex = 2
    }

    let g = new Three.Geometry()
    g.merge(square)
    g.merge(redTri.clone().rotateZ(60 * (Math.PI/180)))
    g.merge(square.clone().rotateZ(150 * (Math.PI/180)))
    g.merge(redTri.clone().rotateZ(-90 * (Math.PI/180)))
    g.merge(blueTri.clone().rotateZ(-150 * (Math.PI/180)))
    g.merge(blueTri.clone().translate(unitSide,0,0))
    g.merge(redTri.clone().rotateZ(-60 * (Math.PI/180)).translate(unitSide,0,0))
    g.merge(square.clone().rotateZ(-120 * (Math.PI/180)).translate(unitSide, 0, 0))
    let p1 = pointOnCircle({x:unitSide, y:0}, unitSide, -30)
    g.merge(square.clone().translate(p1.x, p1.y, 0))
    g.merge(blueTri.clone().rotateZ(-90 * (Math.PI/180)).translate(p1.x, p1.y, 0))
    g.merge(redTri.clone().rotateZ(-150 * (Math.PI/180)).translate(p1.x, p1.y, 0))
    let p2 = pointOnCircle({x:0, y:0}, unitSide, -120)
    g.merge(square.clone().rotateZ(-90 * (Math.PI/180)).translate(p2.x, p2.y, 0))
    g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(p2.x, p2.y, 0))
    g.merge(blueTri.clone().rotateZ(120 * (Math.PI/180)).translate(p2.x, p2.y, 0))
    let p3 = pointOnCircle({x:0, y:0}, unitSide, -60)
    g.merge(blueTri.clone().rotateZ(-120 * (Math.PI/180)).translate(p3.x, p3.y, 0))
    let p4 = pointOnCircle(p2, unitSide, -90)
    g.merge(redTri.clone().rotateZ(-90 * (Math.PI/180)).translate(p4.x, p4.y, 0))
    g.merge(blueTri.clone().rotateZ(-150 * (Math.PI/180)).translate(p4.x, p4.y, 0))
    g.merge(square.clone().rotateZ(-210 * (Math.PI/180)).translate(p4.x, p4.y, 0))
    let p5 = pointOnCircle(p3, unitSide, -30)
    let p6 = pointOnCircle(p2, unitSide, -150 )
    let p7 = {x: p1.x + unitSide, y: p1.y}
    let p8 = pointOnCircle(p6, unitSide, -120)
    let p9 = {x: unitSide, y: unitSide}

    let translateDownRight = (new Three.Vector2(0, -1 * unitSide, 0)).add(new Three.Vector2(p5.x, p5.y))
    let translateUpRight = (new Three.Vector2(p7.x, p7.y)).sub(new Three.Vector2(p6.x, p6.y))
    let translateDownLeft = (new Three.Vector2(p8.x, p8.y)).sub(new Three.Vector2(p9.x, p9.y))

    let geometry = new Three.Geometry()
    let xPos = new Three.Vector2()
    for(let x=0; x < repeatX; x++) {
      if (x % 2 === 0) {
        xPos.add(translateUpRight)
      } else {
        xPos.add(translateDownRight)
      }
      geometry.merge(g.clone().translate(xPos.x, xPos.y, 0))
    }
    let xGeometry = geometry.clone()
    for(let y=1; y < repeatY; y++) {
      geometry.merge(xGeometry.clone().translate(y * translateDownLeft.x, y * translateDownLeft.y, 0))
    }

    geometry.computeBoundingBox()
    geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
  },
  trianglesSquares2: (repeatX=1, repeatY=1) => {
    let blue = new Three.Color("blue")
    let yellow = new Three.Color("yellow")
    let red = new Three.Color("red")
    let unitSide = 1
    let blueSquare = new Three.PlaneGeometry(unitSide, unitSide)
    blueSquare.translate(0.5*unitSide, 0.5*unitSide)
    let yellowSquare = blueSquare.clone()
    let redSquare = blueSquare.clone()
    let triUnit = unitSide / Math.sqrt(3)
    let triApothem = triUnit * Math.cos((180*(Math.PI/180)) / 3)
    let blueTri = new Three.CircleGeometry( triUnit, 3)
    blueTri.translate(triApothem,0.5*unitSide,0)
    let redTri = blueTri.clone()
    let yellowTri = blueTri.clone()

    for(let f=0; f < blueSquare.faces.length; f++) {
      blueSquare.faces[f].color = blue
      blueSquare.faces[f].materialIndex = 0
      yellowSquare.faces[f].color = yellow
      yellowSquare.faces[f].materialIndex = 1
      redSquare.faces[f].color = red
      redSquare.faces[f].materialIndex = 2
    }
    for(let f=0; f < blueTri.faces.length; f++) {
      blueTri.faces[f].color = blue
      blueTri.faces[f].materialIndex = 0
      yellowTri.faces[f].color = yellow
      yellowTri.faces[f].materialIndex = 1
      redTri.faces[f].color = red
      redTri.faces[f].materialIndex = 2
    }

    let g = new Three.Geometry()
    g.merge(blueSquare)
    g.merge(yellowSquare.clone().translate(unitSide, 0, 0))
    g.merge(redSquare.clone().translate(2 * unitSide, 0, 0))
    g.merge(redTri.clone().rotateZ(-90 * (Math.PI/180)))
    g.merge(yellowTri.clone().rotateZ(-150 * (Math.PI/180)).translate(unitSide, 0, 0))
    g.merge(blueTri.clone().rotateZ(-90 * (Math.PI/180)).translate(unitSide, 0, 0))
    g.merge(redTri.clone().rotateZ(-150 * (Math.PI/180)).translate(2*unitSide, 0, 0))
    g.merge(yellowTri.clone().rotateZ(-90 * (Math.PI/180)).translate(2*unitSide, 0, 0))
    g.merge(blueTri.clone().rotateZ(-150 * (Math.PI/180)).translate(3*unitSide, 0, 0))
    g.merge(g.clone().translate(0.5 * unitSide, (-1 * unitSide) - (unitSide * (Math.sqrt(3)/2)), 0))

    let geometry = new Three.Geometry()
    for(let x=0; x < repeatX; x++) {
      for(let y=0; y < repeatY; y++) {
        geometry.merge(g.clone().translate(x*3*unitSide + y*unitSide, y*(-2*unitSide - 2*unitSide*(Math.sqrt(3)/2)), 0))
      }
    }
    geometry.computeBoundingBox()
    geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
    return new Three.BufferGeometry().fromGeometry(geometry)
  }
}
