//// This is a nunjucks template
varying vec2 vUv;

{% for name,u in tUniform %}
uniform {{u.type}} {{name}};
{% endfor %}

#define PI 3.14159

vec2 rotateVec2(in vec2 v, in vec2 axis, in float angle) {
  vec2 vprime = v - axis;
  vec2 vrot = vec2(vprime.x * cos(angle) - vprime.y * sin(angle),
                   vprime.y * cos(angle) + vprime.x * sin(angle));
  return vrot + axis;
}

/// Metaprogram of each function passed into the template:
{% for f in functions %}
float func_{{ loop.index0 }}(in vec2 p) {
  float x = p.x;
  {% for v in f.vars %}
  {{v.type}} {{ v.name }} = {{ v.def }};
  {% endfor %}
  return {{ f.def }};
}
float plot_{{ loop.index0 }}(in vec2 p) {
  // http://glslsandbox.com/e#52722.2
  const float e = 0.001;
  p.y -= func_{{ loop.index0 }}(p);
  float g = (func_{{ loop.index0 }}(vec2(p.x + e, p.y))
             - func_{{ loop.index0 }}(vec2(p.x - e, p.y))) / (PI * e);
  return abs(p.y * cos(atan(g)));
}
vec4 color_{{ loop.index0 }}(in vec2 p) {
  float x = p.x;
  {% for v in f.vars %}
  {{v.type}} {{ v.name }} = {{ v.def }};
  {% endfor %}
  return vec4({{ f.color }}, {{f.alpha}});
}
{% endfor %}

vec4 line(in float plot, in float strokeWidth, in vec4 color) {
  return vec4(vec3(smoothstep(strokeWidth / iZoom, 0.0, plot)), 1.) * color;
}

vec4 layer(in vec4 buf, in vec4 color) {
  if (color.r > 0.1 || color.g > 0.1 || color.b > 0.1) {
    return mix(buf, color, color.a);
  } else {
    return buf;
  }
}

void main(void)
{
  vec2 p = (vUv - 0.5 + iCenter) / (iZoom / 2.);
  if (iResolution.x > iResolution.y) {
    p.x *= iResolution.x/iResolution.y;
  } else {
    p.y *= iResolution.y/iResolution.x;
  }
  p = rotateVec2(p, vec2(0.), sin(iTime / 360.) * 15.);
  vec2 polar = vec2(length(p)* 2., atan(p.y, p.x));


  // Layer all functions passed into the template:
  vec4 buf;
  vec2 coord = p;
  {% for f in functions %}
  {% if f.enabled %}
    {% if f.polar %}
    coord = polar.yx;
    {% else %}
    coord = p;
    {% endif %}
    buf = layer(buf, line(plot_{{ loop.index0 }}(coord),
                          {{ f.stroke * 0.001 }}, color_{{loop.index0}}(coord)));
  {% endif %}
  {% endfor %}

  if (buf.r > 0.1 || buf.g > 0.1 || buf.b > 0.1) {
    gl_FragColor = vec4(buf);
  } else {
    gl_FragColor = vec4(0.);
  }
}
