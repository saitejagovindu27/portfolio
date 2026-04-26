/**
 * Plasma Background Effect — Vanilla JS port of React Bits <Plasma />
 * Uses OGL (loaded via CDN) for WebGL rendering
 */
(function() {
  'use strict';

  // Skip on mobile for performance
  if (window.innerWidth < 768) return;

  const container = document.getElementById('plasma-layer');
  if (!container) return;

  // Wait for OGL to be available
  if (typeof Renderer === 'undefined' && typeof window.ogl === 'undefined') {
    console.warn('Plasma: OGL not loaded');
    return;
  }

  const { Renderer, Program, Mesh, Triangle } = window.ogl || window;

  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 0.5, 0.2];
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
  };

  // Settings — subtle premium values
  const color = '#3b82f6';
  const speed = 0.4;
  const scale = 1.2;
  const opacity = 0.25;
  const mouseInteractive = true;

  const customColorRgb = hexToRgb(color);

  const vertexShader = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const fragmentShader = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

  let renderer;
  try {
    renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5)
    });
  } catch(e) {
    console.warn('Plasma: WebGL2 not supported');
    return;
  }

  const gl = renderer.gl;
  if (!gl) return;

  const canvas = gl.canvas;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uCustomColor: { value: new Float32Array(customColorRgb) },
      uUseCustomColor: { value: 1.0 },
      uSpeed: { value: speed * 0.4 },
      uDirection: { value: 1.0 },
      uScale: { value: scale },
      uOpacity: { value: opacity },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });

  // Mouse interaction
  const mousePos = { x: 0, y: 0 };
  if (mouseInteractive) {
    document.addEventListener('mousemove', function(e) {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      program.uniforms.uMouse.value[0] = mousePos.x;
      program.uniforms.uMouse.value[1] = mousePos.y;
    });
  }

  // Resize
  function setSize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    renderer.setSize(w, h);
    program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
    program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
  }
  window.addEventListener('resize', setSize);
  setSize();

  // Animation loop with visibility check
  let raf = 0;
  let isVisible = true;
  const t0 = performance.now();

  const io = new IntersectionObserver(function(entries) {
    isVisible = entries[0].isIntersecting;
    if (isVisible) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }
  }, { threshold: 0 });
  io.observe(container);

  function loop(t) {
    if (!isVisible) return;
    program.uniforms.iTime.value = (t - t0) * 0.001;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  }

  raf = requestAnimationFrame(loop);
})();
