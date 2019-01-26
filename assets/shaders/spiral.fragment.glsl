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
  float t = iGlobalTime;
  float cmod = 2000.;
  vec2 p = (0.5 - vUv) * vec2(1, cos(t*12000.));
  p.x = p.x * (iResolution.x/iResolution.y);
  float col = spiral(p, spiralRatio, spiralRate, spiralScale);
  gl_FragColor = vec4(col * p.x * 14. * sin(t) * cmod,
                      col * p.y * 23. * cmod * sin(t * cmod),
                      col * p.x * 48. * cmod * cos(t * cmod),
                      1.0);
}
