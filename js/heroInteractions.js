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

  // 3. 3D Tilt and Multi-layered Scroll Parallax
  const heroContent = document.querySelector(".hero-content");
  const heroIdentity = document.querySelector(".hero-identity");
  const heroTitle = document.querySelector(".hero-title");
  const heroSub = document.querySelector(".hero-sub");
  const heroActions = document.querySelector(".hero-cta");

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    if (heroContent) {
      // 3D Tilt effect
      heroContent.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translate(${x * 10}px, ${y * 10}px)`;
    }

    if (orbit) {
      orbit.style.transform = `perspective(1000px) rotateX(${y * -12}deg) rotateY(${x * 12}deg)`;
    }
  });

  // Scroll Parallax using GSAP
  if (typeof gsap !== 'undefined') {
    gsap.to(heroIdentity, {
      y: -30,
      opacity: 0.8,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(heroTitle, {
      y: -60,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(heroSub, {
      y: -20,
      opacity: 0.5,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(heroActions, {
      y: -10,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
});
