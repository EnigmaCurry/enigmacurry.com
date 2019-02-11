uniform float iTime;
varying vec2 vUv;
void main()
{
  vUv = uv;
  float i = smoothstep(-1., 1., sin(iTime/9.)) / 122.;
  vec4 mvPosition = modelViewMatrix * vec4(position, 0.25);
  gl_Position = (projectionMatrix * mvPosition + i)
    * sqrt(i*vUv.x/vUv.y) * 2222.
    + (atan(sin(iTime/vUv.y/vUv.x/22.)) * 20.) + 20.;
}

