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
  return vec4(c/l, 1.);
}

vec4 yoyoverse2(void) {
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.4 * (p.x / p.y);
  p.x = 0.1 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 1.01) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 1.);
}

vec4 yoyoverse3(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 1.01) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 1.);
}

vec4 yoyoverse4(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = atan(cos(iGlobalTime * 0.05) * 1.01) * 1.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t*t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 1.);
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
  return vec4(c/l, 1.);
}

vec4 yoyoverse6(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = tan(cos(iGlobalTime * 0.05));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.1/length( 9. * fract(0.95+a) - 0.15);
  }
  return vec4(c/l, 1.);
}

vec4 yoyoverse7(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = tan(cos(iGlobalTime * 0.05));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.02/length( 0.1 * fract(0.95+a) - 0.15);
  }
  return vec4(c/l, 1.);
}

vec4 yoyoverse8(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = tan(cos(iGlobalTime * 0.05));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.5 * cos(t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.02/length( 0.1 * fract(0.95+a) - 0.15);
  }
  return vec4(c/l, 1.);
}

vec4 yoyoverseOctave(void) {
  vec2 p = -4.0 + 8.0 * vUv;
  p.y = 3. * (p.x / p.y);
  p.x = 0.005 * (p.x / p.y);
  float l = length(p);
  float t = tan(cos(iGlobalTime * 0.05));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.015 * cos(t);
    vec2 a = 44.85 * (p/l * (sin(pow(t,3.))) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.02/length( 0.1 * fract(0.95+a) - 0.15);
  }
  return vec4(c/l, 1.);
}

void main(void)
{
  float framemod = mod(iGlobalTime, 700.);
  if(framemod < 100.) {
    gl_FragColor = mix(yoyoverse2(), yoyoverse3(), framemod/100.);
  } else if (framemod < 200.) {
    gl_FragColor = mix(yoyoverse3(), yoyoverse4(), (framemod-100.)/100.);
  } else if (framemod < 300.) {
    gl_FragColor = mix(yoyoverse4(), yoyoverse5(), (framemod-200.)/100.);
  } else if (framemod < 400.) {
    gl_FragColor = mix(yoyoverse5(), yoyoverse6(), (framemod-300.)/100.);
  } else if (framemod < 500.) {
    gl_FragColor = mix(yoyoverse6(), yoyoverse7(), (framemod-400.)/100.);
  } else if (framemod < 600.) {
    gl_FragColor = mix(yoyoverse7(), yoyoverseOctave(), (framemod-500.)/100.);
  } else if (framemod < 700.) {
    gl_FragColor = mix(yoyoverseOctave(), yoyoverse2(), (framemod-600.)/100.);
  }
}
