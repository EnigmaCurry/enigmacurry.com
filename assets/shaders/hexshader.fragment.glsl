uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

void main(void)
{
  float t = iTime + float(iCreation);
  float i = smoothstep(-1., 1., sin(t)) * 0.5;
  vec3 color = vec3(i + iColor.r, i + iColor.g, i + iColor.b);
  gl_FragColor = vec4(color, iOpacity) * 0.5;
}
