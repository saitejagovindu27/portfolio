/**
 * BorderGlow — Vanilla JS port of React Bits <BorderGlow />
 * Applies edge-sensitive glow effect to elements with [data-glow] attribute
 */
(function () {
  'use strict';

  function parseHSL(str) {
    var m = str.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!m) return { h: 40, s: 80, l: 80 };
    return { h: parseFloat(m[1]), s: parseFloat(m[2]), l: parseFloat(m[3]) };
  }

  function buildGlowVars(hslStr, intensity) {
    var c = parseHSL(hslStr);
    var base = c.h + 'deg ' + c.s + '% ' + c.l + '%';
    var ops = [100, 60, 50, 40, 30, 20, 10];
    var keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
    var vars = {};
    for (var i = 0; i < ops.length; i++) {
      vars['--glow-color' + keys[i]] = 'hsl(' + base + ' / ' + Math.min(ops[i] * intensity, 100) + '%)';
    }
    return vars;
  }

  var POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
  var GKEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
  var CMAP = [0, 1, 2, 0, 1, 2, 1];

  function buildGradientVars(colors) {
    var vars = {};
    for (var i = 0; i < 7; i++) {
      var c = colors[Math.min(CMAP[i], colors.length - 1)];
      vars[GKEYS[i]] = 'radial-gradient(at ' + POSITIONS[i] + ', ' + c + ' 0px, transparent 50%)';
    }
    vars['--gradient-base'] = 'linear-gradient(' + colors[0] + ' 0 100%)';
    return vars;
  }

  function initGlow(el) {
    var sensitivity = parseInt(el.dataset.glowSensitivity || '30');
    var glowColor = el.dataset.glowColor || '220 80 60';
    var intensity = parseFloat(el.dataset.glowIntensity || '1.0');
    var colors = (el.dataset.glowColors || '#3b82f6,#6366f1,#38bdf8').split(',');
    var radius = parseInt(el.dataset.glowRadius || '24');
    var padding = parseInt(el.dataset.glowPadding || '30');
    var spread = parseInt(el.dataset.glowSpread || '25');
    var bg = el.dataset.glowBg || 'transparent';

    // Add structure
    el.classList.add('border-glow-card');
    var light = document.createElement('span');
    light.className = 'edge-light';
    el.insertBefore(light, el.firstChild);

    var inner = document.createElement('div');
    inner.className = 'border-glow-inner';
    while (el.childNodes.length > 1) {
      inner.appendChild(el.childNodes[1]);
    }
    el.appendChild(inner);

    // Set CSS vars
    var glowVars = buildGlowVars(glowColor, intensity);
    var gradVars = buildGradientVars(colors);
    var allVars = Object.assign({}, glowVars, gradVars);

    el.style.setProperty('--card-bg', bg);
    el.style.setProperty('--edge-sensitivity', sensitivity);
    el.style.setProperty('--border-radius', radius + 'px');
    el.style.setProperty('--glow-padding', padding + 'px');
    el.style.setProperty('--cone-spread', spread);

    for (var key in allVars) {
      el.style.setProperty(key, allVars[key]);
    }

    // Mouse tracking
    el.addEventListener('pointermove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var dx = x - cx;
      var dy = y - cy;

      // Edge proximity
      var kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
      var ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
      var edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

      // Angle
      var rad = Math.atan2(dy, dx);
      var deg = rad * (180 / Math.PI) + 90;
      if (deg < 0) deg += 360;

      el.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
      el.style.setProperty('--cursor-angle', deg.toFixed(3) + 'deg');
    });
  }

  // Initialize all [data-glow] elements
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-glow]').forEach(initGlow);
  });
})();
