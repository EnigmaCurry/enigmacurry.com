import * as Three from 'three';
import "imports-loader?THREE=three!../node_modules/three/examples/js/loaders/SVGLoader"
import Vue from 'vue';
import assert from 'assert'
import * as math from 'mathjs'

const $graphics = Vue.prototype.$graphics = { }
export {
  $graphics
}

$graphics.svg = ({url, scale=1, center={x: 0, y:0}, callback}) => {
  const loader = new Three.SVGLoader()
	loader.load( url, ( paths ) => {
    const group = new Three.Group()
	  group.scale.multiplyScalar( scale )
	  group.scale.y *= - 1

		for ( var i = 0; i < paths.length; i ++ ) {
			const path = paths[ i ]
			const material = new Three.MeshBasicMaterial( {
				color: path.color,
				side: Three.DoubleSide,
				depthWrite: false
			} )
			const shapes = path.toShapes( true )
			for ( var j = 0; j < shapes.length; j ++ ) {
				const shape = shapes[ j ]
				const geometry = new Three.ShapeBufferGeometry( shape )
        geometry.translate(-1*center.x , -1*center.y, 0)
				const mesh = new Three.Mesh( geometry, material )
				group.add( mesh )
			}
		}
    callback(group)
	 })
}
