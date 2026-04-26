document.addEventListener("DOMContentLoaded", () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      const rect = el.parentElement.getBoundingClientRect();
      
      // Set as CSS variable so CSS animations (like float) can combine with it
      el.style.setProperty('--parallax-y', `${offset}px`);
      // Fallback for elements without CSS animations taking advantage of --parallax-y
      if (!el.classList.contains('approach-float') && !el.classList.contains('approach-center')) {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }

  // Hook into global scroll (Lenis automatically triggers this if set up correctly, 
  // or native scroll will fallback)
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  });
  
  // Also hook into custom Lenis scroll if available on window
  if (window.lenis) {
    window.lenis.on('scroll', updateParallax);
  }
  
  // Initial call
  updateParallax();
});
