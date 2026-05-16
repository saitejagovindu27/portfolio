/**
 * 3D Orbit Canvas — Pure requestAnimationFrame + Canvas 2D
 * No external libraries. Perspective projection, depth blur,
 * mouse-tilt with lerp 0.06, gradient breathe on center.
 * All text horizontal & readable at all times.
 */
(function () {
  var container = document.getElementById('heroOrbit');
  if (!container) return;

  // Hide existing DOM children (rings, nodes, center div)
  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.overflow = 'visible';

  var W = container.offsetWidth  || 440;
  var H = container.offsetHeight || 440;

  var canvas = document.createElement('canvas');
  canvas.width  = W * window.devicePixelRatio;
  canvas.height = H * window.devicePixelRatio;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.overflow = 'visible';
  container.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  var cx = W / 2;
  var cy = H / 2;
  var FOCAL = 600; // perspective distance

  // Skills to orbit
  var labels = ['AI', 'Data UX', 'Research', 'IA', 'Design Systems', 'Prototyping', 'Strategy'];
  var count  = labels.length;

  // Build 3D points evenly spaced on a circle
  var R = 145; // orbit radius
  var nodes = labels.map(function (label, i) {
    var angle = (i / count) * Math.PI * 2;
    return {
      label: label,
      baseAngle: angle,
      angle: angle,
      y3d: 0          // stays on y=0 plane; tilted by camera
    };
  });

  // Camera tilt state (target and current)
  var tiltX = 0, tiltY = 0;      // current (lerped)
  var targetTiltX = 0, targetTiltY = 0;
  var LERP = 0.06;
  var MAX_TILT = 0.45; // radians

  // Breathe animation for center
  var breatheT = 0;

  // Track mouse relative to container
  var rect = container.getBoundingClientRect();
  function onMouseMove(e) {
    rect = container.getBoundingClientRect();
    var mx = e.clientX - rect.left - cx;
    var my = e.clientY - rect.top  - cy;
    var nx = mx / cx; // -1 to 1
    var ny = my / cy;
    // Tilt: moving right tilts right, etc.
    targetTiltY =  nx * MAX_TILT;
    targetTiltX = -ny * MAX_TILT * 0.6;
  }
  function onMouseLeave() {
    targetTiltX = 0;
    targetTiltY = 0;
  }

  // Use the whole window to track mouse so tilt works even without hovering directly
  window.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);

  // Project a 3D point (rotating in XZ plane, tilted) → 2D
  function project(x3, y3, z3) {
    // Apply tilt rotations
    // Tilt around X axis
    var y2 = y3 * Math.cos(tiltX) - z3 * Math.sin(tiltX);
    var z2 = y3 * Math.sin(tiltX) + z3 * Math.cos(tiltX);
    // Tilt around Y axis
    var x2 = x3 * Math.cos(tiltY) + z2 * Math.sin(tiltY);
    var z3f = -x3 * Math.sin(tiltY) + z2 * Math.cos(tiltY);

    // Perspective
    var scale = FOCAL / (FOCAL + z3f + FOCAL * 0.3);
    return {
      x: cx + x2 * scale,
      y: cy + y2 * scale,
      scale: scale,
      z: z3f
    };
  }

  // Orbit rotation speed
  var orbitSpeed = 0.004;

  function drawRing(tiltX, tiltY, radius, segments) {
    ctx.beginPath();
    for (var i = 0; i <= segments; i++) {
      var a = (i / segments) * Math.PI * 2;
      var x3 = Math.cos(a) * radius;
      var z3 = Math.sin(a) * radius;
      var p = project(x3, 0, z3);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawNode(node, time) {
    var x3 = Math.cos(node.angle) * R;
    var z3 = Math.sin(node.angle) * R;
    var p = project(x3, 0, z3);

    // depth 0→1 where 1 = front, 0 = back
    var depth = (p.scale - 0.55) / (1 - 0.55);
    depth = Math.max(0, Math.min(1, depth));

    var alpha   = 0.25 + depth * 0.75;
    var pillH   = 28;
    var fontSize= Math.round(11 + depth * 2);

    ctx.save();
    ctx.globalAlpha = alpha;

    // Measure text to size pill
    ctx.font = '500 ' + fontSize + 'px Inter, sans-serif';
    var tw = ctx.measureText(node.label).width;
    var pw = tw + 28;

    var px = p.x - pw / 2;
    var py = p.y - pillH / 2;

    // Depth blur: back nodes get blur
    var blurAmt = (1 - depth) * 4;
    if (blurAmt > 0.4) ctx.filter = 'blur(' + blurAmt.toFixed(1) + 'px)';

    // Pill background
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(px, py, pw, pillH, pillH / 2)
                  : roundRectFallback(ctx, px, py, pw, pillH, pillH / 2);

    // Front nodes: slightly glowing; back: dark
    var bg = depth > 0.5
      ? 'rgba(255,255,255,' + (0.04 + depth * 0.06) + ')'
      : 'rgba(10,15,30,0.7)';
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.05 + depth * 0.1) + ')';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.filter = 'none';

    // Text — always horizontal (no rotation)
    ctx.globalAlpha = alpha;
    ctx.fillStyle = depth > 0.5
      ? 'rgba(255,255,255,' + (0.6 + depth * 0.4) + ')'
      : 'rgba(255,255,255,0.3)';
    ctx.font = '500 ' + fontSize + 'px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, p.x, p.y);

    ctx.restore();
  }

  function roundRectFallback(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  function drawCenter(time) {
    var pulse = Math.sin(breatheT * 0.8) * 0.5 + 0.5; // 0–1
    var r1 = 52 + pulse * 6;

    ctx.save();

    // Glow halo
    var grd = ctx.createRadialGradient(cx, cy, r1 * 0.3, cx, cy, r1 * 2.2);
    grd.addColorStop(0, 'rgba(59,130,246,' + (0.18 + pulse * 0.1) + ')');
    grd.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r1 * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Pill background — gradient breathe
    var grad = ctx.createLinearGradient(cx - r1, cy - 16, cx + r1, cy + 16);
    var c1 = 'hsl(' + (220 + pulse * 20) + ',90%,' + (50 + pulse * 8) + '%)';
    var c2 = 'hsl(' + (200 + pulse * 15) + ',85%,42%)';
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);

    var pillW = 180;
    var pillH = 40;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(cx - pillW/2, cy - pillH/2, pillW, pillH, pillH/2)
      : (function(){
          roundRectFallback(ctx, cx - pillW/2, cy - pillH/2, pillW, pillH, pillH/2);
        })();
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(59,130,246,0.5)';
    ctx.shadowBlur = 20 + pulse * 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = 'white';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Systems Thinking', cx, cy);

    ctx.restore();
  }

  var raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    breatheT += 0.016;

    // Lerp camera tilt
    tiltX += (targetTiltX - tiltX) * LERP;
    tiltY += (targetTiltY - tiltY) * LERP;

    // Advance orbit angles
    nodes.forEach(function (n) {
      n.angle += orbitSpeed;
    });

    // Draw rings
    drawRing(tiltX, tiltY, R * 0.58, 80);
    drawRing(tiltX, tiltY, R, 80);

    // Sort nodes back-to-front by projected z so front ones paint on top
    var projected = nodes.map(function (n) {
      var x3 = Math.cos(n.angle) * R;
      var z3 = Math.sin(n.angle) * R;
      var p  = project(x3, 0, z3);
      return { node: n, z: p.z };
    });
    projected.sort(function (a, b) { return a.z - b.z; });

    projected.forEach(function (item) {
      drawNode(item.node, breatheT);
    });

    // Center always on top
    drawCenter(breatheT);

    raf = requestAnimationFrame(tick);
  }

  tick();

  // Resize handling
  window.addEventListener('resize', function () {
    W = container.offsetWidth  || 440;
    H = container.offsetHeight || 440;
    canvas.width  = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    cx = W / 2; cy = H / 2;
  });
})();
