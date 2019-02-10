uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

void main(void)
{
  float t = iTime + float(iCreation);
  //vec3 color = vec3(iColor.r, iColor.g, iColor.b);
  vec3 color = vec3(smoothstep(-1., 1., sin(t)));
  gl_FragColor = vec4(color, iOpacity);
}
