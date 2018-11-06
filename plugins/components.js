import Vue from 'vue'

import GRenderer from '~/components/geometry/GRenderer.vue'
import GCamera from '~/components/geometry/GCamera.vue'
import GLight from '~/components/geometry/GLight.vue'
Vue.component('g-renderer', GRenderer)
Vue.component('g-camera', GCamera)
Vue.component('g-light', GLight)

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

