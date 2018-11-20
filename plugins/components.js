import Vue from 'vue'

import GRenderer from '~/components/geometry/GRenderer.vue'
import GObject3D from '~/components/geometry/GObject3D.vue'
import GCamera from '~/components/geometry/GCamera.vue'
import GLight from '~/components/geometry/GLight.vue'
import GMesh from '~/components/geometry/GMesh.vue'
import GGeometry from '~/components/geometry/GGeometry.vue'
import GGrid from '~/components/geometry/GGrid.vue'
import GGroup from '~/components/geometry/GGroup.vue'
Vue.component('g-renderer', GRenderer)
Vue.component('g-object-3D', GObject3D)
Vue.component('g-camera', GCamera)
Vue.component('g-light', GLight)
Vue.component('g-mesh', GMesh)
Vue.component('g-geometry', GGeometry)
Vue.component('g-grid', GGrid)
Vue.component('g-group', GGroup)

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


// PenroseV1 tiles
import GPenroseGeometry from '~/components/geometry/penrose-v1/GPenroseGeometry.vue'
import GPenroseKite from '~/components/geometry/penrose-v1/GPenroseKite.vue'
import GPenroseDart from '~/components/geometry/penrose-v1/GPenroseDart.vue'
import GPenroseSun from '~/components/geometry/penrose-v1/GPenroseSun.vue'
import GPenroseStar from '~/components/geometry/penrose-v1/GPenroseStar.vue'
import GPenroseAce from '~/components/geometry/penrose-v1/GPenroseAce.vue'
import GPenroseDeuce from '~/components/geometry/penrose-v1/GPenroseDeuce.vue'
import GPenroseJack from '~/components/geometry/penrose-v1/GPenroseJack.vue'
import GPenroseQueen from '~/components/geometry/penrose-v1/GPenroseQueen.vue'
import GPenroseKing from '~/components/geometry/penrose-v1/GPenroseKing.vue'
import GPenroseStarHalo from '~/components/geometry/penrose-v1/GPenroseStarHalo.vue'
Vue.component('g-penroseV1-geometry', GPenroseGeometry)
Vue.component('g-penroseV1-kite', GPenroseKite)
Vue.component('g-penroseV1-dart', GPenroseDart)
Vue.component('g-penroseV1-sun', GPenroseSun)
Vue.component('g-penroseV1-star', GPenroseStar)
Vue.component('g-penroseV1-ace', GPenroseAce)
Vue.component('g-penroseV1-deuce', GPenroseDeuce)
Vue.component('g-penroseV1-jack', GPenroseJack)
Vue.component('g-penroseV1-queen', GPenroseQueen)
Vue.component('g-penroseV1-king', GPenroseKing)
Vue.component('g-penroseV1-star-halo', GPenroseStarHalo)
