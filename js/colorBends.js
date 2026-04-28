/**
 * ColorBends — Vanilla JS (converted from React Bits)
 * Uses Three.js (already loaded globally)
 */
(function() {
  var MAX_COLORS = 8;

  var frag = [
    '#define MAX_COLORS ' + MAX_COLORS,
    'uniform vec2 uCanvas;',
    'uniform float uTime;',
    'uniform float uSpeed;',
    'uniform vec2 uRot;',
    'uniform int uColorCount;',
    'uniform vec3 uColors[MAX_COLORS];',
    'uniform int uTransparent;',
    'uniform float uScale;',
    'uniform float uFrequency;',
    'uniform float uWarpStrength;',
    'uniform vec2 uPointer;',
    'uniform float uMouseInfluence;',
    'uniform float uParallax;',
    'uniform float uNoise;',
    'uniform int uIterations;',
    'uniform float uIntensity;',
    'uniform float uBandWidth;',
    'varying vec2 vUv;',
    'void main() {',
    '  float t = uTime * uSpeed;',
    '  vec2 p = vUv * 2.0 - 1.0;',
    '  p += uPointer * uParallax * 0.1;',
    '  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);',
    '  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);',
    '  q /= max(uScale, 0.0001);',
    '  q /= 0.5 + 0.2 * dot(q, q);',
    '  q += 0.2 * cos(t) - 7.56;',
    '  vec2 toward = (uPointer - rp);',
    '  q += toward * uMouseInfluence * 0.2;',
    '  for (int j = 0; j < 5; j++) {',
    '    if (j >= uIterations - 1) break;',
    '    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));',
    '    q += (rr - q) * 0.15;',
    '  }',
    '  vec3 col = vec3(0.0);',
    '  float a = 1.0;',
    '  if (uColorCount > 0) {',
    '    vec2 s = q;',
    '    vec3 sumCol = vec3(0.0);',
    '    float cover = 0.0;',
    '    for (int i = 0; i < MAX_COLORS; ++i) {',
    '      if (i >= uColorCount) break;',
    '      s -= 0.01;',
    '      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));',
    '      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);',
    '      float kBelow = clamp(uWarpStrength, 0.0, 1.0);',
    '      float kMix = pow(kBelow, 0.3);',
    '      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);',
    '      vec2 disp = (r - s) * kBelow;',
    '      vec2 warped = s + disp * gain;',
    '      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);',
    '      float m = mix(m0, m1, kMix);',
    '      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));',
    '      sumCol += uColors[i] * w;',
    '      cover = max(cover, w);',
    '    }',
    '    col = clamp(sumCol, 0.0, 1.0);',
    '    a = uTransparent > 0 ? cover : 1.0;',
    '  } else {',
    '    vec2 s = q;',
    '    for (int k = 0; k < 3; ++k) {',
    '      s -= 0.01;',
    '      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));',
    '      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);',
    '      float kBelow = clamp(uWarpStrength, 0.0, 1.0);',
    '      float kMix = pow(kBelow, 0.3);',
    '      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);',
    '      vec2 disp = (r - s) * kBelow;',
    '      vec2 warped = s + disp * gain;',
    '      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);',
    '      float m = mix(m0, m1, kMix);',
    '      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));',
    '    }',
    '    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;',
    '  }',
    '  col *= uIntensity;',
    '  if (uNoise > 0.0001) {',
    '    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);',
    '    col += (n - 0.5) * uNoise;',
    '    col = clamp(col, 0.0, 1.0);',
    '  }',
    '  vec3 rgb = (uTransparent > 0) ? col * a : col;',
    '  gl_FragColor = vec4(rgb, a);',
    '}'
  ].join('\n');

  var vert = [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position, 1.0);',
    '}'
  ].join('\n');

  function hexToVec3(hex) {
    var h = hex.replace('#', '').trim();
    var r, g, b;
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
    }
    return new THREE.Vector3(r / 255, g / 255, b / 255);
  }

  function initColorBends(container, options) {
    if (!container || typeof THREE === 'undefined') return;

    var opts = Object.assign({
      colors: ['#1a1a2e', '#3b82f6', '#6366f1'],
      rotation: 90,
      speed: 0.15,
      scale: 1,
      frequency: 1,
      warpStrength: 0.8,
      mouseInfluence: 0.5,
      noise: 0.1,
      parallax: 0.3,
      iterations: 1,
      intensity: 0.8,
      bandWidth: 6,
      transparent: true
    }, options || {});

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var geometry = new THREE.PlaneGeometry(2, 2);

    var uColorsArray = [];
    for (var i = 0; i < MAX_COLORS; i++) uColorsArray.push(new THREE.Vector3(0, 0, 0));
    var parsedColors = (opts.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(hexToVec3);
    for (var j = 0; j < parsedColors.length; j++) uColorsArray[j].copy(parsedColors[j]);

    var rad = (opts.rotation * Math.PI) / 180;

    var material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: opts.speed },
        uRot: { value: new THREE.Vector2(Math.cos(rad), Math.sin(rad)) },
        uColorCount: { value: parsedColors.length },
        uColors: { value: uColorsArray },
        uTransparent: { value: opts.transparent ? 1 : 0 },
        uScale: { value: opts.scale },
        uFrequency: { value: opts.frequency },
        uWarpStrength: { value: opts.warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: opts.mouseInfluence },
        uParallax: { value: opts.parallax },
        uNoise: { value: opts.noise },
        uIterations: { value: opts.iterations },
        uIntensity: { value: opts.intensity },
        uBandWidth: { value: opts.bandWidth }
      },
      premultipliedAlpha: true,
      transparent: true
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none;';
    container.appendChild(renderer.domElement);

    var clock = new THREE.Clock();
    var pointerTarget = new THREE.Vector2(0, 0);
    var pointerCurrent = new THREE.Vector2(0, 0);

    function handleResize() {
      var w = container.clientWidth || 1;
      var h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      material.uniforms.uCanvas.value.set(w, h);
    }
    handleResize();

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(handleResize);
      ro.observe(container);
    } else {
      window.addEventListener('resize', handleResize);
    }

    container.addEventListener('pointermove', function(e) {
      var rect = container.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      var y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTarget.set(x, y);
    });

    function loop() {
      var dt = clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      var amt = Math.min(1, dt * 8);
      pointerCurrent.lerp(pointerTarget, amt);
      material.uniforms.uPointer.value.copy(pointerCurrent);
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    var el = document.getElementById('color-bends-bg');
    if (el) {
      initColorBends(el, {
        colors: ['#0a0a1a', '#1e3a5f', '#3b82f6', '#6366f1'],
        rotation: 90,
        speed: 0.12,
        scale: 1.2,
        frequency: 0.8,
        warpStrength: 0.6,
        mouseInfluence: 0.4,
        noise: 0.08,
        parallax: 0.3,
        iterations: 1,
        intensity: 0.6,
        bandWidth: 5,
        transparent: true
      });
    }
  });
})();
