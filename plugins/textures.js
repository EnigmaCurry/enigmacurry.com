import * as Three from 'three'
import Vue from 'vue'

let kiteTexture = null
let dartTexture = null

let renderCanvas = (meshes, size=256, bgcolor="black") => {
  let canvas = document.createElement('canvas')
  let renderer = new Three.WebGLRenderer({canvas, antialias: true})
  renderer.setSize(size, size)
  renderer.setClearColor(bgcolor)

  let scene = new Three.Scene()
  let camera = new Three.OrthographicCamera(size / -2, size / 2, size / 2, size / -2, 1, 1000)
  camera.position.z = 10
  camera.lookAt(new Three.Vector3(0,0,0))

  for (let m=0; m < meshes.length; m++) {
    scene.add(meshes[m])
  }

  renderer.render(scene, camera)
  return canvas
}

Vue.prototype.$textures = {
  penroseKiteTexture: function(size=256, circleWidth=5, circleColor=0xff0000, bgcolor=0x332233, clearColor=0x660000) {
    // Memoize the texture:
    if(kiteTexture != null) {
      return kiteTexture
    }
    let meshes = []
    let circleMaterial = new Three.MeshBasicMaterial( { color: circleColor} )
    let insideMaterial = new Three.MeshBasicMaterial( { color: bgcolor} )

    let circle1Size = 0.25 * size
    let circle1Geometry = new Three.CircleGeometry( circle1Size, 512 )
    let inside1Geometry = new Three.CircleGeometry( circle1Size - circleWidth, 512 )
    let circle1 = new Three.Mesh( circle1Geometry, circleMaterial )
    let inside1 = new Three.Mesh( inside1Geometry, insideMaterial )
    circle1.position.x = inside1.position.x = 0
    meshes.push(circle1)
    meshes.push(inside1)

    let circle2Size = 0.48 * size
    let circle2Geometry = new Three.CircleGeometry( circle2Size, 512 )
    let inside2Geometry = new Three.CircleGeometry( circle2Size - circleWidth, 512 )
    let circle2 = new Three.Mesh( circle2Geometry, circleMaterial )
    let inside2 = new Three.Mesh( inside2Geometry, insideMaterial )
    circle2.position.y = inside2.position.y = -0.5 * size
    circle2.position.x = inside2.position.x = -0.5 * size
    meshes.push(circle2)
    meshes.push(inside2)

    let canvas = renderCanvas(meshes, size, clearColor ? clearColor : bgcolor)
    kiteTexture = new Three.CanvasTexture(canvas)
    return kiteTexture
  },
  penroseDartTexture: function(size=256, circleWidth=10, circleColor=0x00ff00, bgcolor=0x004400, clearColor=0x0033bb) {
    // Memoize the texture:
    if(dartTexture != null) {
      return dartTexture
    }
    let meshes = []
    let circleMaterial = new Three.MeshBasicMaterial( { color: circleColor} )
    let insideMaterial = new Three.MeshBasicMaterial( { color: bgcolor} )

    let circle1Size = 0.35 * size
    let circle1Geometry = new Three.CircleGeometry( circle1Size, 512 )
    let inside1Geometry = new Three.CircleGeometry( circle1Size - circleWidth, 512 )
    let circle1 = new Three.Mesh( circle1Geometry, circleMaterial )
    let inside1 = new Three.Mesh( inside1Geometry, insideMaterial )
    meshes.push(circle1)
    meshes.push(inside1)

    let circle2Size = 0.39 * size
    let circle2Geometry = new Three.CircleGeometry( circle2Size, 512 )
    let inside2Geometry = new Three.CircleGeometry( circle2Size - circleWidth, 512 )
    let circle2 = new Three.Mesh( circle2Geometry, circleMaterial )
    let inside2 = new Three.Mesh( inside2Geometry, insideMaterial )
    circle2.position.y = inside2.position.y = -0.5 * size
    circle2.position.x = inside2.position.x = -0.5 * size
    meshes.push(circle2)
    meshes.push(inside2)

    let canvas = renderCanvas(meshes, size, clearColor ? clearColor : bgcolor)
    dartTexture = new Three.CanvasTexture(canvas)
    return dartTexture
  }
}
