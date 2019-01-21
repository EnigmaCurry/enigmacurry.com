// Adapted from https://www.shadertoy.com/view/XsXXDn
// "Creation"" by Silexars - Original credit to Danilo Guanabara
uniform int scene;
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

vec4 thirdeye(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.4 * (p.x / p.y);
  p.x = 0.4 * (p.y / p.x);
  float l = length(p);
  float t = tan(iGlobalTime / 28.);

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += sin(t*t);
    vec2 a = 0.5 * (p/l * (33.+sin(t)) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

vec4 waters(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.4 * (p.x / p.y);
  p.x = 0.4 * (p.y / p.x);
  float l = length(p);
  float t = iGlobalTime;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += .07;
    vec2 a = p + p/l * (1.+cos(t)) * abs(sin(l*999.-t*2.));
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}



vec4 diffraction(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p);
  float t = sin(iGlobalTime) - cos(iGlobalTime);

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += .07;
    vec2 a = p + p/l * (1.+cos(t)) * abs(sin(l*999.-t*2.));
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}

vec4 diffraction2(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) / 2.);
  float t = iGlobalTime;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 2.27;
    vec2 a = p + p/l * (1.+cos(t/2.)) * abs(sin(l*999.-t*2.));
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}

vec4 forceFields(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) / 2.);
  float t = sin(iGlobalTime) * cos(iGlobalTime); 

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 2.27;
    vec2 a = p + p/l * cos(t) * acos(t/7.);
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}

vec4 spinner(void)
{
  vec2 p = -1.0 + 2.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) * 5.);
  float t = (sin(iGlobalTime/16.) * cos(iGlobalTime/8.));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.07;
    vec2 a = (p + p/l * acos(t*0.6) * acos(t/24.)) / sin(t*t*t*4.);
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}

vec4 retrograde(void)
{
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) * 5.);
  float t = (sin(iGlobalTime/64.) * cos(iGlobalTime/128.));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.07;
    vec2 a = (p + p/l * acos(t*0.6) * acos(t/24.)) / sin(t*t*t*4.);
    c[i] = .01/length( fract(0.5+a)-0.5 );
  }
  return vec4(c/l, 0.);
}

vec4 stagelights(void)
{
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) * 5.);
  float t = (sin(iGlobalTime/64.) * cos(iGlobalTime/128.));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.33;
    vec2 a = (p + p/l * acos(t*0.6) * acos(t/12.)) / sin(t*t*t*4.);
    c[i] = .5/length( fract(0.5+a)-0.95 );
  }
  return vec4(c/l, 0.);
}


vec4 dicewheel(void)
{
  vec2 p = -6.0 + 12.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) * (length(p) * 15.);
  float t = (sin(iGlobalTime/2.) * cos(iGlobalTime/22.));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 0.33;
    vec2 a = p;
    c[i] = 0.01 + p.y * cos(pow(t,2.));
  }
  return vec4((c/l) * 144., 0.);
}

vec4 pinwheel(void)
{
  vec2 p = -6.0 + 12.0 * vUv;
  p.y = 0.9 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) / 22.;
  float t = (sin(iGlobalTime/2.) * cos(iGlobalTime/22.));

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 1.733;
    vec2 a = p;
    c[i] = 0.2 + p.y * cos(pow(t,2.));
  }
  return vec4((c/l), 0.);
}

vec4 transform(void)
{
  vec2 p = -6.0 + 12.0 * vUv;
  p.y = 2.4 * (p.x / p.y);
  p.x = 0.2 * (p.y / p.x);
  float l = length(p) / 22.;
  float t = cos(iGlobalTime/4.) * 8.;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += 2.733;
    vec2 a = 0.5 * (p/l * (33.+sin(t)) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( mod(0.0001+a, t) - 1.5);
  }
  return vec4((c/l), 0.);
}

void main(void) {
  float t = sin(iGlobalTime / 18.0);
  if (scene == 0){
    gl_FragColor = thirdeye();
  } else if (scene == 1) {
    gl_FragColor = waters();
  } else if (scene == 2) {
    gl_FragColor = diffraction();
  } else if (scene == 2) {
    gl_FragColor = diffraction2();
  } else if (scene == 3) {
    gl_FragColor = forceFields();
  } else if( scene == 4) {
    gl_FragColor = spinner();
  } else if( scene == 5) {
    gl_FragColor = retrograde();
  } else if( scene == 6) {
    gl_FragColor = stagelights();
  } else if( scene == 7) {
    gl_FragColor = dicewheel();
  } else if( scene == 8) {
    gl_FragColor = pinwheel();
  } else if( scene == 9) {
    gl_FragColor = transform();
  }
}

