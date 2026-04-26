document.addEventListener("DOMContentLoaded", () => {
  
  // 1. MAGNETIC BUTTONS
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

  // 2. 3D HERO CARD TILT
  const card = document.getElementById('tiltCard');
  if (card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = -(y / rect.height - 0.5) * 20;
      const rotateY = (x / rect.width - 0.5) * 20;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotateX(0) rotateY(0)`;
      // Optionally reset glow center when mouse leaves
      card.style.setProperty('--x', `50%`);
      card.style.setProperty('--y', `50%`);
    });
  }

  // 3. PARALLAX DEPTH
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    const heroContent = document.querySelector(".hero-content");
    const heroVisual = document.querySelector(".hero-visual");

    if (heroContent) {
      heroContent.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }
    if (heroVisual) {
      heroVisual.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
    }
  });

});
