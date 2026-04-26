document.addEventListener("DOMContentLoaded", () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      const rect = el.parentElement.getBoundingClientRect();
      
      // Calculate offset based on scroll position relative to viewport
      const offset = (rect.top - windowHeight / 2) * speed;
      
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
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
