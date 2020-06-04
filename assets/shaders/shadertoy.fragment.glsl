//// This is a nunjucks template

{% for name,u in tUniform %}
uniform {{u.type}} {{name}};
{% endfor %}

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

{{shadertoySrc | safe}}

void main(void)
{
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
