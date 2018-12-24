import * as Three from 'three';
import Vue from 'vue';
import assert from 'assert'
import * as math from 'mathjs'
import {$geometry} from '~/plugins/geometry.js'
import {reject} from 'underscore'

const $tilings = Vue.prototype.$tilings = {}
export {
  $tilings
}

class TilingGroup {
  //Maintain a group of tiling meshes
  //Add new meshes to fill the frustrum plane, remove meshes that are outside these dimensions
  constructor({tileType, frustrum={left:-10, right: 10, top: 10, bottom: -10}, showFrustrum=true, materials=null}) {
    this.group = new Three.Group()
    this.tiles = []
    this.frustrum = frustrum
    this.showFrustrum = showFrustrum
    this.tiling = $tilings.tilingGeometry[tileType](1, 1)
    this.tiling.geometry.computeBoundingBox()

    //Place initial tile:
    if (materials === null) {
      materials = new Three.MeshBasicMaterial({ vertexColors: Three.FaceColors, wireframe: false })
    }
    this.tileMesh = new Three.Mesh(this.tiling.geometry, materials)
    this.group.add(this.tileMesh)
    this.tiles.push(this.tileMesh)

    this.frustrumUpdate(frustrum)
  }

  scale(scale) {
    this.group.scale.copy(new Three.Vector3(0,0,0))
  }

  pan(x, y) {
    this.frustrum.left += x
    this.frustrum.right += x
    this.frustrum.top += y
    this.frustrum.bottom += y
    this.group.position.x -= x * this.group.scale.x
    this.group.position.y -= y * this.group.scale.y
    this.frustrumUpdate(this.frustrum)
  }

  frustrumUpdate(frustrum) {
    let uncheckedTiles = this.tiles.slice()

    const isPositionInside = (position) => {
      return (position.x >= frustrum.left - (this.tiling.geometry.boundingBox.max.x - this.tiling.geometry.boundingBox.min.x)
              && position.x < frustrum.right + (this.tiling.geometry.boundingBox.max.x - this.tiling.geometry.boundingBox.min.x)
              && position.y < frustrum.top + (this.tiling.geometry.boundingBox.max.y - this.tiling.geometry.boundingBox.min.y)
              && position.y >= frustrum.bottom - (this.tiling.geometry.boundingBox.max.y - this.tiling.geometry.boundingBox.min.y))
    }

    const doesTileExist = (position) => {
      let tolerance = 0.01
      for(let t=0; t < this.tiles.length; t++) {
        if (Math.abs(this.tiles[t].position.x - position.x) < tolerance
            && Math.abs(this.tiles[t].position.y - position.y) < tolerance) {
          return true
        }
      }
      return false
    }

    while(uncheckedTiles.length) {
      let tile = uncheckedTiles.pop()
      let translations = [
        tile.position.clone().add(this.tiling.translationX),
        tile.position.clone().sub(this.tiling.translationX),
        tile.position.clone().add(this.tiling.translationY),
        tile.position.clone().sub(this.tiling.translationY)
      ]
      for(let tr = 0; tr < translations.length; tr++){
        if (isPositionInside(translations[tr]) && !doesTileExist(translations[tr])) {
          let newTile = this.tileMesh.clone()
          newTile.position.x = translations[tr].x
          newTile.position.y = translations[tr].y
          this.tiles.push(newTile)
          this.group.add(newTile)
          uncheckedTiles.push(newTile)
        }
      }
      if (!isPositionInside(tile.position)) {
        this.tiles = reject(this.tiles, (el) => {return el === tile})
        this.group.remove(tile)
      }
    }

    if (this.showFrustrum) {
      this.drawFrustrum(frustrum)
    }
  }

