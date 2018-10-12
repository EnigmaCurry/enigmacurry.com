<script>
import * as Three from 'three'
import Scene from './Scene'
import Vue from 'vue'

export default Vue.extend({
  mixins: [Scene],
  data() {
    return {
      params: {
        animate: false,
        camera: {
          type: 'orthographic',
          position: {x:0, y:0, z:-5}
        },
        geometry: {
          vertices: 60,
          unitRadius: 0.60 * (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight),
          pointRadius: 25,
          showVertices: true,
          labelRadiusOffset: 80,
          labelSize: 50,
          labelColor: 'white'
        }
      }
    }
  },
  methods: {
    init: function() {
      let params = {
        vertices: this.params.geometry.vertices,
        radius: this.params.geometry.unitRadius,
        showVertices: this.params.geometry.showVertices,
        labels: this._createLabelSequence(this.params.geometry.vertices, (0.25*this.params.geometry.vertices)-1),
        labelRadius: this.params.geometry.unitRadius + this.params.geometry.labelRadiusOffset,
        labelSize: this.params.geometry.labelSize,
        labelColor: this.params.geometry.labelColor
      }
      let poly = this.regularPolygon(
        params.vertices, params.radius, params.showVertices, params.labels,
        params.labelRadius, params.labelSize, params.labelColor
      )
      this.scene.add(poly)
    },
    _createLabelSequence: function(num, shift) {
      let seq = Array.apply(num, Array(num)).map(function(_,b) { return b + 1; })
      for(let x=0; x<shift; x++) {
        seq.push(seq.shift())
      }
      return seq
    },
    canvasTextTexture: function(text, size=50, color='white') {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      context.font = "Bold " + size + "px Arial"
      context.fillStyle = color
      context.fillText(text, 0, 0.7*size)
      //context.fillRect(0,0,canvas.width,canvas.height)
      let texture = new Three.Texture(canvas)
      texture.needsUpdate = true
      let material = new Three.MeshBasicMaterial({ map: texture, side: Three.DoubleSide })
      material.transparent = true
      let mesh = new Three.Mesh(new Three.PlaneGeometry(canvas.width, canvas.height), material)
      mesh.rotation.z = this.camera.rotation.z
      mesh._canvasWidth = canvas.width
      mesh._canvasHeight = canvas.height
      return mesh
    },
    regularPolygon: function(vertices, radius, showVertices=true, labels=[], labelRadius, labelSize, labelColor) {
      let group = new Three.Group()
      // Polygon
      let poly = new Three.CircleGeometry( radius, vertices )
      poly.vertices.shift()
      poly.rotateY(Math.PI)
      let polyMaterial = new Three.LineBasicMaterial()
      let mesh = new Three.LineLoop(poly, polyMaterial)
      group.add(mesh)
      // Vertex points
      if (showVertices) {
        for (let v = 0; v < poly.vertices.length; v++) {
          let vec = poly.vertices[v]
          let point = new Three.CircleGeometry( this.params.geometry.pointRadius, 16 )
          let pointMaterial = new Three.MeshBasicMaterial({ color: 'red' })
          point.translate( vec.x, vec.y, vec.z )
          let mesh = new Three.Mesh( point, pointMaterial )
          group.add(mesh)
        }
      }
      // Labels
      let labelPoly = new Three.CircleGeometry(labelRadius ? labelRadius : radius, vertices)
      labelPoly.rotateY(Math.PI)
      labelPoly.vertices.shift()
      for (let l = 0; l < labels.length; l++) {
        if (l > vertices.length-1) {
          break
        }
        let vec = labelPoly.vertices[l]
        let text = this.canvasTextTexture(labels[l], labelSize, labelColor)
        text.position.set(vec.x - (0.5 * text._canvasWidth) + (0.45 * labelSize),
                          vec.y + (0.5 * text._canvasHeight) - (0.33 * labelSize)
                          , vec.z)
        group.add(text)
      }
      return group
    }
  }
})
</script>
