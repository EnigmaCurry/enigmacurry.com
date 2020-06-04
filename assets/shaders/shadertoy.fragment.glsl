//// This is a nunjucks template

{% for name,u in tUniform %}
uniform {{u.type}} {{name}};
{% endfor %}

vec4 texture(sampler2D s, vec2 c) { return texture2D(s,c); }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord.xy / iResolution.xy;
  uv.x = mix(-1.0, 1.0, uv.x);
  uv.y = mix(-1.0, 1.0, uv.y);
  uv.y *= iResolution.y / iResolution.x;
  if (uv.y<0. && uv.x <0.) fragColor = texture(iChannel0, uv);
  if (uv.y<0. && uv.x >=0.) fragColor = texture(iChannel1, uv);
  if (uv.y>0. && uv.x <0.) fragColor = texture(iChannel2, uv);
  if (uv.y>0. && uv.x >=0.) fragColor = texture(iChannel3, uv);
}

void main(void)
{
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
