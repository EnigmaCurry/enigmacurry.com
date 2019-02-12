uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

#define PI 3.14159

varying vec2 vUv;

float plateaus(float t, float transition, float plateau) {
  float total = plateau + transition + plateau + transition;
  float m = mod(t, total);
  if (m < plateau) {
    return 1.;
  } else if (m < (plateau + transition)) {
    return smoothstep(-1., 1., sin((t-plateau) / (transition/PI) + PI/2.));
  } else if (m < (plateau + transition + plateau)) {
    return 0.;
  } else {
    return smoothstep(-1., 1., sin((t-plateau-transition-plateau) / (transition/PI) - PI/2.));
  }
}

void main(void)
{
  float g = float(iGeneration);
  float c = float(iCreation);
  float v = vUv.x * sin(iTime / 4.) + 1.;
  float u = vUv.y * atan(cos(g/14.)) + 1.;
  float t = pow(fract(iTime/(float(iCreation))*pow(v,333.)) + float(iCreation) * 20., 0.5);
  float tmod = mod(iTime, t*u);
  t += log(dot(c,g)) / (vUv.x/u);
  float i = smoothstep(-1., 1., sin(t*22.));
  vec3 color = vec3(i + (iColor.r/t),i + (iColor.g/v) + sin(t), v + tan(iColor.b * v));
  float a = smoothstep(-1., 1., sin(t*(sqrt(g)/22.))) + 0.2;

  float p = plateaus(iTime, 4., 2.);
  if (mod(floor(vUv.x*c*tmod*0.01), 44.) == 0.) {
    gl_FragColor = vec4((1./p) * iColor.r, iColor.g, p * iColor.b, 0.7);
  } else {
    gl_FragColor = vec4((1./p) * iColor.r/p*u, iColor.g/g*tmod, iColor.b/u, 0.4);
  }
}
