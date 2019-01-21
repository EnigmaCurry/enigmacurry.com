// Adapted from https://www.shadertoy.com/view/XsXXDn
// "Creation"" by Silexars - Original credit to Danilo Guanabara
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

vec4 yoyoverse(void) {
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.1 * (p.x / p.y);
  p.x = 0.1 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 2.) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

vec4 yoyoverse2(void) {
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.4 * (p.x / p.y);
  p.x = 0.1 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 2.) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

vec4 yoyoverse3(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 2.) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

vec4 yoyoverse4(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 2.) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

vec4 yoyoverse5(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = tan(cos(iGlobalTime * 0.05));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

void main(void)
{
  float framemod = mod(iGlobalTime, 50.);
  if(framemod < 10.) {
    gl_FragColor = yoyoverse();
  } else if (framemod < 20.) {
    gl_FragColor = yoyoverse2();
  } else if (framemod < 30.) {
    gl_FragColor = yoyoverse3();
  } else if (framemod < 40.) {
    gl_FragColor = yoyoverse4();
  } else if (framemod < 50.) {
    gl_FragColor = yoyoverse5();
  } 
}
