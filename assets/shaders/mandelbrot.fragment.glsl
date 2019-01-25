uniform vec2 iResolution;
uniform float iGlobalTime;
uniform vec2 center;
uniform float zoom;
uniform float colt;

#define iterLimit 256.

varying vec2 vUv;

vec4 colmod1 (float iter, float t) {
  float col = iter / iterLimit;
  vec2 p = vUv - 0.5;
  if (col > 0.99) {
    return vec4(cos(t / p.x) * 0.15 * p.y,
                sin(t / p.x) * 0.15 * p.y,
                acos(t / p.x) * 0.15 * p.y,
                1.0);
  } else {
    return vec4(col * 0.00001 + cos(t /22. * iter) + 0.15 * p.x,
                col * 0.00002 + cos(t /13. * iter) + 0.15 * p.x,
                col * 0.00005 + tan(t / 23. + iter ) + 0.15 * p.x,
                1.0);
  }
}

vec4 mandelbrot(vec2 center, float zoom, float t) {
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x / iResolution.y;
  vec2 c = center + p  / zoom;

  vec2 z;
  float iter;
  for (float i=0.; i < iterLimit; i+=1.) {
    iter = i;
    z = vec2(z.x*z.x-z.y*z.y, 2.*z.x*z.y) + c;
    if (length(z) > 2.) {
      break;
    }
  }
  //apply coloring as function of t:
  return colmod1(iter, t);
}

void main(void)
{
  // Use uniforms as input parameters
  // center - the the coordinates of the center of focus
  // zoom - factor of zoom
  // colt - factor of time for color changes
  gl_FragColor = mandelbrot(center, zoom, iGlobalTime * colt);
}

