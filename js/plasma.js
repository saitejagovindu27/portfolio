/**
 * Plasma Background Effect — Vanilla JS port of React Bits <Plasma />
 * Uses OGL (loaded via CDN with exports polyfill)
 */
(function() {
  'use strict';

  // Skip on mobile for performance
  if (window.innerWidth < 768) return;

  const container = document.getElementById('plasma-layer');
  if (!container) return;

  // OGL access — CDN UMD attaches to `exports` via the polyfill
  let OGL = null;
  if (typeof exports !== 'undefined' && exports.Renderer) {
    OGL = exports;
  } else if (typeof ogl !== 'undefined') {
    OGL = ogl;
  } else if (typeof window.ogl !== 'undefined') {
    OGL = window.ogl;
  } else if (typeof Renderer !== 'undefined') {
    OGL = { Renderer, Program, Mesh, Triangle };
  }

  if (!OGL || !OGL.Renderer) {
    console.warn('Plasma: OGL not found. Tried exports, ogl, window.ogl, globals.');
    return;
  }

  const { Renderer, Program, Mesh, Triangle } = OGL;

  const hexToRgb = function(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [1, 0.5, 0.2];
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
  };

  // Settings
  var color = '#3b82f6';
  var speed = 0.4;
  var scale = 1.2;
  var opacity = 0.6; // TEMP DEBUG — reduce to 0.25 after confirming render
  var mouseInteractive = true;

  var customColorRgb = hexToRgb(color);

  var vertexShader = 
    'attribute vec2 position;' +
    'attribute vec2 uv;' +
    'varying vec2 vUv;' +
    'void main() {' +
    '  vUv = uv;' +
    '  gl_Position = vec4(position, 0.0, 1.0);' +
    '}';

  var fragmentShader = 
    'precision highp float;' +
    'uniform vec2 iResolution;' +
    'uniform float iTime;' +
    'uniform vec3 uCustomColor;' +
    'uniform float uSpeed;' +
    'uniform float uDirection;' +
    'uniform float uScale;' +
    'uniform float uOpacity;' +
    'uniform vec2 uMouse;' +
    'uniform float uMouseInteractive;' +
    '' +
    'void main() {' +
    '  vec2 C = gl_FragCoord.xy;' +
    '  vec2 center = iResolution.xy * 0.5;' +
    '  C = (C - center) / uScale + center;' +
    '  vec2 mouseOffset = (uMouse - center) * 0.0002;' +
    '  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);' +
    '  float i = 0.0;' +
    '  float d = 0.0;' +
    '  float z = 0.0;' +
    '  float T = iTime * uSpeed * uDirection;' +
    '  vec3 O = vec3(0.0);' +
    '  vec3 p, S;' +
    '  vec4 o = vec4(0.0);' +
    '  for (int j = 0; j < 40; j++) {' +
    '    i = float(j);' +
    '    p = z * normalize(vec3(C - 0.5 * iResolution.xy, iResolution.y));' +
    '    p.z -= 4.0;' +
    '    S = p;' +
    '    d = p.y - T;' +
    '    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);' +
    '    float angle = p.y + T;' +
    '    float ca = cos(angle);' +
    '    float sa = sin(angle);' +
    '    vec2 Q = vec2(p.x * ca - p.z * sa, p.x * sa + p.z * ca);' +
    '    p.x = Q.x; p.z = Q.y;' +
    '    z += d = abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 0.001;' +
    '    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));' +
    '    O += o.w / d * o.xyz;' +
    '  }' +
    '  vec3 rgb = O / 10000.0;' +
    '  rgb = rgb / (1.0 + abs(rgb));' +
    '  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;' +
    '  vec3 finalColor = intensity * uCustomColor;' +
    '  float alpha = length(rgb) * uOpacity;' +
    '  gl_FragColor = vec4(finalColor, alpha);' +
    '}';

  var renderer;
  try {
    renderer = new Renderer({
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5)
    });
  } catch(e) {
    console.warn('Plasma: WebGL init failed', e);
    return;
  }

  var gl = renderer.gl;
  if (!gl) return;

  var canvas = gl.canvas;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  console.log('Plasma: Canvas mounted successfully');

  var geometry = new Triangle(gl);

  var program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      iTime: { value: 0 },
      iResolution: { value: new Float32Array([1, 1]) },
      uCustomColor: { value: new Float32Array(customColorRgb) },
      uSpeed: { value: speed * 0.4 },
      uDirection: { value: 1.0 },
      uScale: { value: scale },
      uOpacity: { value: opacity },
      uMouse: { value: new Float32Array([0, 0]) },
      uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 }
    }
  });

  var mesh = new Mesh(gl, { geometry: geometry, program: program });

  // Mouse interaction
  if (mouseInteractive) {
    document.addEventListener('mousemove', function(e) {
      program.uniforms.uMouse.value[0] = e.clientX;
      program.uniforms.uMouse.value[1] = e.clientY;
    });
  }

  // Resize
  function setSize() {
    var w = Math.max(1, window.innerWidth);
    var h = Math.max(1, window.innerHeight);
    renderer.setSize(w, h);
    program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
    program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
  }
  window.addEventListener('resize', setSize);
  setSize();

  // Animation loop
  var raf = 0;
  var isVisible = true;
  var t0 = performance.now();

  var io = new IntersectionObserver(function(entries) {
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
  console.log('Plasma: Animation started');
})();