  drawFrustrum(frustrum) {
    let frustrumGeometry = new Three.Geometry()
    frustrumGeometry.vertices.push(new Three.Vector3(frustrum.left, frustrum.top))
    frustrumGeometry.vertices.push(new Three.Vector3(frustrum.right, frustrum.top))
    frustrumGeometry.vertices.push(new Three.Vector3(frustrum.right, frustrum.bottom))
    frustrumGeometry.vertices.push(new Three.Vector3(frustrum.left, frustrum.bottom))
    frustrumGeometry.vertices.push(new Three.Vector3(frustrum.left, frustrum.top))
    let frustrumMaterial = new Three.LineBasicMaterial({ color: 'white', linewidth: 4 })
    if (typeof(this.frustrumMesh) != "undefined") {
      this.group.remove(this.frustrumMesh)
    }
    this.frustrumMesh = new Three.Line(frustrumGeometry, frustrumMaterial)
    this.group.add(this.frustrumMesh)
  }
}

$tilings.TilingGroup = TilingGroup


// Regular tiling polygons
// https://morphingtiling.wordpress.com/2010/12/27/regular-and-semi-regular-tilings/
$tilings.tilingGeometry = { }

$tilings.tilingGeometry.triangular = (repeatX=1, repeatY=1) => {
  let normal = new Three.Vector3(0, 0, 1)
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
  let centerTrans = new Three.Vector2(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2)
  geometry.translate(centerTrans.x, centerTrans.y, 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(repeatX * xTranslate, 0, 0),
    translationY: new Three.Vector3(0, repeatY * yTranslate, 0)
  }
}

$tilings.tilingGeometry.square = (repeatX=1, repeatY=1) => {
  let normal = new Three.Vector3(0, 0, 1)
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
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(repeatX * xTranslate, 0, 0),
    translationY: new Three.Vector3(0,  repeatY * yTranslate, 0)
  }
}

$tilings.tilingGeometry.hexagonal = (repeatX, repeatY) => {
  let normal = new Three.Vector3(0, 0, 1)
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
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(repeatX * xTranslate, 0, 0),
    translationY: new Three.Vector3(0, repeatY * yTranslate, 0)
  }
}

// Regular tiling polygons
// https://morphingtiling.wordpress.com/2010/12/27/regular-and-semi-regular-tilings/

$tilings.tilingGeometry.snubSquare = (repeatX=1, repeatY=1) => {
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
  let p1 = $geometry.pointOnCircle({x:unitSide, y:0}, unitSide, -30)
  g.merge(square.clone().translate(p1.x, p1.y, 0))
  g.merge(blueTri.clone().rotateZ(-90 * (Math.PI/180)).translate(p1.x, p1.y, 0))
  g.merge(redTri.clone().rotateZ(-150 * (Math.PI/180)).translate(p1.x, p1.y, 0))
  let p2 = $geometry.pointOnCircle({x:0, y:0}, unitSide, -120)
  g.merge(square.clone().rotateZ(-90 * (Math.PI/180)).translate(p2.x, p2.y, 0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(p2.x, p2.y, 0))
  g.merge(blueTri.clone().rotateZ(120 * (Math.PI/180)).translate(p2.x, p2.y, 0))
  let p3 = $geometry.pointOnCircle({x:0, y:0}, unitSide, -60)
  g.merge(blueTri.clone().rotateZ(-120 * (Math.PI/180)).translate(p3.x, p3.y, 0))
  let p4 = $geometry.pointOnCircle(p2, unitSide, -90)
  g.merge(redTri.clone().rotateZ(-90 * (Math.PI/180)).translate(p4.x, p4.y, 0))
  g.merge(blueTri.clone().rotateZ(-150 * (Math.PI/180)).translate(p4.x, p4.y, 0))
  g.merge(square.clone().rotateZ(-210 * (Math.PI/180)).translate(p4.x, p4.y, 0))
  let p5 = $geometry.pointOnCircle(p3, unitSide, -30)
  let p6 = $geometry.pointOnCircle(p2, unitSide, -150 )
  let p7 = {x: p1.x + unitSide, y: p1.y}
  let p8 = $geometry.pointOnCircle(p6, unitSide, -120)
  let p9 = {x: unitSide, y: unitSide}

  let translateDownRight = (new Three.Vector3(0, -1 * unitSide, 0)).add(new Three.Vector3(p5.x, p5.y, 0))
  let translateUpRight = (new Three.Vector3(p7.x, p7.y, 0)).sub(new Three.Vector3(p6.x, p6.y, 0))
  let translateDownLeft = (new Three.Vector3(p8.x, p8.y, 0)).sub(new Three.Vector3(p9.x, p9.y, 0))

  let geometry = new Three.Geometry()

  let xPos = new Three.Vector2()
  for(let x=0; x < repeatX; x++) {
    //mod4 makes the top edge a little straighter..
    if (x % 4 === 0) {
      xPos.add(translateDownRight)
    } else {
      xPos.add(translateUpRight)
    }
    geometry.merge(g.clone().translate(xPos.x, xPos.y, 0))
  }
  let xGeometry = geometry.clone()
  for(let y=1; y < repeatY; y++) {
    geometry.merge(xGeometry.clone().translate(y * translateDownLeft.x, y * translateDownLeft.y, 0))
  }

  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: translateUpRight,
    translationY: translateDownRight,
  }
}

