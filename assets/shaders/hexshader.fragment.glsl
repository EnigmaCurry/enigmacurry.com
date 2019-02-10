uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

varying vec2 vUv;

void main(void)
{
  float t = iTime + float(iCreation);
  float i = smoothstep(-1., 1., sin(t)) * 0.5;
  vec3 color = vec3(i + iColor.r * vUv.x,i + iColor.g * vUv.y, i + iColor.b * sin(i));
  gl_FragColor = vec4(color, iOpacity) * 0.5;
}
