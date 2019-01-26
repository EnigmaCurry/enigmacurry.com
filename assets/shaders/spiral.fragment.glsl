// https://www.shadertoy.com/view/Md2cDK

uniform vec2 iResolution;
uniform float iGlobalTime;
uniform float spiralRatio;
uniform float spiralRate;
uniform float spiralScale;
varying vec2 vUv;

float spiral(vec2 p, float ratio, float rate, float scale) {
  float r = length(p*0.1);
  float theta = cos(atan(p.x, p.y));
  float logspiral = log(r)/ratio + theta;
  return sin(rate*iGlobalTime + scale * logspiral) + 0.25;
}

void main(void) {
  float t = iGlobalTime * 30.;
  float cmod = 500.;
  vec2 p = (0.5 - vUv) * vec2(1, 1);
  p.x = p.x * (iResolution.x/iResolution.y);
  float col = 0.5 + 0.5 * spiral(p, spiralRatio, spiralRate, spiralScale);
  gl_FragColor = vec4(sin(cmod*col),
                      sin(cmod*col),
                      cos(cmod*col),
                      1.0);
}
