/**
 * ColorBends — Vanilla JS (converted from React Bits)
 * Self-initializing — no DOMContentLoaded needed since loaded after Three.js
 */
(function() {
  'use strict';
  if (typeof THREE === 'undefined') { console.warn('ColorBends: THREE.js not loaded'); return; }

  var MAX_COLORS = 8;

  var frag = '#define MAX_COLORS ' + MAX_COLORS + '\n' +
    'uniform vec2 uCanvas;\n' +
    'uniform float uTime;\n' +
    'uniform float uSpeed;\n' +
    'uniform vec2 uRot;\n' +
    'uniform int uColorCount;\n' +
    'uniform vec3 uColors[MAX_COLORS];\n' +
    'uniform int uTransparent;\n' +
    'uniform float uScale;\n' +
    'uniform float uFrequency;\n' +
    'uniform float uWarpStrength;\n' +
    'uniform vec2 uPointer;\n' +
    'uniform float uMouseInfluence;\n' +
    'uniform float uParallax;\n' +
    'uniform float uNoise;\n' +
    'uniform int uIterations;\n' +
    'uniform float uIntensity;\n' +
    'uniform float uBandWidth;\n' +
    'varying vec2 vUv;\n' +
    'void main() {\n' +
    '  float t = uTime * uSpeed;\n' +
    '  vec2 p = vUv * 2.0 - 1.0;\n' +
    '  p += uPointer * uParallax * 0.1;\n' +
    '  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);\n' +
    '  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);\n' +
    '  q /= max(uScale, 0.0001);\n' +
    '  q /= 0.5 + 0.2 * dot(q, q);\n' +
    '  q += 0.2 * cos(t) - 7.56;\n' +
    '  vec2 toward = (uPointer - rp);\n' +
    '  q += toward * uMouseInfluence * 0.2;\n' +
    '  for (int j = 0; j < 5; j++) {\n' +
    '    if (j >= uIterations - 1) break;\n' +
    '    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));\n' +
    '    q += (rr - q) * 0.15;\n' +
    '  }\n' +
    '  vec3 col = vec3(0.0);\n' +
    '  float a = 1.0;\n' +
    '  if (uColorCount > 0) {\n' +
    '    vec2 s = q;\n' +
    '    vec3 sumCol = vec3(0.0);\n' +
    '    float cover = 0.0;\n' +
    '    for (int i = 0; i < MAX_COLORS; ++i) {\n' +
    '      if (i >= uColorCount) break;\n' +
    '      s -= 0.01;\n' +
    '      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));\n' +
    '      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);\n' +
    '      float kBelow = clamp(uWarpStrength, 0.0, 1.0);\n' +
    '      float kMix = pow(kBelow, 0.3);\n' +
    '      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);\n' +
    '      vec2 disp = (r - s) * kBelow;\n' +
    '      vec2 warped = s + disp * gain;\n' +
    '      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);\n' +
    '      float m = mix(m0, m1, kMix);\n' +
    '      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));\n' +
    '      sumCol += uColors[i] * w;\n' +
    '      cover = max(cover, w);\n' +
    '    }\n' +
    '    col = clamp(sumCol, 0.0, 1.0);\n' +
    '    a = uTransparent > 0 ? cover : 1.0;\n' +
    '  } else {\n' +
    '    vec2 s = q;\n' +
    '    for (int k = 0; k < 3; ++k) {\n' +
    '      s -= 0.01;\n' +
    '      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));\n' +
    '      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);\n' +
    '      float kBelow = clamp(uWarpStrength, 0.0, 1.0);\n' +
    '      float kMix = pow(kBelow, 0.3);\n' +
    '      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);\n' +
    '      vec2 disp = (r - s) * kBelow;\n' +
    '      vec2 warped = s + disp * gain;\n' +
    '      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);\n' +
    '      float m = mix(m0, m1, kMix);\n' +
    '      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));\n' +
    '    }\n' +
    '    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;\n' +
    '  }\n' +
    '  col *= uIntensity;\n' +
    '  if (uNoise > 0.0001) {\n' +
    '    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);\n' +
    '    col += (n - 0.5) * uNoise;\n' +
    '    col = clamp(col, 0.0, 1.0);\n' +
    '  }\n' +
    '  vec3 rgb = (uTransparent > 0) ? col * a : col;\n' +
    '  gl_FragColor = vec4(rgb, a);\n' +
    '}';

  var vert = 'varying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position, 1.0);\n}';

  function hexToVec3(hex) {
    var h = hex.replace('#', '');
    return new THREE.Vector3(
      parseInt(h.slice(0,2),16)/255,
      parseInt(h.slice(2,4),16)/255,
      parseInt(h.slice(4,6),16)/255
    );
  }

  var container = document.getElementById('color-bends-bg');
  if (!container) { console.warn('ColorBends: #color-bends-bg not found'); return; }

  // Colors
  var colorHexes = ['#0a0a1a', '#1e3a5f', '#3b82f6', '#6366f1'];
  var uColorsArray = [];
  for (var i = 0; i < MAX_COLORS; i++) uColorsArray.push(new THREE.Vector3(0,0,0));
  for (var j = 0; j < colorHexes.length; j++) uColorsArray[j].copy(hexToVec3(colorHexes[j]));

  var rad = (90 * Math.PI) / 180;

  var material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: 0.12 },
      uRot: { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
      uColorCount: { value: colorHexes.length },
      uColors: { value: uColorsArray },
      uTransparent: { value: 1 },
      uScale: { value: 1.2 },
      uFrequency: { value: 0.8 },
      uWarpStrength: { value: 0.6 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: 0.4 },
      uParallax: { value: 0.3 },
      uNoise: { value: 0.08 },
      uIterations: { value: 1 },
      uIntensity: { value: 0.6 },
      uBandWidth: { value: 5 }
    },
    premultipliedAlpha: true,
    transparent: true
  });

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  container.appendChild(renderer.domElement);

  var clock = new THREE.Clock();
  var pTarget = new THREE.Vector2(0, 0);
  var pCurrent = new THREE.Vector2(0, 0);

  function resize() {
    var w = container.clientWidth || 1;
    var h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    material.uniforms.uCanvas.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse on entire page for smoother interaction
  document.addEventListener('pointermove', function(e) {
    var rect = container.getBoundingClientRect();
    if (e.clientY < rect.top - 200 || e.clientY > rect.bottom + 200) return;
    var x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    var y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pTarget.set(x, y);
  });

  function loop() {
    var dt = clock.getDelta();
    material.uniforms.uTime.value = clock.elapsedTime;
    pCurrent.lerp(pTarget, Math.min(1, dt * 6));
    material.uniforms.uPointer.value.copy(pCurrent);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
