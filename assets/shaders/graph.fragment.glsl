uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

float line(in vec2 p, in vec2 p1, in vec2 p2, float width) {
  vec2 d0 = p2 - p1;
  vec2 d1 = p - p1;
  return length(d1 - d0 * clamp(dot(d0, d1) / dot(d0, d0), 0., 1.)) * (1./width*8.);
}

vec4 axes(vec2 p) {
  vec3 xaxis = vec3(1./line(p, vec2(-1.,0.), vec2(1.,0.), 0.01));
  vec3 yaxis = vec3(1./line(p, vec2(0.,-1.), vec2(0.,1.), 0.01));
  vec3 buf = xaxis;
  if (buf.r < 1.) {
    buf += yaxis;
  }
  return vec4(buf, 1.);
}

void main(void)
{
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x/iResolution.y;
  gl_FragColor = axes(p);
}
