/**
 * GSAP Scroll Animations — Premium UX
 * Hero text split, horizontal cards, scroll-triggered reveals
 */
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // =========================================
  //  SMOOTH SCROLL (Lenis + GSAP sync)
  // =========================================
  if (typeof Lenis !== "undefined") {
    var lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================
  //  HERO — Text Split Word Animation
  // =========================================
  var heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    var text = heroTitle.textContent.trim();
    heroTitle.innerHTML = "";
    var words = text.split(/\s+/);
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.display = "inline-block";
      span.style.marginRight = "12px";
      heroTitle.appendChild(span);
    });

    gsap.from(".hero-title .word", {
      y: 80,
      opacity: 0,
      rotateX: -40,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out",
    });
  }

  // Hero sub + CTA entrance
  gsap.from(".hero-sub", { y: 40, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
  gsap.from(".hero-cta", { y: 30, opacity: 0, duration: 0.8, delay: 0.9, ease: "power3.out" });

  // Orbit entrance
  gsap.from(".hero-orbit", {
    scale: 0.5, opacity: 0, duration: 1.4, delay: 0.4, ease: "back.out(1.4)"
  });
  gsap.from(".orbit-node", {
    scale: 0, opacity: 0, duration: 0.6, stagger: 0.1, delay: 1, ease: "back.out(2)"
  });
  gsap.from(".orbit-ring", {
    scale: 0.3, opacity: 0, duration: 1, stagger: 0.2, delay: 0.6, ease: "power2.out"
  });

  // =========================================
  //  FEATURED WORK — GSAP Horizontal Scroll
  // =========================================
  var hScrollSection = document.querySelector("#work");
  var hTrack = document.querySelector(".h-scroll-track");

  if (hScrollSection && hTrack) {
    var cards = gsap.utils.toArray(".h-card");
    var totalWidth = 0;
    cards.forEach(function (card) {
      totalWidth += card.offsetWidth + 40; // gap
    });

    gsap.to(hTrack, {
      x: function () { return -(totalWidth - window.innerWidth + 200); },
      ease: "none",
      scrollTrigger: {
        trigger: hScrollSection,
        start: "top top",
        end: function () { return "+=" + totalWidth; },
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Card entrance stagger
    cards.forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: i * 0.15,
        scrollTrigger: {
          trigger: hScrollSection,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  // =========================================
  //  SECTION HEADINGS — Slide up
  // =========================================
  gsap.utils.toArray("section h2").forEach(function (h2) {
    gsap.from(h2, {
      scrollTrigger: { trigger: h2, start: "top 85%", toggleActions: "play none none reverse" },
      y: 40, opacity: 0, duration: 0.8, ease: "power2.out",
    });
  });

  // =========================================
  //  TOOLS — Grid stagger
  // =========================================
  gsap.from(".tool-item", {
    scrollTrigger: { trigger: ".tools-grid", start: "top 80%", toggleActions: "play none none reverse" },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
  });

  // =========================================
  //  CONTACT — Rise up
  // =========================================
  var connectEl = document.querySelector(".connect-section");
  if (connectEl) {
    gsap.from(connectEl.children, {
      scrollTrigger: { trigger: connectEl, start: "top 80%", toggleActions: "play none none reverse" },
      y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
    });
  }

  // =========================================
  //  SCROLL PROGRESS BAR
  // =========================================
  var progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  progressBar.style.cssText = "position:fixed;top:0;left:0;height:3px;width:100%;background:linear-gradient(90deg,#3b82f6,#2563eb);z-index:10000;transform-origin:left;transform:scaleX(0);pointer-events:none;";
  document.body.prepend(progressBar);

  gsap.to("#scroll-progress", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });

  // =========================================
  //  BACKGROUND PARALLAX (GSAP scrub)
  // =========================================
  var bgGrid = document.querySelector(".bg-grid");
  var bgGlow = document.querySelector(".bg-glow");

  if (bgGrid) {
    gsap.to(bgGrid, {
      y: 150, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 },
    });
  }
  if (bgGlow) {
    gsap.to(bgGlow, {
      y: 80, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.5 },
    });
  }
});
