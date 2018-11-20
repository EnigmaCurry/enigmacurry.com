import * as Three from 'three';
import Vue from 'vue';

Vue.prototype.$penroseV1 = { }

const penroseV1KiteDimensions = (width=1) => {
  // If long pointy end is facing up, and the width is given, find the height.
  // Kite is made up of two golden triangles (left and right)
  // Divide the half kite into two right triangles and find the two bases:
  let B1 = 180 - 90 - 36
  let top = ((0.5 * width) * Math.sin(B1 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
  let B2 = 180 - 90 - 72
  let bottom = ((0.5 * width) * Math.sin(B2 * (Math.PI/180))) / Math.sin(72 * (Math.PI/180))
  return {top, bottom, height: top + bottom}
}

const penroseV1DartDimensions = (width=1) => {
  // If pointy end is up, and the width is given, find the height.
  // Dart is made of two golden gnomons (left and right)
  // Extend a gnomon to a right triangle to calculate the top side length:
  let A = 180 - 36 - 90
  let height = ((0.5 * width) * Math.sin(A * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
  let gnomonBase = ((0.5 * width) * Math.sin(90 * (Math.PI/180))) / Math.sin(36 * (Math.PI/180))
  let gnomonSide = (gnomonBase * Math.sin(36 * (Math.PI/180))) / Math.sin(108 * (Math.PI/180))
  return {height, gnomonBase, gnomonSide }
}

Vue.prototype.$penroseV1.penroseV1 = {
  kiteDimensions: penroseV1KiteDimensions,
  kite: (width=1, origin="top") => {
    let dimensions = penroseV1KiteDimensions(width)
    let geom = new Three.Geometry()
    geom.vertices.push(new Three.Vector3(0, dimensions.top, 0)) //top
    geom.vertices.push(new Three.Vector3(-0.5, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(0, -1 * dimensions.bottom, 0)) //bottom
    geom.vertices.push(new Three.Vector3(0.5, 0, 0)) //right
    geom.faces.push(new Three.Face3(0,1,2)) //left
    geom.faces.push(new Three.Face3(0,2,3)) //right
    if (origin === 'bottom') {
      geom.translate(0, dimensions.bottom, 0)
    } else if (origin === 'left') {
      geom.translate(0.5 * width, 0, 0)
    } else if (origin === 'right') {
      geom.translate(-0.5 * width, 0, 0)
    } else { //top
      geom.translate(0, -1 * dimensions.top, 0)
    }
    geom.computeFaceNormals()
    return geom
  },
  dartDimensions: penroseV1DartDimensions,
  dart: (width=1, origin="top") => {
    let dimensions = penroseV1DartDimensions(width)
    let geom = new Three.Geometry()

    geom.vertices.push(new Three.Vector3(0, dimensions.height, 0)) //top
    geom.vertices.push(new Three.Vector3(-0.5 * width, 0, 0)) //left
    geom.vertices.push(new Three.Vector3(0, dimensions.height - dimensions.gnomonSide, 0)) //bottom
    geom.vertices.push(new Three.Vector3(0.5 * width, 0, 0)) //right
    geom.faces.push(new Three.Face3(0,1,2))
    geom.faces.push(new Three.Face3(0,2,3))
    // Not sure why it's upside down, but for now, just rotate it:
    geom.rotateZ(Math.PI)

    if (origin === 'bottom') {
      geom.translate(0, dimensions.height - dimensions.gnomonSide, 0)
    } else if (origin === 'left') {
      geom.translate(-0.5 * width, 0, 0)
    } else if (origin === 'right') {
      geom.translate(0.5 * width, 0, 0)
    } else { //top
      geom.translate(0, dimensions.height, 0)
    }
    geom.computeFaceNormals()
    return geom
  }
}
