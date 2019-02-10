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
  float t = (iTime/(float(iCreation) * distance(vUv.x,vUv.y))) + float(iCreation) * 20.;
  float i = smoothstep(-1., 1., sin(t)) * dot(c*vUv.x,g*vUv.y)/2222.;
  vec3 color = vec3(i + iColor.r * vUv.x,i + iColor.g * vUv.y, i + iColor.b * sqrt(sin(i))+vUv.x*sin(t));
  gl_FragColor = vec4(color, iOpacity) * 0.5;
}
