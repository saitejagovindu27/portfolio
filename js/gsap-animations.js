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
  //  HERO — Clean entrance (no word-split, preserves gradient)
  // =========================================
  var heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    heroTitle.style.opacity = "0";
    heroTitle.style.transform = "translateY(24px)";
    gsap.to(heroTitle, {
      opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power3.out",
      clearProps: "transform"
    });
  }

  var heroIdentity = document.querySelector(".hero-identity");
  if (heroIdentity) {
    gsap.from(heroIdentity, { y: 12, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out", clearProps: "all" });
  }

  gsap.from(".hero-sub", { y: 16, opacity: 0, duration: 0.7, delay: 0.6, ease: "power3.out", clearProps: "all" });
  gsap.from(".hero-cta", { y: 12, opacity: 0, duration: 0.6, delay: 0.8, ease: "power3.out", clearProps: "all" });

  // Orbit entrance
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
  //  WORK CARDS — Scroll reveal with depth
  // =========================================
  gsap.utils.toArray(".work-card").forEach(function (card, i) {
    gsap.from(card, {
      y: 50, opacity: 0, scale: 0.97, duration: 0.7,
      delay: i * 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  // Card hover parallax on image
  document.querySelectorAll(".work-card").forEach(function(card) {
    var img = card.querySelector(".card-visual img");
    if (!img) return;
    card.addEventListener("mousemove", function(e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(img, { x: x * 8, y: y * 6, duration: 0.4, ease: "power2.out" });
    });
    card.addEventListener("mouseleave", function() {
      gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
    });
  });

  // =========================================
  //  SECTION HEADINGS — Staggered reveal
  // =========================================
  gsap.utils.toArray(".section-block").forEach(function (section) {
    var h2 = section.querySelector("h2");
    var rest = section.querySelectorAll("p, .work-grid, .marquee-wrapper, .connect-actions, .connect-sub");
    if (h2) {
      gsap.from(h2, {
        y: 20, opacity: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none none" },
      });
    }
    if (rest.length) {
      gsap.from(rest, {
        y: 16, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.15, ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" },
      });
    }
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
