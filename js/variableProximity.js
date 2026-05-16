/**
 * VariableProximity — Vanilla JS implementation of React Bits component
 * Smarter version that preserves existing structure
 */
(function() {
  'use strict';

  const mousePosition = { x: 0, y: 0 };
  window.addEventListener('mousemove', ev => {
    mousePosition.x = ev.clientX;
    mousePosition.y = ev.clientY;
  });
  window.addEventListener('touchmove', ev => {
    const touch = ev.touches[0];
    mousePosition.x = touch.clientX;
    mousePosition.y = touch.clientY;
  });

  function parseSettings(settingsStr) {
    const map = new Map();
    settingsStr.split(',').forEach(s => {
      const parts = s.trim().split(' ');
      if (parts.length >= 2) {
        const name = parts[0].replace(/['"]/g, '');
        const value = parseFloat(parts[1]);
        map.set(name, value);
      }
    });
    return map;
  }

  function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function calculateFalloff(distance, radius, falloffType) {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloffType) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  }

  function initVariableProximity() {
    const elements = document.querySelectorAll('.variable-proximity');

    elements.forEach(el => {
      const fromStr = el.dataset.fromSettings || "'wght' 400, 'opsz' 9";
      const toStr = el.dataset.toSettings || "'wght' 1000, 'opsz' 40";
      const radius = parseFloat(el.dataset.radius) || 100;
      const falloff = el.dataset.falloff || 'gaussian';

      const fromSettings = parseSettings(fromStr);
      const toSettings = parseSettings(toStr);
      const axes = Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
        axis,
        fromValue,
        toValue: toSettings.get(axis) ?? fromValue
      }));

      const letterRefs = [];

      // Recursive function to split text nodes into letter spans while keeping other elements
      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const fragment = document.createDocumentFragment();
          const words = text.split(/(\s+)/);
          
          words.forEach(word => {
            if (word.match(/^\s+$/)) {
              fragment.appendChild(document.createTextNode(word));
            } else {
              const wordSpan = document.createElement('span');
              // Use inline (not inline-block) so words wrap naturally across lines
              wordSpan.style.display = 'inline';
              wordSpan.style.whiteSpace = 'normal';
              
              word.split('').forEach(letter => {
                const span = document.createElement('span');
                span.style.display = 'inline-block';
                span.style.whiteSpace = 'nowrap';
                span.innerText = letter;
                span.style.fontVariationSettings = fromStr;
                wordSpan.appendChild(span);
                letterRefs.push(span);
              });
              fragment.appendChild(wordSpan);
            }
          });
          
          node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Process children but don't split the element itself
          const children = Array.from(node.childNodes);
          children.forEach(child => processNode(child));
        }
      }

      Array.from(el.childNodes).forEach(node => processNode(node));

      function update() {
        letterRefs.forEach(letterRef => {
          const rect = letterRef.getBoundingClientRect();
          const letterCenterX = rect.left + rect.width / 2;
          const letterCenterY = rect.top + rect.height / 2;

          const distance = calculateDistance(mousePosition.x, mousePosition.y, letterCenterX, letterCenterY);

          if (distance >= radius) {
            letterRef.style.fontVariationSettings = fromStr;
            return;
          }

          const falloffValue = calculateFalloff(distance, radius, falloff);
          const newSettings = axes.map(({ axis, fromValue, toValue }) => {
            const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
            return `'${axis}' ${interpolatedValue}`;
          }).join(', ');

          letterRef.style.fontVariationSettings = newSettings;
        });

        requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

  initVariableProximity();
})();
