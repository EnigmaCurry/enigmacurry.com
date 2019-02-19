uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

#define iZoom 0.5
#define iField 20.
#define iCenter vec2(0., 0.)
#define PI 3.14159

float line(in vec2 p, in vec2 p1, in vec2 p2, in float width) {
  vec2 d0 = p2 - p1;
  vec2 d1 = p - p1;
  return length(d1 - d0 * clamp(dot(d0, d1) / dot(d0, d0), 0., 1.)) * (1./width*8.);
}

vec3 layer(in vec3 buf, in vec3 color) {
  if (color.r > 0.1 || color.g > 0.1 || color.b > 0.1) {
    return color;
  } else {
    return buf;
  }
}

vec3 axes(in vec2 p, in float length) {
  vec3 xaxis = vec3(1./line(p, vec2(-length,0.), vec2(length,0.), 0.001));
  vec3 yaxis = vec3(1./line(p, vec2(0.,-length), vec2(0.,length), 0.001));
  vec3 buf = layer(vec3(0.), xaxis);
  buf = layer(buf, yaxis);
  return buf;
}

float func1(float x) {
  float fx = sin(x * 2.);
  return fx;
}

float plot(in vec2 p) {
  const float e = 0.001;
  p.y -= func1(p.x);
  float g = (func1(p.x + e) - func1(p.x - e)) / (PI * e);
  return abs(p.y * cos(atan(g)));
}

void main(void)
{
  vec2 p = (vUv - 0.5 + iCenter) / iZoom;
  p.x *= iResolution.x/iResolution.y;
  vec3 buf = axes(p, 300.);
  buf += smoothstep(0.011, 0.0, plot(p));
  gl_FragColor = vec4(buf, 1.);
}
