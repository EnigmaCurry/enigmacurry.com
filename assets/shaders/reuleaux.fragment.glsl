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

vec3 reuleauxTriangle(in vec2 _p, in vec2 _rotCenter, in float r) {
  vec2 top = vec2(_rotCenter.x, _rotCenter.y + (sqrt(3.)/2.) * r);
  vec2 left = vec2(top.x-(r/2.), top.y-1. * (sqrt(3.)/2.) * r);
  vec2 right = vec2(top.x+r/2., top.y-1. * (sqrt(3.)/2.) * r);
  vec2 center = vec2(_rotCenter.x, _rotCenter.y + 0.333 * distance(_rotCenter, top));
  /// Rotate triangle
  float angle = sin(iTime / (8. + smoothstep(-1., 1., sin(iTime)))) * 4.;
  top = rotateVec2(top, _rotCenter, angle);
  left = rotateVec2(left, _rotCenter, angle);
  right = rotateVec2(right, _rotCenter, angle);
  center = rotateVec2(center, _rotCenter, angle);
  /// Union of three circles:
  float c1 = circle(_p, top, r);
  float c2 = circle(_p, left, r);
  float c3 = circle(_p, right, r);
  float drot = distance(_p, _rotCenter);
  float dtop = distance(_p, top);
  float dleft = distance(_p, left);
  float dright = distance(_p, right);
  float dcenter = distance(_p, center);
  float dthreshold = 0.008;
  vec3 color = vec3(0.);
  if ( c1 > 0. && c2 > 0. && c3 > 0.){
    float c = atan(cos((_p.x/_p.y) * abs(sin(iTime/14.)) * 13. + 3.) * 15.);
    color = smoothstep(
                      vec3(smoothstep(-1.48, 1.48, atan(cos(iTime/8.)*22.*sin(iTime/2.)))),
                      vec3(1.0 - c, c, _p.x * c),
                      vec3(smoothstep(-PI/4., PI/4.,atan(sin(iTime/3.))))
                        - distance(_p, _rotCenter)
                      );
    if (drot < dthreshold) {
      color = vec3(smoothstep(0.,.01,drot * smoothstep(-1.,1., sin(iTime/2.))),
                   smoothstep(0.,.01,drot * smoothstep(-1.,1., sin(iTime/4.))),
                   smoothstep(0.,.01,drot * smoothstep(-1.,1., sin(iTime/8.)))
                   );
    } else if (dtop < dthreshold || dleft < dthreshold || dright < dthreshold) {
      color = vec3(1.);
    } else if (dcenter < dthreshold) {
      color = vec3(smoothstep(0.,.01,dcenter * smoothstep(-1.,1., cos(iTime/2.))),
                   smoothstep(0.,.01,dcenter * smoothstep(-1.,1., cos(iTime/4.))),
                   smoothstep(0.,.01,dcenter * smoothstep(-1.,1., cos(iTime/8.)))
                   );
    }
  }

  return color;
}

vec4 bgScene(in vec3 _color, in vec2 _p) {
  float c = atan(cos((_p.x/_p.y) * abs(sin(iTime/14.)) * 13. + 3.) * 15.);
  if (_color == vec3(0.)) {
    return vec4(vec3(120. + c, c-12., _p.x * c), 0.1);
  } else {
    return vec4(_color, 1.);
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
  gl_FragColor = bgScene(color, p);
}
