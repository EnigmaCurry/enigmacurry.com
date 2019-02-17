uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

#define BORDER_PCT 0.2
#define PI 3.14159

float circle(in vec2 _p, in vec2 _center, in float _radius) {
  vec2 dist = _p - _center;
  return step(distance(_p, _center), _radius);
}

vec2 rotateVec2(in vec2 v, in vec2 axis, in float angle) {
  vec2 vprime = v - axis;
  vec2 vrot = vec2(vprime.x * cos(angle) - vprime.y * sin(angle),
                   vprime.y * cos(angle) + vprime.x * sin(angle));
  return vrot + axis;
}

vec3 reuleauxTriangle(in vec2 _p, in vec2 _center, in float r) {
  vec2 top = vec2(_center.x, _center.y + (sqrt(3.)/2.) * r/2.);
  vec2 left = vec2(top.x-(r/2.), top.y-1. * (sqrt(3.)/2.) * r);
  vec2 right = vec2(top.x+r/2., top.y-1. * (sqrt(3.)/2.) * r);
  /// Rotate triangle
  float angle = sin(iTime / 22.) * 8.4;
  top = rotateVec2(top, _center, angle);
  left = rotateVec2(left, _center, angle);
  right = rotateVec2(right, _center, angle);
  /// Union of three circles:
  float c1 = circle(_p, top, r);
  float c2 = circle(_p, left, r);
  float c3 = circle(_p, right, r);
  if ( c1 > 0. && c2 > 0. && c3 > 0.){
    float c = cos(_p.x * abs(sin(iTime/4.)) * 333. + 333.) * 15.;
    return vec3(1.0 - c, c, _p.x * c);
  } else {
    return vec3(0.);
  }
}


void main(void)
{
  //Center and normalize zoom:
  vec2 p = vUv - 0.5;
  //zoom : p /= 22.;
  if (iResolution.x > iResolution.y) {
    p.x *= iResolution.x/iResolution.y;
  } else {
    p.y *= iResolution.y/iResolution.x;
  }
  float width = 0.5;
  float radius = width / 2.;
  vec3 color = reuleauxTriangle(p, vec2(0., 0.), radius);
  color += reuleauxTriangle(p, vec2(radius, 0.), radius);
  color += reuleauxTriangle(p, vec2(-radius, 0.), radius);
  color += reuleauxTriangle(p,
                            vec2(-radius/2., (sqrt(3.)/2.) * radius),
                            radius);
  color += reuleauxTriangle(p,
                            vec2(radius/2., (sqrt(3.)/2.) * radius),
                            radius);
  color += reuleauxTriangle(p,
                            vec2(-radius/2., 0. - (sqrt(3.)/2.) * radius),
                            radius);
  color += reuleauxTriangle(p,
                            vec2(radius/2., 0. - (sqrt(3.)/2.) * radius),
                            radius);
 gl_FragColor = vec4(color, 0.6);
}
