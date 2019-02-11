uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

varying vec2 vUv;

void main(void)
{
  float g = float(iGeneration);
  float c = float(iCreation);
  float v = vUv.x * 3.;
  float t = pow(fract(iTime/(float(iCreation))*pow(v,333.)) + float(iCreation) * 20., 0.5);
  t += sin((distance(g,c) / vUv.y) / 222.);
  float i = smoothstep(-1., 1., sin(t*22.));
  vec3 color = vec3(i + (iColor.r/t),i + (iColor.g/v) + sin(t), v + tan(iColor.b * v));
  gl_FragColor = vec4(color, 0.1);
}
