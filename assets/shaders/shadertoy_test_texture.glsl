void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord.xy / iResolution.xy;
  uv.x = mix(-1.0, 1.0, uv.x);
  uv.y = mix(-1.0, 1.0, uv.y);
  uv.y *= iResolution.y / iResolution.x;
  if (uv.y<0. && uv.x <0.) fragColor = texture(iChannel0, uv);
  if (uv.y<0. && uv.x >=0.) fragColor = texture(iChannel1, uv);
  if (uv.y>=0. && uv.x <0.) fragColor = texture(iChannel2, uv);
  if (uv.y>=0. && uv.x >=0.) fragColor = texture(iChannel3, uv);
}
