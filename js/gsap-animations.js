/**
 * GSAP Scroll Animations — Inspired by gsap.com/scroll
 * Scroll-scrubbed reveals, parallax depth, text split, marquee
 */
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // =========================================
  //  LENIS SMOOTH SCROLL — synced with GSAP
  // =========================================
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smooth: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================
  //  HERO — Word-by-word 3D text reveal
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
      y: 60, opacity: 0, rotateX: -30,
      duration: 0.9, stagger: 0.06, ease: "power3.out",
    });
  }

  gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.9, delay: 0.5, ease: "power3.out" });
  gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.7, delay: 0.8, ease: "power3.out" });

  // Orbit entrance
  gsap.from(".hero-orbit", { scale: 0.4, opacity: 0, duration: 1.2, delay: 0.3, ease: "back.out(1.2)" });
  gsap.from(".orbit-node", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.8, ease: "back.out(2)" });
  gsap.from(".orbit-ring", { scale: 0.2, opacity: 0, duration: 0.8, stagger: 0.15, delay: 0.5 });

  // =========================================
  //  ORBIT — Subtle floating animation
  // =========================================
  gsap.utils.toArray(".orbit-node").forEach(function (node, i) {
    gsap.to(node, {
      y: -8 + (i % 3) * 4,
      duration: 3 + i * 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.3,
    });
  });

  // =========================================
  //  FEATURED WORK — Scroll-scrubbed cards
  //  Inspired by gsap.com/scroll stacking
  // =========================================
  gsap.utils.toArray(".scroll-card").forEach(function (card, i) {
    // Scroll-scrubbed parallax entrance
    gsap.from(card, {
      y: 100,
      opacity: 0,
      scale: 0.95,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 40%",
        scrub: 1,
      },
    });

    // Subtle parallax on the card-visual (image moves slower)
    var visual = card.querySelector(".card-visual");
    if (visual) {
      gsap.to(visual, {
        y: -30,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  });

  // =========================================
  //  SECTION HEADINGS — Reveal
  // =========================================
  gsap.utils.toArray("section h2").forEach(function (h2) {
    gsap.from(h2, {
      scrollTrigger: { trigger: h2, start: "top 85%", toggleActions: "play none none reverse" },
      y: 30, opacity: 0, duration: 0.7, ease: "power2.out",
    });
  });

  // =========================================
  //  TOOLS MARQUEE — GSAP powered
  // =========================================
  var marqueeTrack = document.querySelector(".marquee-track");
  if (marqueeTrack) {
    var totalWidth = marqueeTrack.scrollWidth / 2;
    gsap.to(marqueeTrack, {
      x: -totalWidth,
      duration: 25,
      repeat: -1,
      ease: "none",
    });
  }

  // =========================================
  //  CONTACT — Staggered reveal
  // =========================================
  var connectEl = document.querySelector(".connect-section");
  if (connectEl) {
    gsap.from(connectEl.children, {
      scrollTrigger: { trigger: connectEl, start: "top 80%", toggleActions: "play none none reverse" },
      y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power2.out",
    });
  }

  // =========================================
  //  SCROLL PROGRESS BAR
  // =========================================
  var bar = document.createElement("div");
  bar.style.cssText = "position:fixed;top:0;left:0;height:3px;width:100%;background:linear-gradient(90deg,#3b82f6,#2563eb);z-index:10001;transform-origin:left;transform:scaleX(0);pointer-events:none;";
  document.body.prepend(bar);

  gsap.to(bar, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  // =========================================
  //  BACKGROUND PARALLAX — Scrubbed depth
  // =========================================
  var bgGrid = document.querySelector(".bg-grid");
  var bgGlow = document.querySelector(".bg-glow");
  if (bgGrid) gsap.to(bgGrid, { y: 120, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
  if (bgGlow) gsap.to(bgGlow, { y: 60, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 2 } });
});
