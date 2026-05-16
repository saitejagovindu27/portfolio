/**
 * 3D Skills Orbit — Canvas 2D only, no external libs
 * Fixes: centering, tilt clamping, dot artifact removed,
 * canvas contained, IntersectionObserver pause, relative radii.
 */
(function () {
  'use strict';

  var wrapper = document.getElementById('orbitWrapper');
  if (!wrapper) return;

  // ── Canvas setup ──────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.id = 'skillsOrbit';
  canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;top:0;left:0;z-index:0;';
  wrapper.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;

  // Logical dimensions (CSS pixels)
  var W = 0, H = 0, cx = 0, cy = 0;
  var innerR = 0, outerR = 0;

  function resize() {
    W  = wrapper.offsetWidth;
    H  = wrapper.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    // Radii relative to smallest half — pills stay within canvas
    var minHalf = Math.min(cx, cy);
    innerR = minHalf * 0.40;
    outerR = minHalf * 0.72;
    // Update canvas pixel buffer
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  // ── Skill nodes ───────────────────────────────────────────
  // inner ring: 2 nodes, outer ring: 5 nodes
  var innerLabels = ['AI', 'IA'];
  var outerLabels = ['Strategy', 'Data UX', 'Research', 'Design Systems', 'Prototyping'];

  function makeNodes(labels, R) {
    return labels.map(function (label, i) {
      var angle = (i / labels.length) * Math.PI * 2;
      return { label: label, angle: angle, R: R };
    });
  }

  var innerNodes, outerNodes;
  // Will be rebuilt after first resize

  // ── Tilt state ─────────────────────────────────────────────
  // Default tilt: slight X so it looks 3D even at rest
  var tiltX  = 0.32, tiltY  = 0;
  var txTarget = 0.32, tyTarget = 0;
  var LERP = 0.05;
  var FOCAL = 700;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // ── Mouse tracking — relative to canvas rect ───────────────
  function onMouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    var nx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2);
    var ny = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2);
    nx = clamp(nx, -1, 1);
    ny = clamp(ny, -1, 1);
    txTarget = clamp(0.32 + ny * 0.10, 0.20, 0.44);
    tyTarget = clamp(nx * 0.10,       -0.10, 0.10);
  }
  function onMouseLeave() {
    txTarget = 0.32;
    tyTarget = 0;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  wrapper.addEventListener('mouseleave', onMouseLeave);

  // ── 3D Projection ─────────────────────────────────────────
  function project(x3, y3, z3) {
    // Rotate around X
    var y2  =  y3 * Math.cos(tiltX) - z3 * Math.sin(tiltX);
    var z2  =  y3 * Math.sin(tiltX) + z3 * Math.cos(tiltX);
    // Rotate around Y
    var x2  =  x3 * Math.cos(tiltY) + z2 * Math.sin(tiltY);
    var zf  = -x3 * Math.sin(tiltY) + z2 * Math.cos(tiltY);
    // Perspective scale
    var s = FOCAL / (FOCAL + zf + FOCAL * 0.25);
    return { x: cx + x2 * s, y: cy + y2 * s, scale: s, z: zf };
  }

  // ── Draw helpers ──────────────────────────────────────────
  function pillPath(px, py, pw, ph, r) {
    if (ctx.roundRect) {
      ctx.roundRect(px, py, pw, ph, r);
    } else {
      ctx.moveTo(px + r, py);
      ctx.lineTo(px + pw - r, py);
      ctx.quadraticCurveTo(px + pw, py, px + pw, py + r);
      ctx.lineTo(px + pw, py + ph - r);
      ctx.quadraticCurveTo(px + pw, py + ph, px + pw - r, py + ph);
      ctx.lineTo(px + r, py + ph);
      ctx.quadraticCurveTo(px, py + ph, px, py + ph - r);
      ctx.lineTo(px, py + r);
      ctx.quadraticCurveTo(px, py, px + r, py);
    }
  }

  function drawRing(R, segments) {
    ctx.beginPath();
    for (var i = 0; i <= segments; i++) {
      var a  = (i / segments) * Math.PI * 2;
      var p  = project(Math.cos(a) * R, 0, Math.sin(a) * R);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawNode(node) {
    var p = project(Math.cos(node.angle) * node.R, 0, Math.sin(node.angle) * node.R);

    // Depth: 1 = front, 0 = back
    var depth = clamp((p.scale - 0.5) / (1 - 0.5), 0, 1);
    var alpha  = 0.20 + depth * 0.80;
    var pillH  = 28;
    var fSize  = Math.round(11 + depth * 2);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = '500 ' + fSize + 'px Inter, sans-serif';
    var tw = ctx.measureText(node.label).width;
    var pw = tw + 28;
    var px = p.x - pw / 2;
    var py = p.y - pillH / 2;

    // Blur on back pills only
    var blur = (1 - depth) * 3.5;
    if (blur > 0.3) ctx.filter = 'blur(' + blur.toFixed(1) + 'px)';

    // Pill fill
    var bg = depth > 0.5
      ? 'rgba(255,255,255,' + (0.04 + depth * 0.07) + ')'
      : 'rgba(8,12,28,0.75)';
    ctx.beginPath();
    pillPath(px, py, pw, pillH, pillH / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.04 + depth * 0.12) + ')';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.filter = 'none';

    // Label — always horizontal
    ctx.globalAlpha = alpha;
    ctx.fillStyle = depth > 0.5
      ? 'rgba(255,255,255,' + (0.55 + depth * 0.45) + ')'
      : 'rgba(255,255,255,0.28)';
    ctx.font = '500 ' + fSize + 'px Inter, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, p.x, p.y);

    ctx.restore();
  }

  // ── Center pill with breathe ───────────────────────────────
  var breatheT = 0;

  function drawCenter() {
    var pulse = Math.sin(breatheT * 0.7) * 0.5 + 0.5;
    ctx.save();

    // Glow — use arc only, no stray circle artifact
    var glowR = 90 + pulse * 10;
    var grd   = ctx.createRadialGradient(cx, cy, 10, cx, cy, glowR);
    grd.addColorStop(0, 'rgba(59,130,246,' + (0.15 + pulse * 0.08) + ')');
    grd.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Pill
    var pillW = 172, pillH = 40;
    var grad  = ctx.createLinearGradient(cx - pillW / 2, cy, cx + pillW / 2, cy);
    grad.addColorStop(0, 'hsl(' + (218 + pulse * 18) + ',88%,' + (48 + pulse * 9) + '%)');
    grad.addColorStop(1, 'hsl(' + (200 + pulse * 12) + ',82%,42%)');

    ctx.beginPath();
    pillPath(cx - pillW / 2, cy - pillH / 2, pillW, pillH, pillH / 2);
    ctx.shadowColor = 'rgba(59,130,246,0.55)';
    ctx.shadowBlur  = 18 + pulse * 12;
    ctx.fillStyle   = grad;
    ctx.fill();
    ctx.shadowBlur  = 0;

    // Text
    ctx.fillStyle    = 'rgba(255,255,255,0.97)';
    ctx.font         = '600 14px Inter, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Systems Thinking', cx, cy);

    ctx.restore();
  }

  // ── Animation loop ────────────────────────────────────────
  var raf     = null;
  var running = false;
  var speed   = 0.0038;

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    breatheT += 0.016;

    // Lerp tilt
    tiltX += (txTarget - tiltX) * LERP;
    tiltY += (tyTarget - tiltY) * LERP;

    // Advance rotation
    innerNodes.forEach(function (n) { n.angle += speed * 1.35; });
    outerNodes.forEach(function (n) { n.angle += speed; });

    drawRing(innerR, 72);
    drawRing(outerR, 72);

    // Back-to-front sort across both rings
    var all = innerNodes.concat(outerNodes);
    var projected = all.map(function (n) {
      return { node: n, z: project(Math.cos(n.angle) * n.R, 0, Math.sin(n.angle) * n.R).z };
    });
    projected.sort(function (a, b) { return a.z - b.z; });
    projected.forEach(function (item) { drawNode(item.node); });

    drawCenter();

    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    tick();
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  // ── IntersectionObserver — pause when off-screen ──────────
  var io = new IntersectionObserver(function (entries) {
    entries[0].isIntersecting ? start() : stop();
  }, { threshold: 0.1 });
  io.observe(wrapper);

  // ── ResizeObserver — recalculate on container change ──────
  function doResize() {
    resize();
    // Rebuild nodes with updated radii
    innerNodes = makeNodes(innerLabels, innerR);
    outerNodes = makeNodes(outerLabels, outerR);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(doResize).observe(wrapper);
  } else {
    window.addEventListener('resize', doResize);
  }

  // Initial sizing
  doResize();
  start();
})();
