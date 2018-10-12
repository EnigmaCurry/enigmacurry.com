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
          vertices: 12,
          unitRadius: 0.60 * (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight),
          pointRadius: 25,
          showPoly: true,
          showVertices: true,
          showLabels: true,
          labelRadiusOffset: 80,
          labelSize: 50,
          labelColor: 'white'
        }
      }
    }
  },
  methods: {
    init: function() {
      let labels = this._createSequentialLabels(this.params.geometry.vertices)
      let poly = this.polyClock()
      this.scene.add(poly)
    },
    polyClock(labels = []) {
      //this._labels can be specified in init or use this default:
      if (!this.params.geometry.showLabels) {
        labels = []
      }

      let params = {
        vertices: this.params.geometry.vertices,
        radius: this.params.geometry.unitRadius,
        showPoly: this.params.geometry.showPoly,
        showVertices: this.params.geometry.showVertices,
        labels: labels,
        labelRadius: this.params.geometry.unitRadius + this.params.geometry.labelRadiusOffset,
        labelSize: this.params.geometry.labelSize,
        labelColor: this.params.geometry.labelColor
      }
      return this.regularPolygon(
        params.vertices, params.radius, params.showPoly, params.showVertices, params.labels,
        params.labelRadius, params.labelSize, params.labelColor
      )
    },
    _createSequentialLabels: function(num, shift) {
      let seq = Array.apply(num, Array(num)).map(function(_,b) { return b + 1; })
      return this._shiftLabels(seq, shift)
    },
    _shiftLabels: function(seq, shift) {
      let labels = seq.slice()
      for(let x=0; x<shift; x++) {
          labels.push(labels.shift())
      }
      return labels
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
    regularPolygon: function(vertices, radius, showPoly=true,
                             showVertices=true, labels=[], labelRadius,
                             labelSize, labelColor) {
      let group = new Three.Group()
      // Polygon
      let poly = new Three.CircleGeometry( radius, vertices )
      poly.vertices.shift()
      poly.rotateY(Math.PI)
      let polyMaterial = new Three.LineBasicMaterial()
      let mesh = new Three.LineLoop(poly, polyMaterial)
      if (showPoly) {
        group.add(mesh)
      }
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
