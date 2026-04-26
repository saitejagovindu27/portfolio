document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.hero-title');
  if (!container) return;

  const text = container.textContent.trim();
  container.innerHTML = '';
  
  // Apply Roboto Flex for variable fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap';
  document.head.appendChild(fontLink);
  
  container.style.fontFamily = "'Roboto Flex', sans-serif";

  const radius = 70;
  const falloffType = 'exponential';
  
  const words = text.split(/\s+/);
  const letterElements = [];

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';
    
    word.split('').forEach(char => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.style.display = 'inline-block';
      charSpan.style.fontVariationSettings = "'wght' 400, 'opsz' 9";
      charSpan.style.willChange = 'font-variation-settings';
      wordSpan.appendChild(charSpan);
      letterElements.push(charSpan);
    });

    container.appendChild(wordSpan);
    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.innerHTML = '&nbsp;';
      spaceSpan.style.display = 'inline-block';
      container.appendChild(spaceSpan);
    }
  });

  let mousePosition = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', (e) => {
    mousePosition = { x: e.clientX, y: e.clientY };
  });
  window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    mousePosition = { x: touch.clientX, y: touch.clientY };
  });

  function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function calculateFalloff(distance) {
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

  function loop() {
    letterElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const distance = calculateDistance(mousePosition.x, mousePosition.y, elCenterX, elCenterY);

      if (distance >= radius) {
        el.style.fontVariationSettings = "'wght' 400, 'opsz' 9";
        return;
      }

      const falloffValue = calculateFalloff(distance);
      
      const newWght = 400 + (1000 - 400) * falloffValue;
      const newOpsz = 9 + (40 - 9) * falloffValue;
      
      el.style.fontVariationSettings = \`'wght' \${newWght}, 'opsz' \${newOpsz}\`;
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
