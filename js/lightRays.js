/**
 * LightRays - Vanilla JS port of React Bits LightRays (WebGL via OGL)
 */
(function () {
  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1],16)/255, parseInt(m[2],16)/255, parseInt(m[3],16)/255] : [1,1,1];
  };

  const getAnchorAndDir = (origin, w, h) => {
    const o = 0.2;
    switch (origin) {
      case 'top-left':      return { anchor:[0,-o*h],           dir:[0,1]  };
      case 'top-right':     return { anchor:[w,-o*h],           dir:[0,1]  };
      case 'left':          return { anchor:[-o*w,0.5*h],       dir:[1,0]  };
      case 'right':         return { anchor:[(1+o)*w,0.5*h],    dir:[-1,0] };
      case 'bottom-left':   return { anchor:[0,(1+o)*h],        dir:[0,-1] };
      case 'bottom-center': return { anchor:[0.5*w,(1+o)*h],    dir:[0,-1] };
      case 'bottom-right':  return { anchor:[w,(1+o)*h],        dir:[0,-1] };
      default:              return { anchor:[0.5*w,-o*h],       dir:[0,1]  };
    }
  };

  const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}`;

  const FRAG = `precision highp float;
uniform float iTime;uniform vec2 iResolution;uniform vec2 rayPos;uniform vec2 rayDir;
uniform vec3 raysColor;uniform float raysSpeed;uniform float lightSpread;uniform float rayLength;
uniform float pulsating;uniform float fadeDistance;uniform float saturation;
uniform vec2 mousePos;uniform float mouseInfluence;uniform float noiseAmount;uniform float distortion;
varying vec2 vUv;
float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float rayStr(vec2 src,vec2 refDir,vec2 coord,float sA,float sB,float spd){
  vec2 toC=coord-src;vec2 dn=normalize(toC);float ca=dot(dn,refDir);
  float da=ca+distortion*sin(iTime*2.0+length(toC)*0.01)*0.2;
  float sf=pow(max(da,0.0),1.0/max(lightSpread,0.001));
  float dist=length(toC);float md=iResolution.x*rayLength;
  float lf=clamp((md-dist)/md,0.0,1.0);
  float ff=clamp((iResolution.x*fadeDistance-dist)/(iResolution.x*fadeDistance),0.5,1.0);
  float pulse=pulsating>0.5?(0.8+0.2*sin(iTime*spd*3.0)):1.0;
  float bs=clamp((0.45+0.15*sin(da*sA+iTime*spd))+(0.3+0.2*cos(-da*sB+iTime*spd)),0.0,1.0);
  return bs*lf*ff*sf*pulse;
}
void main(){
  vec2 coord=vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y);
  vec2 frd=rayDir;
  if(mouseInfluence>0.0){vec2 mp=mousePos*iResolution.xy;frd=normalize(mix(rayDir,normalize(mp-rayPos),mouseInfluence));}
  vec4 r1=vec4(1.0)*rayStr(rayPos,frd,coord,36.2214,21.11349,1.5*raysSpeed);
  vec4 r2=vec4(1.0)*rayStr(rayPos,frd,coord,22.3991,18.0234,1.1*raysSpeed);
  vec4 fragColor=r1*0.5+r2*0.4;
  if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);fragColor.rgb*=(1.0-noiseAmount+noiseAmount*n);}
  float bri=1.0-(coord.y/iResolution.y);
  fragColor.x*=0.1+bri*0.8;fragColor.y*=0.3+bri*0.6;fragColor.z*=0.5+bri*0.5;
  if(saturation!=1.0){float g=dot(fragColor.rgb,vec3(0.299,0.587,0.114));fragColor.rgb=mix(vec3(g),fragColor.rgb,saturation);}
  fragColor.rgb*=raysColor;
  gl_FragColor=fragColor;
}`;

  function initLightRays(container, opts) {
    const { Renderer, Program, Triangle, Mesh } = OGL;
    const r = new Renderer({ dpr: Math.min(window.devicePixelRatio,2), alpha:true });
    const gl = r.gl;
    gl.canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
    container.appendChild(gl.canvas);

    const u = {
      iTime:         {value:0},       iResolution:  {value:[1,1]},
      rayPos:        {value:[0,0]},   rayDir:       {value:[0,1]},
      raysColor:     {value:hexToRgb(opts.raysColor||'#00ffff')},
      raysSpeed:     {value:opts.raysSpeed||1.5},
      lightSpread:   {value:opts.lightSpread||0.8},
      rayLength:     {value:opts.rayLength||1.2},
      pulsating:     {value:0},       fadeDistance: {value:1},
      saturation:    {value:1},       mousePos:     {value:[0.5,0.5]},
      mouseInfluence:{value:opts.mouseInfluence||0.1},
      noiseAmount:   {value:opts.noiseAmount||0.1},
      distortion:    {value:opts.distortion||0.05},
    };

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program: new Program(gl,{vertex:VERT,fragment:FRAG,uniforms:u}) });
    const mouse={x:0.5,y:0.5}, sm={x:0.5,y:0.5};

    const resize = () => {
      const {clientWidth:w,clientHeight:h}=container;
      r.setSize(w,h);
      const dpr=r.dpr;
      u.iResolution.value=[w*dpr,h*dpr];
      const {anchor,dir}=getAnchorAndDir(opts.raysOrigin||'top-center',w*dpr,h*dpr);
      u.rayPos.value=anchor; u.rayDir.value=dir;
    };

    let raf;
    const loop=t=>{
      u.iTime.value=t*0.001;
      sm.x=sm.x*0.92+mouse.x*0.08; sm.y=sm.y*0.92+mouse.y*0.08;
      u.mousePos.value=[sm.x,sm.y];
      r.render({scene:mesh});
      raf=requestAnimationFrame(loop);
    };

    const onMove=e=>{const rc=container.getBoundingClientRect();mouse.x=(e.clientX-rc.left)/rc.width;mouse.y=(e.clientY-rc.top)/rc.height;};
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove',onMove);
    resize();
    raf=requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const old = hero.querySelector('.light-rays');
    if (old) old.remove();
    const div = document.createElement('div');
    div.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden;';
    hero.insertBefore(div, hero.firstChild);
    const tryInit=()=>{ if(typeof OGL!=='undefined') initLightRays(div,{raysOrigin:'top-center',raysColor:'#00ffff',raysSpeed:1.5,lightSpread:0.8,rayLength:1.2,mouseInfluence:0.1,noiseAmount:0.1,distortion:0.05}); else setTimeout(tryInit,100); };
    tryInit();
  });
})();