$tilings.tilingGeometry.elongatedTriangular = (repeatX=1, repeatY=1) => {
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

  let geometry = new Three.Geometry()
  for(let x=0; x < repeatX; x++) {
    for(let y=0; y < repeatY; y++) {
      let xTrans = x*3*unitSide + (y%6)*0.5*unitSide
      let yTrans = y * (-1*unitSide - 1*unitSide*(Math.sqrt(3)/2))
      geometry.merge(g.clone().translate(xTrans, yTrans, 0))
    }
  }
  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(3*unitSide, 0, 0),
    translationY: new Three.Vector3(0.5 *unitSide, -1*unitSide - unitSide*(Math.sqrt(3)/2), 0)
  }
}

$tilings.tilingGeometry.truncatedSquare = (repeatX=1, repeatY=1) => {
  let red = new Three.Color("red")
  let yellow = new Three.Color("yellow")
  let blue = new Three.Color("blue")

  let unitSide = 1
  let blueSquare = new Three.PlaneGeometry(unitSide, unitSide)
  let octagonRadius = unitSide / (2*Math.sin(180 * (Math.PI/180) / 8))
  let octagonApothem = octagonRadius * Math.cos(180 * (Math.PI/180) / 8)
  let redOctagon = new Three.CircleGeometry(octagonRadius, 8)
  redOctagon.rotateZ(22.5 * (Math.PI/180))
  let yellowOctagon = redOctagon.clone()

  for(let f=0; f < blueSquare.faces.length; f++) {
    blueSquare.faces[f].color = blue
    blueSquare.faces[f].materialIndex = 0
  }
  for(let f=0; f < redOctagon.faces.length; f++) {
    redOctagon.faces[f].color = red
    redOctagon.faces[f].materialIndex = 1
    yellowOctagon.faces[f].color = yellow
    yellowOctagon.faces[f].materialIndex = 2
  }

  let g = new Three.Geometry()
  g.merge(redOctagon)
  g.merge(blueSquare.clone().translate(octagonApothem + 0.5 * unitSide, 0, 0))
  g.merge(blueSquare.clone().translate(0, -1 * (octagonApothem + 0.5 * unitSide), 0))
  g.merge(yellowOctagon.clone().translate(octagonApothem + 0.5 * unitSide, (-0.5 * unitSide) + (-1 * octagonApothem), 0))

  let geometry = new Three.Geometry()
  for(let x=0; x < repeatX; x++) {
    geometry.merge(g.clone().translate(x * (2 * octagonApothem + unitSide), 0, 0))
  }
  let geometryX = geometry.clone()
  for(let y=1; y < repeatY; y++) {
    geometry.merge(geometryX.clone().translate(0, -1 * y * (2 * octagonApothem + unitSide), 0))
  }
  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(2 * octagonApothem + unitSide, 0, 0),
    translationY: new Three.Vector3(0, -1 * (2 * octagonApothem + unitSide), 0)
  }
}

$tilings.tilingGeometry.triHexagonal = (repeatX=1, repeatY=1) => {
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
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(xTranslate, 0, 0),
    translationY: new Three.Vector3(0, yTranslate, 0)
  }
}

