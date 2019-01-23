// Adapted from Star Nest by Pablo Roman Andrioli
/// Original is MIT Licenced

#define iterations 8
#define formuparam 0.53

#define volsteps 3
#define stepsize 0.2

#define zoom   10.800
#define tile   0.2850
#define speed  0.030

#define brightness 0.05
#define darkmatter 10.900
#define distfading 0.43730
#define saturation 1.4550

uniform vec2 iResolution;
uniform float iGlobalTime;
varying vec2 vUv;

vec4 starnest(void)
{
	//get coords and direction
	vec2 uv=vUv-1.25;
	uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*zoom,22.);
	float time=iGlobalTime*speed+.25;

	//mouse rotation
	//float a1=.5+iMouse.x/iResolution.x*2.;
  float a1 = abs(sin(time)) * uv.y * dir.x/12.;
	//float a2=.8+iMouse.y/iResolution.y*2.;
  float a2 = abs(sin(time)) * uv.x * dir.y/2.;
	mat2 rot1=mat2(cos(a1),sin(a1/time*time),-tan(a1),acos(a1));
	mat2 rot2=mat2(atan(a2*time),sin(a2),-cos(pow(a2,12.)) + 0.2,cos(pow(a2,9.)));
	dir.xz*=rot1;
	dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(time*2.,time,-2.);
	from.xz*=rot1;
	from.xy*=rot2;

	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) {
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation * sin(time*2.)); //color adjust
	return vec4(v*.01,1.);
}

void main(void) {
  gl_FragColor = starnest();
}
