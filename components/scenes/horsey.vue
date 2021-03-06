<template>
  <g-scene :obj="scene">
    <g-camera name="main" orthographic :zoomScale="zoom" />
    <g-grid :divisions="10" v-if="showGrid"/>
    <animation :fn="animate" />
  </g-scene>
</template>

<script>
import * as Three from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {shuffle} from 'underscore'
import testSVG from '~/assets/img/svg/horsey.svg'

export default {
  props: {
    animated: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    zoom: {type: Number, default: 0.8}
  },
  data() {
    return {
      scene: new Three.Scene(),
    }
  },
  created() {
    this.createScene()
  },
  methods: {
    animate() {
      this.tilingTexture.tilingGroup.pan(0.01,0.001)
      this.tilingTexture.renderer.render()
    },
    createScene() {
      const blanket = new Three.Group()
      const [width, height] = [1, 1.32]
      
      const borderWidth = 0.029
      const borderMaterial = new Three.MeshBasicMaterial({color:"red"})
      const border = new Three.Mesh(new Three.PlaneGeometry(width, height), borderMaterial)
      blanket.add(border)
      
      const redCheckerWidth = 0.18
      const redCheckerMaterial = new Three.MeshBasicMaterial({color: "#ffaaaa"})
      const redChecker = new Three.Mesh(new Three.PlaneGeometry(width - borderWidth, height - borderWidth), redCheckerMaterial)
      blanket.add(redChecker)
      
      const tileMaterials = [
        new Three.MeshBasicMaterial({color: 0x1212cc}),
        new Three.MeshBasicMaterial({color: 'white'}), 
        new Three.MeshBasicMaterial({color: 'black'}),
        new Three.MeshBasicMaterial({color: 'white'}),
      ]
      const tilingTexture = this.tilingTexture = this.$textures.tilingTexture({
        tileType: 'rhombiTriHexagonal', materials: tileMaterials, size: 512, scale: 16, tileFrustrumSize: 20})
      const blueCheckerMaterial = new Three.MeshBasicMaterial({map: tilingTexture.renderer.texture})
      const blueChecker = new Three.Mesh(new Three.PlaneGeometry(width - borderWidth - redCheckerWidth, height - borderWidth - redCheckerWidth), blueCheckerMaterial)
      for (let f=0; f < blueChecker.geometry.faces.length; f++) {
        const uvs = blueChecker.geometry.faceVertexUvs[0][f]
        for (let u=0; u < uvs.length; u++){
          uvs[u].x = uvs[u].x * (1/height)
          console.log(uvs[u])
        }
      }
      blanket.add(blueChecker)
      
      const yellowSquareWidth = redCheckerWidth / 2
      const yellowMaterial = new Three.MeshBasicMaterial({color: "yellow"})
      const yellowSquare1 = new Three.Mesh(new Three.PlaneGeometry(yellowSquareWidth, yellowSquareWidth), yellowMaterial)
      yellowSquare1.position.x = -1 * width/2 + yellowSquareWidth/2 + borderWidth/2
      yellowSquare1.position.y = height/2 - yellowSquareWidth/2 - borderWidth/2
      blanket.add(yellowSquare1)
      const yellowSquare2 = new Three.Mesh(new Three.PlaneGeometry(yellowSquareWidth, yellowSquareWidth), yellowMaterial)
      yellowSquare2.position.x = width/2 - yellowSquareWidth/2 - borderWidth/2
      yellowSquare2.position.y = height/2 - yellowSquareWidth/2 - borderWidth/2
      blanket.add(yellowSquare2)
      const yellowSquare3 = new Three.Mesh(new Three.PlaneGeometry(yellowSquareWidth, yellowSquareWidth), yellowMaterial)
      yellowSquare3.position.x = -1 * width/2 + yellowSquareWidth/2 + borderWidth/2
      yellowSquare3.position.y = -1 * height/2 + yellowSquareWidth/2 + borderWidth/2
      blanket.add(yellowSquare3)
      const yellowSquare4 = new Three.Mesh(new Three.PlaneGeometry(yellowSquareWidth, yellowSquareWidth), yellowMaterial)
      yellowSquare4.position.x = width/2 - yellowSquareWidth/2 - borderWidth/2
      yellowSquare4.position.y = -1 * height/2 + yellowSquareWidth/2 + borderWidth/2
      blanket.add(yellowSquare4)
      
      const heartGeometry = (scale) => {
        const heartShape = new Three.Shape()
        heartShape.moveTo( 5 * scale, 5 * scale )
        heartShape.bezierCurveTo( 5 * scale, 5 * scale, 4 * scale, 0, 0, 0 )
        heartShape.bezierCurveTo( -6 * scale, 0, -6 * scale, 7 * scale, -6 * scale, 7 * scale )
        heartShape.bezierCurveTo( -6 * scale, 11 * scale, -3 * scale, 15.4 * scale, 5 * scale, 19 * scale )
        heartShape.bezierCurveTo( 12 * scale, 15.4 * scale, 16 * scale, 11 * scale, 16 * scale, 7 * scale )
        heartShape.bezierCurveTo( 16 * scale, 7 * scale, 16 * scale, 0, 10 * scale, 0 )
        heartShape.bezierCurveTo( 7 * scale, 0, 5 * scale, 5 * scale, 5 * scale, 5 * scale )
        const heartGeometry = new Three.ShapeGeometry(heartShape)
        heartGeometry.translate(scale * -5, scale * -8, 0)
        heartGeometry.rotateZ(Math.PI)
        return heartGeometry
      }
      
      const heart = new Three.Group()
      const heartMaterial = new Three.MeshBasicMaterial({color: "#0000ff"})
      const heartBorder = new Three.Mesh(heartGeometry(0.0038), borderMaterial)
      heartBorder.renderOrder = 1
      const heartInner = new Three.Mesh(heartGeometry(0.0035), heartMaterial)
      heartInner.renderOrder = 2
      heart.add(heartBorder)
      heart.add(heartInner)
      
      const heart1 = heart.clone()
      heart1.position.x = yellowSquare1.position.x
      heart1.position.y = yellowSquare1.position.y
      blanket.add(heart1)
      const heart2 = heart.clone()
      heart2.position.x = yellowSquare2.position.x
      heart2.position.y = yellowSquare2.position.y
      blanket.add(heart2)
      const heart3 = heart.clone()
      heart3.position.x = yellowSquare3.position.x
      heart3.position.y = yellowSquare3.position.y
      blanket.add(heart3)
      const heart4 = heart.clone()
      heart4.position.x = yellowSquare4.position.x
      heart4.position.y = yellowSquare4.position.y
      blanket.add(heart4)
      
      this.$graphics.svg({
        url: testSVG,
        scale: 0.01,
        center: new Three.Vector2(100,145),
        callback: (group) => {
          this.scene.add(group)
        }
      })

      this.scene.add(blanket)
    }
  },
}
</script>
