document.addEventListener("DOMContentLoaded", () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const bgGrid = document.querySelector('.bg-grid');
  const bgGridMicro = document.querySelector('.bg-grid-micro');
  const bgGlow = document.querySelector('.bg-glow');

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Background depth layers — grid moves slower than content
    if (bgGrid) {
      bgGrid.style.transform = `translate3d(0, ${scrollY * 0.03}px, 0)`;
    }
    if (bgGridMicro) {
      bgGridMicro.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
    }
    // Glow moves even slower
    if (bgGlow) {
      bgGlow.style.transform = `translate3d(0, ${scrollY * 0.015}px, 0)`;
    }

    // Content parallax elements
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top - windowHeight / 2) * speed;

      // Set as CSS variable so CSS animations (like float) can combine with it
      el.style.setProperty('--parallax-y', `${offset}px`);
      // Fallback for elements without CSS animations taking advantage of --parallax-y
      if (!el.classList.contains('approach-float') && !el.classList.contains('approach-center')) {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  });
  
  if (window.lenis) {
    window.lenis.on('scroll', updateParallax);
  }
  
  updateParallax();
});
