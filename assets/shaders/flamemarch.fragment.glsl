/// Adapted from 'Flame' by XT95
/// https://www.shadertoy.com/view/MdX3zr
uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

float noise(vec3 p) //Thx to Las^Mercury
{
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

float sphere(vec3 p, vec4 spr)
{
	return length(spr.xyz-p) - spr.w;
}

float flame(vec3 p)
{
	float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));
	return d + (noise(p+vec3(.0,iGlobalTime*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;
}

float scene(vec3 p)
{
	return min(100.-length(p) , abs(flame(p)) );
}

vec4 raymarch(vec3 org, vec3 dir)
{
	float d = 0.0, glow = 0.0, eps = 0.02;
	vec3  p = org;
	bool glowed = false;
	for(int i=0; i<64; i++)
    {
      d = scene(p) + eps;
      p += d * dir;
      if( d>eps )
        {
          if(flame(p) < .0)
            glowed=true;
          if(glowed)
       			glow = float(i)/64.;
        }
    }
	return vec4(p,glow);
}

vec4 raymarch2(vec3 org, vec3 dir)
{
  float t = iGlobalTime / 43.;
	float d = 0.0, glow = 0.0, eps = 0.02;
	vec3  p = org;
	bool glowed = false;
	for(int i=0; i<32; i++)
    {
      d = scene(p) + eps;
      p += (d * dir / abs(tan(t/4.) + cos(2.*t))) - 0.01;
      if( d>eps )
        {
          if(flame(p) < .0)
            glowed=true;
          if(glowed)
       			glow = float(i)/54.;
        }
    }
	return vec4(p,glow);
}

vec4 raymarch3(vec3 org, vec3 dir)
{
  float t = iGlobalTime / 43.;
	float d = 0.0, glow = 0.0, eps = 0.02;
	vec3  p = org;
	bool glowed = false;
	for(int i=0; i<32; i++)
    {
      d = scene(p) + eps;
      p += (d * dir / abs(atan(t/4.) + cos(2.*t))) - 0.1;
      if( d>eps )
        {
          if(flame(p) < .0)
            glowed=true;
          if(glowed)
       			glow = float(i)/22.;
        }
    }
	return vec4(p,glow);
}

vec4 raymarch4(vec3 org, vec3 dir)
{
  float t = iGlobalTime / 43.;
	float d = 0.0, glow = 0.0, eps = 0.02;
	vec3  p = org;
	bool glowed = false;
	for(int i=0; i<18; i++)
    {
      p += ( d * 0.95 * dir + fract(cos(d)*eps/22.));
      d = scene(p) + eps;
      if( d>eps )
        {
          if(flame(p) < .0)
            glowed=true;
          if(glowed)
       			glow = float(i)/54.;
        }
    }
	return vec4(p,glow);
}
vec4 flameOrig()
{
	vec2 v = -1.0 + 2.0 * vUv;
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0., -2., 4.);
	vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));
	vec4 p = raymarch(org, dir);
	float glow = p.w;
	vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);
	return mix(vec4(0.), col, pow(glow*2.,4.));
}

vec4 plasma()
{
  float t = iGlobalTime;
	vec2 v = -1.0 + 2.0 * vUv;
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0., -1., 2.);
	vec3 dir = normalize(vec3(v.x*.6, -v.y - 2., -2.5));
	vec4 p = raymarch(org, dir);
	float glow = pow(p.w, 3.);
	vec4 col = mix(vec4(sin(t),cos(t),1.,1.), vec4(0.1,.5,1.,1.), p.y*sin(glow)*.4+.4);
	return mix(vec4(0.), col, glow);
}

vec4 plasma2()
{
  float t = iGlobalTime;
	vec2 v = -1.0 + 2.0 * vUv;
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0., -1., 2.);
	vec3 dir = normalize(vec3(v.x*0.6, -v.y - 1., -0.75)) * 0.8;
	vec4 p = raymarch2(org, dir);
	float glow = pow(p.w, 3.);
	vec4 col = mix(vec4(sin(t),cos(t) * 5.,1.,1.), vec4(0.1,0.5,cos(t/8.),1.), p.y*sin(glow)*.4+.4);
	return mix(vec4(0.), col / 2., glow);
}

vec4 plasmaSplit()
{
  float t = iGlobalTime;
	vec2 v = -1.0 + 2.0 * vUv;
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0., -0.1, 2.);
	vec3 dir = normalize(vec3(v.x*0.6, -v.y - 1., -0.75)) * 1.6;
	vec4 p = raymarch3(org, dir);
	float glow = pow(p.w, 1.) + sin(t/2.);
	vec4 col = mix(vec4(cos(t) + 4.,4.*t*cos(t),5.,1.), vec4(0.1,0.5,1.,1.), p.x+.4);
	return mix(vec4(0.), col / 444., glow);
}

vec4 plasmaSplit2()
{
  float t = sin(iGlobalTime);
	vec2 v = -1.0 + 2.0 * vUv;
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0., -0.1, 2.);
	vec3 dir = normalize(vec3(v.x*0.6, -v.y - 1., -0.75)) * 0.4;
	vec4 p = raymarch(org, dir);
	float glow = pow(p.w, 9.) - sin(t/2.);
	vec4 col = mix(vec4(cos(t),cos(t),1.,1.) / 2., vec4(0.01,0.15,1.,1.), p.x+.02);
	return mix(vec4(0.), col / 8., glow);
}

vec4 beach()
{
  float t = acos(iGlobalTime / 2018.);
  //float t = sin(iGlobalTime / 2.) - 0.95;
	vec2 v = -1.4 + 0.4 * acos(vUv);
	v.x *= iResolution.x/iResolution.y;

	vec3 org = vec3(0.2, 2., 8.);
	vec3 dir = normalize(vec3(v.x*0.16*sin(t*3.), -v.y - 1., -0.75)) * 0.4;
	vec4 p = raymarch4(org, dir);
	float glow = pow(p.w, 9.) + sin(t + 1.) + 1.;
	//vec4 col = mix(vec4(cos(t),cos(t + 2.),1.,1.) / 2., vec4(0.1,0.15,1.,1.), p.x/23.);
  vec4 col = mix(vec4(1.,1.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);

	return mix(vec4(0.), col, glow);
}

void main(void)
{
  float framemod = mod(iGlobalTime, 50.);
  if(framemod < 10.) {
    gl_FragColor = plasma();
  } else if (framemod < 20.) {
    gl_FragColor = plasma2();
  } else if (framemod < 30.) {
    gl_FragColor = plasmaSplit();
  } else if (framemod < 40.) {
    gl_FragColor = plasmaSplit2();
  } else if (framemod < 50.) {
    gl_FragColor = beach();
  } 
}
