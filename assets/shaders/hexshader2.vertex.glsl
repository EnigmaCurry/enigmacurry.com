uniform vec3 iColor;
uniform float iOpacity;
uniform float iTime;
uniform float iCreatedTime;
uniform int iGeneration;
uniform int iCreation;

varying vec2 vUv;
void main()
{
  float t = iTime;
  float g = float(iGeneration);
  float c = float(iCreation);
  float age = t-c*sin(t);
  float gwave = sin(age*vUv.x/666.) + 1.;
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 0.8*gwave);
  gl_Position = projectionMatrix * mvPosition;

  gl_Position = projectionMatrix * mvPosition;
}