$tilings.tilingGeometry.snubHexagonal1 = (repeatX=1, repeatY=1, flipNormals=false) => {
  let red = new Three.Color("red")
  let yellow = new Three.Color("yellow")
  let blue = new Three.Color("blue")
  let unitSide = 1
  let hex = new Three.CircleGeometry(unitSide, 6)
  let hexApothem = unitSide * Math.cos((180*(Math.PI/180)) / 6)
  let hexSide = hexApothem * 2 * Math.tan((180*(Math.PI/180)) / 6)
  let triUnit = hexApothem * (2/3)
  let blueTri = new Three.CircleGeometry(triUnit, 3)
  let triApothem = triUnit * Math.cos((180*(Math.PI/180)) / 3)
  let triSide = triApothem * 2 * Math.tan((180*(Math.PI/180)) / 3)
  blueTri.rotateZ(-30 * (Math.PI/180))
  blueTri.translate(0.5 * unitSide, triApothem, 0)
  let redTri = blueTri.clone()

  for(let f=0; f < hex.faces.length; f++) {
    hex.faces[f].color = yellow
    hex.faces[f].materialIndex = 0
  }
  for(let f=0; f < blueTri.faces.length; f++) {
    blueTri.faces[f].color = blue
    blueTri.faces[f].materialIndex = 1
    redTri.faces[f].color = red
    redTri.faces[f].materialIndex = 2
  }

  let g = new Three.Geometry()
  g.merge(hex)
  g.merge(blueTri.clone().translate(1 * unitSide, 0,0))
  g.merge(redTri.clone().rotateZ(60 * (Math.PI/180)).translate(1 * unitSide, 0, 0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(2 * unitSide, 0, 0))
  g.merge(blueTri.clone().rotateZ(240 * (Math.PI/180)).translate(1 * unitSide, 0, 0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(0.5 * unitSide, -1 * hexApothem,0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(1.5 * unitSide, -1 * hexApothem,0))
  g.merge(blueTri.clone().rotateZ(240 * (Math.PI/180)).translate(-0.5 * unitSide, -1 * hexApothem, 0))
  g.merge(blueTri.clone().rotateZ(240 * (Math.PI/180)).translate(0.5 * unitSide, -1 * hexApothem, 0))

  g.merge(hex.clone().translate(-0.5 * unitSide, -3 * hexApothem,0))
  g.merge(blueTri.clone().rotateZ(120 * (Math.PI/180)).translate(1.5 * unitSide, -3 * hexApothem,0))
  g.merge(redTri.clone().rotateZ(60 * (Math.PI/180)).translate(0.5 * unitSide, -3 * hexApothem,0))
  g.merge(blueTri.clone().rotateZ(0 * (Math.PI/180)).translate(0, -4 * hexApothem, 0))
  g.merge(redTri.clone().rotateZ(60 * (Math.PI/180)).translate(1 * unitSide, -4 * hexApothem, 0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(1 * unitSide, -4 * hexApothem, 0))

  g.merge(hex.clone().translate(2*unitSide,-2*hexApothem,0))
  g.merge(blueTri.clone().translate(1.5*unitSide,-1*hexApothem,0))
  g.merge(blueTri.clone().translate(2.5*unitSide,-1*hexApothem,0))
  g.merge(redTri.clone().rotateZ(60 * (Math.PI/180)).translate(2.5*unitSide,-1*hexApothem,0))
  g.merge(redTri.clone().rotateZ(-60 * (Math.PI/180)).translate(2.5*unitSide,-1*hexApothem,0))
  g.merge(blueTri.clone().translate(3*unitSide,-2*hexApothem,0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(4*unitSide,-2*hexApothem,0))
  g.merge(blueTri.clone().translate(2.5*unitSide,-3*hexApothem,0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(2.5*unitSide,-3*hexApothem,0))
  g.merge(redTri.clone().rotateZ(180 * (Math.PI/180)).translate(3.5*unitSide,-3*hexApothem,0))
  g.merge(blueTri.clone().translate(2*unitSide,-4*hexApothem,0))
  g.merge(blueTri.clone().translate(1*unitSide,-4*hexApothem,0))

  let geometry = new Three.Geometry()
  for (let y=0; y < repeatY; y++) {
    geometry.merge(g.clone().translate(y * 1.5 * unitSide, y * -5 * hexApothem, 0))
  }
  let geometryY = geometry.clone()
  for (let x=1; x < repeatX; x++) {
    geometry.merge(geometryY.clone().translate(x * 4.5 * unitSide, x * -1 * hexApothem, 0))
  }
  geometry.computeBoundingBox()
  geometry.translate(-1 * geometry.boundingBox.max.x / 2, -1 * geometry.boundingBox.min.y / 2, 0)
  if(flipNormals) {
    for(let f=0; f < geometry.faces.length; f++) {
      let face = geometry.faces[f]
      let temp = face.a
      face.a = face.c
      face.c = temp
    }
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    let faceVertexUvs = geometry.faceVertexUvs[0]
    for(let i = 0; i < faceVertexUvs.length; i++) {
      let temp = faceVertexUvs[i][0]
      faceVertexUvs[i][0] = faceVertexUvs[i][2]
      faceVertexUvs[i][2] = temp
    }
  }
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(4.5 * unitSide, -1 * hexApothem, 0),
    translationY: new Three.Vector3(1.5 * unitSide, -5 * hexApothem, 0),
  }
}

$tilings.tilingGeometry.snubHexagonal2 = (repeatX=1, repeatY=1) => {
  let tiling = $tilings.tilingGeometry.snubHexagonal1(repeatX, repeatY, true) //flips normals
  tiling.geometry.rotateX(Math.PI)
  return {
    geometry: tiling.geometry,
    translationX: new Three.Vector3(-tiling.translationX.x, tiling.translationX.y, 0),
    translationY: new Three.Vector3(-tiling.translationY.x, tiling.translationY.y, 0)
  }
}

$tilings.tilingGeometry.rhombiTriHexagonal = (repeatX=1, repeatY=1) => {
  let red = new Three.Color("red")
  let blue = new Three.Color("blue")
  let yellow = new Three.Color("yellow")
  let unitSide = 1
  let hex = new Three.CircleGeometry(unitSide, 6)
  let hexApothem = unitSide * Math.cos((180*(Math.PI/180)) / 6)
  let hexSide = hexApothem * 2 * Math.tan((180*(Math.PI/180)) / 6)
  let square = new Three.PlaneGeometry(unitSide, unitSide)
  square.translate(0.5*unitSide, 0.5*unitSide)
  let triUnit = hexApothem * (2/3)
  let tri = new Three.CircleGeometry(triUnit, 3)
  let triApothem = triUnit * Math.cos((180*(Math.PI/180)) / 3)
  let triSide = triApothem * 2 * Math.tan((180*(Math.PI/180)) / 3)
  tri.rotateZ(-30 * (Math.PI/180))
  tri.translate(0.5 * unitSide, triApothem, 0)

  for(let f=0; f < hex.faces.length; f++) {
    hex.faces[f].color = red
    hex.faces[f].materialIndex = 0
  }
  for(let f=0; f < square.faces.length; f++) {
    square.faces[f].color = blue
    square.faces[f].materialIndex = 1
  }
  for(let f=0; f < tri.faces.length; f++) {
    tri.faces[f].color = yellow
    tri.faces[f].materialIndex = 2
  }

  let g = new Three.Geometry()
  g.merge(hex)
  g.merge(tri.clone().rotateZ(-30 * (Math.PI/180)).translate(unitSide,0,0))
  g.merge(tri.clone().rotateZ(150 * (Math.PI/180)).translate(-unitSide,0,0))
  g.merge(square.clone().rotateZ(60 * (Math.PI/180)).translate(-unitSide,0,0))
  g.merge(square.clone().rotateZ(30 * (Math.PI/180)).translate(unitSide,0,0))
  g.merge(square.clone().rotateZ(-120 * (Math.PI/180)).translate(unitSide,0,0))
  g.merge(square.clone().rotateZ(-150 * (Math.PI/180)).translate(-unitSide,0,0))
  g.merge(square.clone().translate(-0.5 * unitSide, -1*hexApothem-unitSide, 0))
  g.merge(tri.clone().rotateZ(-150 * (Math.PI/180)).translate(-0.5*unitSide, -1*hexApothem,0))
  g.merge(tri.clone().rotateZ(-90 * (Math.PI/180)).translate(0.5*unitSide, -1*hexApothem,0))
  g.merge(square.clone().translate(unitSide+hexApothem,-0.5*unitSide,0))
  g.merge(square.clone().translate(-2*unitSide-hexApothem,-0.5*unitSide,0))
  g.merge(tri.clone().rotateZ(90 * (Math.PI/180)).translate(-2*unitSide-hexApothem,-0.5*unitSide,0))
  g.merge(square.clone().rotateZ(150 * (Math.PI/180)).translate(-2*unitSide-hexApothem,-0.5*unitSide,0))
  g.merge(square.clone().rotateZ(120 * (Math.PI/180)).translate(-2*unitSide-hexApothem,-0.5*unitSide-2*hexApothem,0))
  g.merge(tri.clone().rotateZ(210 * (Math.PI/180)).translate(-2*unitSide-hexApothem,-0.5*unitSide-2*hexApothem,0))
  g.merge(tri.clone().rotateZ(150 * (Math.PI/180)).translate(-2.5*unitSide-hexApothem,-1*hexApothem-0.5*unitSide,0))
  g.merge(hex.clone().translate(-1*hexApothem-1.5*unitSide, -1*hexApothem - 0.5*unitSide))
  g.merge(hex.clone().translate(1*hexApothem+1.5*unitSide, -1*hexApothem - 0.5*unitSide))
  g.merge(square.clone().rotateZ(-120 * (Math.PI/180)).translate(-0.5*unitSide-1*hexApothem,-1*hexApothem-0.5*unitSide,0))
  g.merge(square.clone().rotateZ(-150 * (Math.PI/180)).translate(0.5*unitSide+1*hexApothem,-1*hexApothem-0.5*unitSide,0))
  g.merge(hex.clone().translate(0, -2*hexApothem-unitSide,0))
  g.merge(square.clone().translate(-2*unitSide-hexApothem, -2*hexApothem-1.5*unitSide,0))
  g.merge(square.clone().translate(1*unitSide+hexApothem, -2*hexApothem-1.5*unitSide,0))
  g.merge(tri.clone().rotateZ(-30 * (Math.PI/180)).translate(unitSide, -2*hexApothem-unitSide))
  g.merge(tri.clone().rotateZ(150 * (Math.PI/180)).translate(-unitSide, -2*hexApothem-unitSide))
  g.merge(square.clone().rotateZ(-120 * (Math.PI/180)).translate(unitSide, -2*hexApothem-unitSide))
  g.merge(square.clone().rotateZ(-150 * (Math.PI/180)).translate(-unitSide, -2*hexApothem-unitSide))
  g.merge(square.clone().translate(-0.5*unitSide, -3*hexApothem-2*unitSide,0))
  g.merge(tri.clone().rotateZ(90 * (Math.PI/180)).translate(-0.5*unitSide, -3*hexApothem-2*unitSide,0))
  g.merge(tri.clone().rotateZ(30 * (Math.PI/180)).translate(0.5*unitSide, -3*hexApothem-2*unitSide,0))
  g.merge(hex.clone().translate(-1*hexApothem-1.5*unitSide, -3*hexApothem - 1.5*unitSide))
  g.merge(square.clone().rotateZ(60 * (Math.PI/180)).translate(-1*hexApothem-2.5*unitSide, -3*hexApothem - 1.5*unitSide))
  g.merge(square.clone().rotateZ(210 * (Math.PI/180)).translate(-1*hexApothem-2.5*unitSide, -3*hexApothem - 1.5*unitSide))
  g.merge(tri.clone().rotateZ(150 * (Math.PI/180)).translate(-1*hexApothem-2.5*unitSide, -3*hexApothem - 1.5*unitSide))
  g.merge(hex.clone().translate(1*hexApothem+1.5*unitSide, -3*hexApothem - 1.5*unitSide))

  let geometry = new Three.Geometry()
  for(let y=0; y < repeatY; y++) {
    geometry.merge(g.clone().translate(0, y * (-4*hexApothem-2*unitSide), 0))
  }
  let geometryY = geometry.clone()
  for(let x=1; x < repeatX; x++) {
    geometry.merge(geometryY.clone().translate(x * (4.5*unitSide+3*hexApothem), (x%2) * (-0.5 * unitSide - hexApothem),0))
  }

  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(4.5*unitSide+3*hexApothem, -0.5 * unitSide - hexApothem),
    translationY: new Three.Vector3(0, -4*hexApothem-2*unitSide, 0)
  }
}

$tilings.tilingGeometry.truncatedTriHexagonal = (repeatX=1, repeatY=1) => {
  let red = new Three.Color("red")
  let blue = new Three.Color("blue")
  let yellow = new Three.Color("yellow")
  let unitSide = 1

  let dodecaRadius = unitSide / (2*Math.sin(180 * (Math.PI/180) / 12))
  let dodecaApothem = dodecaRadius * Math.cos(180 * (Math.PI/180) / 12)
  let dodeca = new Three.CircleGeometry(dodecaRadius, 12)
  dodeca.rotateZ(15 * (Math.PI/180))
  let hexRadius = unitSide / (2*Math.sin(180 * (Math.PI/180) / 6))
  let hexApothem = hexRadius * Math.cos(180 * (Math.PI/180) / 6)
  let hex = new Three.CircleGeometry(hexRadius, 6)
  let square = new Three.PlaneGeometry(unitSide, unitSide)


  for(let f=0; f < dodeca.faces.length; f++) {
    dodeca.faces[f].color = red
    dodeca.faces[f].materialIndex = 0
  }
  for(let f=0; f < square.faces.length; f++) {
    square.faces[f].color = blue
    square.faces[f].materialIndex = 1
  }
  for(let f=0; f < hex.faces.length; f++) {
    hex.faces[f].color = yellow
    hex.faces[f].materialIndex = 2
  }


  let g = new Three.Geometry()
  g.merge(dodeca)
  let s1 = square.clone().translate(0,dodecaApothem+0.5*unitSide,0)
  g.merge(s1)
  g.merge(s1.clone().rotateZ(60 * (Math.PI/180)))
  g.merge(s1.clone().rotateZ(120 * (Math.PI/180)))
  g.merge(s1.clone().rotateZ(180 * (Math.PI/180)))
  g.merge(s1.clone().rotateZ(240 * (Math.PI/180)))
  g.merge(s1.clone().rotateZ(300 * (Math.PI/180)))
  let h1 = hex.clone().rotateZ(30 * (Math.PI/180)).translate(-1 * dodecaApothem - hexApothem,0,0)
  g.merge(h1)
  g.merge(h1.clone().rotateZ(60 * (Math.PI/180)))
  g.merge(h1.clone().rotateZ(120 * (Math.PI/180)))
  g.merge(h1.clone().rotateZ(180 * (Math.PI/180)))
  g.merge(h1.clone().rotateZ(240 * (Math.PI/180)))
  g.merge(h1.clone().rotateZ(300 * (Math.PI/180)))
  let d1 = dodeca.clone().translate(0,-2*dodecaApothem-unitSide,0)
  //g.merge(d1)
  //g.merge(d1.clone().rotateZ(60 * (Math.PI/180)))
  //g.merge(d1.clone().rotateZ(120 * (Math.PI/180)))
  g.merge(d1.clone().rotateZ(180 * (Math.PI/180)))
  g.merge(d1.clone().rotateZ(240 * (Math.PI/180)))
  g.merge(d1.clone().rotateZ(300 * (Math.PI/180)))
  let s2 = square.clone().translate(0.5*unitSide+dodecaApothem+2*hexApothem,0,0)
  //g.merge(s2)
  g.merge(s2.clone().rotateZ(60 * (Math.PI/180)))
  g.merge(s2.clone().rotateZ(120 * (Math.PI/180)))
  g.merge(s2.clone().rotateZ(180 * (Math.PI/180)))
  g.merge(s2.clone().rotateZ(240 * (Math.PI/180)))
  g.merge(s2.clone().rotateZ(300 * (Math.PI/180)))

  g.merge(square.clone().translate(-2*hexApothem-dodecaApothem-0.5*unitSide,-2*dodecaApothem-unitSide))
  g.merge(h1.clone().translate(-2*hexApothem-unitSide,0,0).rotateZ(60 * (Math.PI/180)))
  g.merge(h1.clone().translate(-2*hexApothem-unitSide,0,0).rotateZ(120 * (Math.PI/180)))

  let geometry = new Three.Geometry()
  for(let x=0; x < repeatX; x++) {
    for(let y=0; y < repeatY; y++) {
      geometry.merge(g.clone().translate(x*(2*dodecaApothem+4*hexApothem+unitSide),y*(-4*dodecaApothem-2*unitSide),0))
    }
  }

  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    translationX: new Three.Vector3(2*dodecaApothem+4*hexApothem+unitSide, 0, 0),
    translationY: new Three.Vector3(0, -4*dodecaApothem-2*unitSide, 0),
  }
}

$tilings.tilingGeometry.truncatedHexagonal = (repeatX=1, repeatY=1) => {
  let red = new Three.Color("red")
  let blue = new Three.Color("blue")
  let yellow = new Three.Color("yellow")
  let green = new Three.Color(0x00ff00)
  let unitSide = 1

  let dodecaRadius = unitSide / (2*Math.sin(180 * (Math.PI/180) / 12))
  let dodecaApothem = dodecaRadius * Math.cos(180 * (Math.PI/180) / 12)
  let redDodeca = new Three.CircleGeometry(dodecaRadius, 12)
  redDodeca.rotateZ(15 * (Math.PI/180))
  let blueDodeca = redDodeca.clone()
  let yellowDodeca = redDodeca.clone()
  let triRadius = unitSide / (2*Math.sin(180 * (Math.PI/180) / 3))
  let triApothem = triRadius * Math.cos(180 * (Math.PI/180) / 3)
  let tri = new Three.CircleGeometry(triRadius, 3)
  tri.rotateZ(-30 * (Math.PI/180)).translate(0,triApothem,0)

  for(let f=0; f < redDodeca.faces.length; f++) {
    redDodeca.faces[f].color = red
    blueDodeca.faces[f].color = blue
    yellowDodeca.faces[f].color = yellow
    redDodeca.faces[f].materialIndex = 0
    blueDodeca.faces[f].materialIndex = 1
    yellowDodeca.faces[f].materialIndex = 2
  }
  for(let f=0; f < tri.faces.length; f++) {
    tri.faces[f].color = green
    tri.faces[f].materialIndex = 3
  }

  let g = new Three.Geometry()
  g.merge(redDodeca)
  g.merge(yellowDodeca.clone().translate(2*dodecaApothem,0,0))
  g.merge(blueDodeca.clone().translate(-2*dodecaApothem,0,0))
  let t1 = tri.clone().translate(0,dodecaApothem)
  g.merge(t1)
  g.merge(t1.clone().rotateZ(60 * (Math.PI/180)))
  g.merge(t1.clone().rotateZ(-60 * (Math.PI/180)))
  g.merge(t1.clone().translate(2*dodecaApothem,0,0))
  g.merge(t1.clone().translate(2*dodecaApothem,0,0))
  g.merge(t1.clone().rotateZ(-60 * (Math.PI/180)).translate(2*dodecaApothem,0,0))
  g.merge(t1.clone().translate(-2*dodecaApothem,0,0))

  g.merge(g.clone().translate(-3*dodecaApothem,2*dodecaApothem-2*triApothem,0))

  let xTrans = 6 * dodecaApothem
  let yTrans = -1 * (4*dodecaApothem - 4*triApothem)
  let geometry = new Three.Geometry()
  for (let x=0; x < repeatX; x++) {
    for (let y=0; y < repeatY; y++) {
      geometry.merge(g.clone().translate(x*xTrans,y*yTrans,0))
    }
  }

  geometry.computeBoundingBox()
  geometry.translate(-1 * ((geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2), -1 * ((geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2), 0)
  return {
    geometry: new Three.BufferGeometry().fromGeometry(geometry),
    //TODO: Fix this translation:
    translationX: new Three.Vector3(xTrans, 0, 0),
    translationY: new Three.Vector3(0, yTrans, 0),
  }
}

