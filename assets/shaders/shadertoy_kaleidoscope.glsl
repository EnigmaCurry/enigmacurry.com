vec2 kaleido(vec2 uv)
{
  float th = atan(uv.y, uv.x);
  float r = pow(length(uv), .9);
  float f = 3.14159 / 3.5;
  th = abs(mod(th + f/4.0, f) - f/2.0) / (1.0 + r);
  //th = sin(th * 6.283 / f);
  return vec2(cos(th), sin(th)) * r * .1;

}
vec2 transformKaleidoMap(vec2 at, float currentTime)
{
  vec2 v;
  float th = .03 * cos(currentTime)*0.1+sin(currentTime*0.01);
  v.x = at.x * cos(th) - at.y* distance(at.x,sin(currentTime*0.0001)*0.5) * sin(th) - 0.001 * sin(th);
  v.y = at.x * sin(th) + at.y* distance(at.y,cos(currentTime*0.0001)*0.5) * cos(th) + 0.001 * cos(th);
  return v;
}
vec2 transform(vec2 at, float currentTime)
{
  vec2 v;
  vec4 kaleidomap=texture(iChannel1, transformKaleidoMap(at,currentTime));
  vec4 kaleidomap2=texture(iChannel2, transformKaleidoMap(at,currentTime));
  float th = .01 * iTime;
  v.x = at.x+kaleidomap.x * cos(th) - at.y* distance(at.x,sin(iTime*0.1*kaleidomap.x)*0.5) * sin(th) - 0.8 * sin(th);
  v.y = at.x*kaleidomap2.y * sin(th) + at.y* distance(at.y,cos(iTime*0.1*kaleidomap.y)*0.5) * cos(th) + 1.2 * cos(th);
  return v;

}
vec4 scene(vec2 at, vec2 uv)
{
  float distanceFromCenter=distance(uv, vec2(0,0));
  float radialWave=sin(distanceFromCenter*20.+iTime);
  vec2 presentTime=transform(at, iTime) * max(0.001,radialWave*(0.5-distanceFromCenter)*0.4);
  vec2 futureTime=transform(at, iTime*0.03) * 5.0;
  float timeSin=(sin(cos(iTime/4.)*sin(iTime/12.))+1.)/2.;
  vec2 mixedtimes = mix(presentTime,futureTime,timeSin);
  return texture(iChannel0, mixedtimes);

}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord.xy / iResolution.xy;
  uv.x = mix(-1., 1.0, uv.x);
  uv.y = mix(-1., 1.0, uv.y);
  uv.y *= iResolution.y / iResolution.x;
  float scale = smoothstep(-1.5, 1., cos(iTime/4.)*sin(iTime/12.)) * 3. - 0.25;
  uv*=scale;
  fragColor = scene(kaleido(uv),uv);
  fragColor.r = (abs(sin(iTime/2.)) * fragColor.r) * smoothstep(-2., 0.5, sin(iTime)) * 2.;
  fragColor.g = (abs(cos(iTime/3.)) * fragColor.g);
  fragColor.b = (abs(cos(iTime/4.)) * fragColor.b);

}
