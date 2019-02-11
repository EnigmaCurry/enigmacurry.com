uniform float iTime;
uniform bool iKaleidoscope;
varying vec2 vUv;
void main()
{
  vUv = uv;
  float i = 0.;
  if(iKaleidoscope) {
    i = smoothstep(-1., 1., sin(iTime/9.)) / 12.;
  }
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = (projectionMatrix * mvPosition + i) * sqrt(i) * 2.;
}

