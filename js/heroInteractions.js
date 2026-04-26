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

  // 3. Parallax Depth on Hero Content and Orbit
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
      heroContent.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
    }

    if (orbit) {
      orbit.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
    }
  });
});
