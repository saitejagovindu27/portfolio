/**
 * Hero Interactions — Refined Layered Parallax (Memorable Moment)
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Magnetic Buttons (Enhanced)
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0,0)`;
    });
  });

  // 2. High-End Interactive Parallax (Option A - Enhanced)
  const heroContent = document.querySelector(".hero-content");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const heroIdentity = document.querySelector(".hero-identity");

  if (heroContent) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);

      // Layer 1: Title (Tilt + Faster Translation)
      if (heroTitle) {
        heroTitle.style.transform = `
          translate(${x * 15}px, ${y * 15}px) 
          perspective(1000px) 
          rotateX(${y * -5}deg) 
          rotateY(${x * 5}deg)
        `;
        // Shift the text glow to simulate light source movement
        heroTitle.style.textShadow = `${x * -10}px ${y * -10}px 15px rgba(79, 140, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.05)`;
      }

      // Layer 2: Subtext (Medium Translation)
      if (heroSub) {
        heroSub.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
      }

      // Layer 3: Identity (Slowest Translation)
      if (heroIdentity) {
        heroIdentity.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
      }
    });
  }
});
