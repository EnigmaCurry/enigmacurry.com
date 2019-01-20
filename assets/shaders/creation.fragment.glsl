// Adapted from https://www.shadertoy.com/view/XsXXDn
// "Creation"" by Silexars - Original credit to Danilo Guanabara
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

void main(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.2 * (p.x / p.y);
  p.x = 0.3 * (p.y / p.x);
  float l = length(p);
  float t = tan(iGlobalTime / 28.);

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += .27;
    vec2 a = 0.5 * (p/l * (33.+sin(t)) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  gl_FragColor = vec4(c/l, 0.);
}
