// Adapted from https://www.shadertoy.com/view/XsXXDn
// "Creation"" by Silexars - Original credit to Danilo Guanabara
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

void main(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  float l = length(p);
  float t = iGlobalTime;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += .07;
    vec2 a = p + p/l * (1.+cos(t)) * abs(sin(l*9.-t*2.));
    c[i] = .01/length( fract(0.5+a) - 0.5);
  }
  gl_FragColor = vec4(c/l, 0.);
}
