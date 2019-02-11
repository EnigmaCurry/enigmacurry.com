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
  float v = vUv.x;
  float t = (iTime/(float(iCreation))*pow(v,333.)) + float(iCreation) * 20.;
  t *= sin(vUv.x);
  float i = smoothstep(-1., 1., sin(t));
  vec3 color = vec3(i + iColor.r ,i + iColor.g, i + iColor.b);
  gl_FragColor = vec4(color, iOpacity) * 0.5;
}
