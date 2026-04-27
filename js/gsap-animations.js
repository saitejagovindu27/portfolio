/**
 * GSAP Scroll Animations — Production
 * Smooth, stable, no jitter
 */
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // =========================================
  //  LENIS SMOOTH SCROLL
  // =========================================
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================
  //  HERO — Word split entrance
  // =========================================
  var heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    var text = heroTitle.textContent.trim();
    heroTitle.innerHTML = "";
    text.split(/\s+/).forEach(function (word) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.cssText = "display:inline-block;margin-right:10px;";
      heroTitle.appendChild(span);
    });
    gsap.from(".hero-title .word", {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out",
    });
  }

  gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: "power3.out", clearProps: "all" });
  gsap.from(".hero-cta", { y: 15, opacity: 0, duration: 0.6, delay: 0.7, ease: "power3.out", clearProps: "all" });

  // Orbit entrance — NO parallax-out on scroll (keeps it stable)
  gsap.from(".hero-orbit", { scale: 0.5, opacity: 0, duration: 1.2, delay: 0.3, ease: "back.out(1.2)" });
  gsap.from(".orbit-node", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.8, ease: "back.out(2)" });
  gsap.from(".orbit-ring", { scale: 0.3, opacity: 0, duration: 0.8, stagger: 0.15, delay: 0.5 });

  // Orbit — Gentle float
  gsap.utils.toArray(".orbit-node").forEach(function (node, i) {
    gsap.to(node, {
      y: (i % 2 === 0) ? -6 : 6,
      duration: 3 + i * 0.4,
      repeat: -1, yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.2,
    });
  });

  // =========================================
  //  WORK CARDS — Scroll reveal (no scrub)
  // =========================================
  gsap.utils.toArray(".work-card").forEach(function (card, i) {
    gsap.from(card, {
      y: 60, opacity: 0, duration: 0.7,
      delay: i * 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  // =========================================
  //  SECTION HEADINGS
  // =========================================
  gsap.utils.toArray(".section-block h2").forEach(function (h2) {
    gsap.from(h2, {
      y: 25, opacity: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: h2, start: "top 90%", toggleActions: "play none none none" },
    });
  });

  // =========================================
  //  TOOLS MARQUEE
  // =========================================
  var marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    var totalWidth = marqueeTrack.scrollWidth / 2;
    gsap.to(marqueeTrack, {
      x: -totalWidth,
      duration: 30,
      repeat: -1,
      ease: "none",
    });
  }

  // =========================================
  //  CONTACT
  // =========================================
  var connectEl = document.querySelector("#contact .container");
  if (connectEl) {
    gsap.from(connectEl.children, {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: connectEl, start: "top 90%", toggleActions: "play none none none" },
    });
  }

  // =========================================
  //  SCROLL PROGRESS BAR
  // =========================================
  var bar = document.createElement("div");
  bar.style.cssText = "position:fixed;top:0;left:0;height:2px;width:100%;background:linear-gradient(90deg,#3b82f6,#2563eb);z-index:10001;transform-origin:left;transform:scaleX(0);pointer-events:none;";
  document.body.prepend(bar);
  gsap.to(bar, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  // =========================================
  //  BACKGROUND PARALLAX (subtle)
  // =========================================
  var bgGrid = document.querySelector(".bg-grid");
  var bgGlow = document.querySelector(".bg-glow");
  if (bgGrid) gsap.to(bgGrid, { y: 80, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
  if (bgGlow) gsap.to(bgGlow, { y: 40, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 2 } });
});
