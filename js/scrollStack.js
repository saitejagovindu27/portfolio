document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.querySelector('.scroll-stack-scroller');
  if (!scroller) return;

  const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
  if (!cards.length) return;

  const itemScale = 0.05;
  const itemStackDistance = 30;
  const baseScale = 0.85;
  const blurAmount = 2;

  // Initial Setup
  cards.forEach((card, i) => {
    card.style.willChange = 'transform, filter';
    card.style.transformOrigin = 'top center';
    card.style.backfaceVisibility = 'hidden';
    card.style.transform = 'translateZ(0)';
  });

  function calculateProgress(scrollTop, start, end) {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }

  function getElementOffset(el) {
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function updateCardTransforms() {
    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPositionPx = containerHeight * 0.2; // stackPosition = '20%'
    const scaleEndPositionPx = containerHeight * 0.1; // scaleEndPosition = '10%'

    const endElement = document.querySelector('.scroll-stack-end');
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cards.forEach((card, i) => {
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - (itemStackDistance * i);
      const pinEnd = endElementTop - (containerHeight / 2);

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + (i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cards.length; j++) {
          const jCardTop = getElementOffset(cards[j]);
          const jTriggerStart = jCardTop - stackPositionPx - (itemStackDistance * j);
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
      }

      const transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      const filter = blur > 0 ? `blur(${blur}px)` : '';

      card.style.transform = transform;
      card.style.filter = filter;
    });
  }

  // Initialize Lenis
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', updateCardTransforms);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else {
    // Fallback to regular scroll event if Lenis is not loaded
    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateCardTransforms);
    });
  }

  // Initial call
  updateCardTransforms();
});
