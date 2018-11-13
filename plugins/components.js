import Vue from 'vue'

import GRenderer from '~/components/geometry/GRenderer.vue'
import GCamera from '~/components/geometry/GCamera.vue'
import GLight from '~/components/geometry/GLight.vue'
import GGeometry from '~/components/geometry/GGeometry.vue'
import GGrid from '~/components/geometry/GGrid.vue'
Vue.component('g-renderer', GRenderer)
Vue.component('g-camera', GCamera)
Vue.component('g-light', GLight)
Vue.component('g-geometry', GGeometry)
Vue.component('g-grid', GGrid)

import GTetrahedron from '~/components/geometry/GTetrahedron.vue'
import GCube from '~/components/geometry/GCube.vue'
import GOctahedron from '~/components/geometry/GOctahedron.vue'
import GDodecahedron from '~/components/geometry/GDodecahedron.vue'
import GIcosahedron from '~/components/geometry/GIcosahedron.vue'
Vue.component('g-tetrahedron', GTetrahedron)
Vue.component('g-cube', GCube)
Vue.component('g-octahedron', GOctahedron)
Vue.component('g-dodecahedron', GDodecahedron)
Vue.component('g-icosahedron', GIcosahedron)

import GWireframeMaterial from '~/components/geometry/GWireframeMaterial.vue'
Vue.component('g-wireframe-material', GWireframeMaterial)

import GFlower from '~/components/geometry/GFlower.vue'
Vue.component('g-flower', GFlower)

import GPenroseKite from '~/components/geometry/GPenroseKite.vue'
import GPenroseDart from '~/components/geometry/GPenroseDart.vue'
import GPenroseSun from '~/components/geometry/GPenroseSun.vue'
import GPenroseStar from '~/components/geometry/GPenroseStar.vue'
Vue.component('g-penrose-kite', GPenroseKite)
Vue.component('g-penrose-dart', GPenroseDart)
Vue.component('g-penrose-sun', GPenroseSun)
Vue.component('g-penrose-star', GPenroseStar)
