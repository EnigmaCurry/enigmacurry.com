import * as Three from 'three';
import Vue from 'vue';
import assert from 'assert'

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

Vue.prototype.$geometry.penrose = {
  dart: (width=1, origin="top") => {
    // If pointy end is up, and the width is given, find the height.
    // Dart is made of two golden gnomons (left and right)
    // Extend a gnomon to a right triangle to calculate the top side length:
    let A = 180 - 36 - 90
    let height = ((0.5 * width) * Math.sin(A * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonBase = ((0.5 * width) * Math.sin(90 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
    let gnomonSide = (gnomonBase * Math.sin(36 * (Math.PI/180))) / Math.sin(108 * (Math.PI/180))
    let geom = new Three.Geometry()

    geom.vertices.push(new Three.Vector3(0, height, 0)) //top
    geom.vertices.push(new Three.Vector3(-0.5 * width, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(0, height - gnomonSide, 0)) //bottom
    geom.vertices.push(new Three.Vector3(0.5 * width, 0, 0)) //right
    geom.faces.push(new Three.Face3(0,1,2))
    geom.faces.push(new Three.Face3(0,2,3))
    // Not sure why it's upside down, but for now, just rotate it:
    geom.rotateZ(Math.PI)

    if (origin === 'bottom') {
      geom.translate(0, height - gnomonSide, 0)
    } else if (origin === 'left') {
      geom.translate(-0.5 * width, 0, 0)
    } else if (origin === 'right') {
      geom.translate(0.5 * width, 0, 0)
    } else { //top
      geom.translate(0, height, 0)
    }
    geom.computeFaceNormals()
    return geom
  }
}
