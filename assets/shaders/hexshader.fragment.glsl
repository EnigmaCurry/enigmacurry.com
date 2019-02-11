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
  float v = max(vUv.x, vUv.y);
  float t = (iTime/(float(iCreation))*pow(v,3.)) + float(iCreation) * 20.;
  float i = smoothstep(-1., 1., sin(t));
  vec3 color = vec3(i + iColor.r * v,i + iColor.g * v, i + iColor.b * sqrt(sin(i))+v*sin(t));
  gl_FragColor = vec4(color, iOpacity) * 0.5;
}
