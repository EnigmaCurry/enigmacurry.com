// Adapted from https://www.shadertoy.com/view/XsXXDn
// "Creation"" by Silexars - Original credit to Danilo Guanabara
uniform float iGlobalTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vUv;

vec4 expandAndContract(void) {
  vec2 p = -2.0 + 4.0 * vUv;
  p.y = 0.1 * (p.x / p.y);
  p.x = 0.1 * (p.y / p.x);
  float l = length(p);
  float t = atan(cos(iGlobalTime)) * 0.5;

  vec3 c;
  for(int i=0; i < 3; i++) {
    t += sin(t*t);
    vec2 a = 0.5 * (p/l * (33.+sin(t)) * abs(1. + atan(l*9.-t*2.)));
    c[i] = 0.01/length( fract(0.75+a) - 0.5);
  }
  return vec4(c/l, 0.);
}

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

vec4 flame()
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

void main(void)
{
  gl_FragColor = flame();
}
