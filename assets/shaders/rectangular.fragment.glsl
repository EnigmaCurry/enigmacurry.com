uniform float iGlobalTime;
uniform vec2 iResolution;
uniform float rectWidth;
uniform float rectHeight;
uniform vec3 squareColor;

varying vec2 vUv;

vec4 areaToUv(vec4 area) {
  return vec4(area.x / iResolution.x,
              area.y / iResolution.y,
              area.z / iResolution.x,
              area.w / iResolution.y);
}

vec4 draw(vec4 rectArea) {
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x / iResolution.y;
  vec4 uvArea = areaToUv(rectArea);
  float d = 0.; /// How far away from the border?
  if (vUv.x < uvArea.x) {
    /// Draw left of border:
    d = smoothstep(uvArea.x, 0., vUv.x);
    return vec4(d,d,d,0.);
  } else if (vUv.x > uvArea.z) {
    // Draw right of border:
    d = smoothstep(uvArea.z * iResolution.x, iResolution.x, vUv.x * iResolution.x);
    return vec4(d,d,d,0.);
  } else if (vUv.y < uvArea.y) {
    // Draw bottom of border:
    d = smoothstep(uvArea.y, 0., vUv.y);
    return vec4(d,d,d,0.);
  } else if (vUv.y > uvArea.w) {
    // Draw top of border:
    d = smoothstep(uvArea.w * iResolution.y, iResolution.y, vUv.y * iResolution.y);
    return vec4(d,d,d,0.);
  } else {
    /// Draw rectangle:
    float xs = smoothstep(uvArea.x, uvArea.z, vUv.x);
    float ys = smoothstep(uvArea.y, uvArea.w, vUv.y);
    float border = 0.001;
    if (xs < border || ys < border || xs > 1.-border || ys > 1.-border) {
      /// Draw border:
      return vec4(1.,1.,1.,1.);
    } else {
      /// Draw background:
      return vec4((xs+ys+0.15) * 1.,(xs*ys) * 1.,(xs-ys) * 1.,1.);
    }
  }
}

vec4 rect(vec2 dimensions) {
  float screenAspect = iResolution.x / iResolution.y;
  float aspect = dimensions.x / dimensions.y;
  float width = aspect * iResolution.y;
  float height = iResolution.x / aspect;
  float startX, startY, endX, endY;
  if ( screenAspect > aspect ) {
    // Cut off sides of screen to increase height of rectangle
    startX = iResolution.x * 0.5 - width / 2.;
    startY = 0.;
    endX = iResolution.x * 0.5 + width / 2.;
    endY = iResolution.y;
  } else {
    // Cut off top and bottom of screen to increase width of rectangle
    startX = 0.;
    startY = iResolution.y * 0.5 - height / 2.;
    endX = iResolution.x;
    endY = iResolution.y * 0.5 + height / 2.;
  }
  vec4 rectArea = vec4(startX, startY, endX, endY);
  return draw(rectArea);
}

void main(void)
{
  gl_FragColor = rect(vec2(rectWidth, rectHeight));
}
