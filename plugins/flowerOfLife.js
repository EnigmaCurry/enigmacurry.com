import * as Three from 'three';
import Vue from 'vue';

//------------ flowerPattern --------------------------------------
// Construct the flower of life pattern as an array of Vector3(x,y,z=0)
// specifying the center of each circle.
// Args:
//    origin     - the coordinates of the center of the first circle.
//    unitRadius - the radius of the circles.
//    levels     - the number of levels to compute.
//                 Level 1 is the seed, with 7 circles. Level 2 is 19 etc.
//    rotation   - Rotate flower n degress
Vue.prototype.$flowerPattern = function(origin, unitRadius, levels, rotation=0) {
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
};
