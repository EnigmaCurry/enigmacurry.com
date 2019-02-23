//// This is a nunjucks template
//// Required params:
////  funcName
////  funcDef

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iCenter;
uniform float iZoom;
uniform float iStrokeWidth;
varying vec2 vUv;

#define PI 3.14159

{% for name, def in functions %}
float {{ name }}(float x) {
  return {{ def }};
}
{% endfor %}

float plot(in vec2 p) {
  // http://glslsandbox.com/e#52722.2
  const float e = 0.001;
  p.y -= {{ function }}(p.x);
  float g = ({{ function }}(p.x + e) - {{ function }}(p.x - e)) / (PI * e);
  return abs(p.y * cos(atan(g)));
}

void main(void)
{
  vec2 p = (vUv - 0.5 + iCenter) / (iZoom / 2.);
  p.x *= iResolution.x/iResolution.y;
  vec3 buf = vec3(smoothstep(iStrokeWidth / iZoom, 0.0, plot(p.xy)));
  if (buf.r > 0.1 || buf.g > 0.1 || buf.b > 0.1) {
    gl_FragColor = vec4(buf, 1.);
  } else {
    gl_FragColor = vec4(0.);
  }
}
