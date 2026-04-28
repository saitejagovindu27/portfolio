document.addEventListener("DOMContentLoaded", () => {
  // 1. Magnetic Buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0,0)`;
    });
  });

  // 2. Hero Orbit — Cursor 3D Parallax
  const orbit = document.getElementById('heroOrbit');

  // 3. Mouse Parallax (Interactive Depth)
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      // Very subtle mouse shift
      heroContent.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    }

    if (orbit) {
      orbit.style.transform = `rotateX(${y * -12}deg) rotateY(${x * 12}deg)`;
    }
  });

  // 4. SCROLL PARALLAX (MEMORABLE MOMENT - OPTION A)
  // Creates a "3D Window" effect: text lifts while background sinks
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(".hero-content", {
      y: -100, // Moves content up faster than scroll
      opacity: 0.5, // Fades as it exits
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to("#color-bends-bg", {
      y: 120, // Background sinks in opposite direction
      scale: 1.1, // Subtle zoom for immersion
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
    
    // Also parallax the background grid for extra layering
    gsap.to(".bg-grid", {
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
});
