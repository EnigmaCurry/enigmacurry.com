uniform vec2 iResolution;
uniform float iGlobalTime;

#define iterLimit 256.0

varying vec2 vUv;

vec4 mandelbrot(vec4 area) {
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x / iResolution.y;
  vec2 c = vec2((area.z+area.x)/2.,(area.w+area.y)/2.0) + p  / distance(area.xy, area.zw);

  vec2 z;
  float iter;
  for (float i=0.; i < iterLimit; i+=1.) {
    iter = i;
    z = vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y) + c;
    if (length(z) > 2.) {
      break;
    }
  }
  float col = iter / iterLimit;

  return vec4(col, col, col, 1.0);
}

void main(void)
{
  //vec3 col = 0.5 * 0.5*cos(iGlobalTime + vUv.xyx + vec3(0,2,4));
  //gl_FragColor = vec4(col, 1.0);

  float tmod = 48.0;
  vec2 center = vec2(abs(sin(iGlobalTime / tmod)) * 0.01 - 0.46994, abs(sin(iGlobalTime / tmod)) * 0.1 - 0.641);
  float s = 12.11595464;
  float zoom = sin(iGlobalTime / 8.) * 7. + s;
  zoom *= 0.15 * zoom;
  vec4 area = vec4(-zoom+center.x,-zoom+center.y,zoom+center.x,zoom+center.y);
  gl_FragColor = mandelbrot(area);

}

