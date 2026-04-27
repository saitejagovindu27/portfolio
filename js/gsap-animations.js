/**
 * GSAP Scroll Animations
 * Premium scroll-triggered animations for all sections
 */
document.addEventListener("DOMContentLoaded", function () {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // =========================================
  //  HERO — Staggered Entrance
  // =========================================
  const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTL
    .from(".hero-title", {
      y: 60,
      opacity: 0,
      duration: 1.2,
    })
    .from(
      ".hero-sub",
      {
        y: 40,
        opacity: 0,
        duration: 1,
      },
      "-=0.7"
    )
    .from(
      ".hero-cta",
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
      },
      "-=0.5"
    )
    .from(
      ".hero-orbit",
      {
        scale: 0.6,
        opacity: 0,
        duration: 1.4,
        ease: "back.out(1.4)",
      },
      "-=1"
    )
    .from(
      ".orbit-node",
      {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(2)",
      },
      "-=0.6"
    )
    .from(
      ".orbit-ring",
      {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      },
      "-=1"
    );

  // =========================================
  //  FEATURED WORK — Cards slide up on scroll
  // =========================================
  gsap.utils.toArray(".work-card").forEach(function (card, i) {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 40%",
        toggleActions: "play none none reverse",
      },
      y: 80,
      opacity: 0,
      duration: 0.9,
      delay: i * 0.1,
      ease: "power2.out",
    });
  });

  // =========================================
  //  SECTION HEADINGS — Clip reveal
  // =========================================
  gsap.utils.toArray("section h2").forEach(function (h2) {
    gsap.from(h2, {
      scrollTrigger: {
        trigger: h2,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  // =========================================
  //  APPROACH — Pills stagger in
  // =========================================
  gsap.from(".process-center", {
    scrollTrigger: {
      trigger: ".process-container",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.7)",
  });

  gsap.from(".pill", {
    scrollTrigger: {
      trigger: ".process-container",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: "back.out(2)",
  });

  gsap.from(".connection-line", {
    scrollTrigger: {
      trigger: ".process-container",
      start: "top 65%",
      toggleActions: "play none none reverse",
    },
    scaleY: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out",
  });

  // =========================================
  //  TOOLS — Horizontal stagger
  // =========================================
  gsap.from(".tool", {
    scrollTrigger: {
      trigger: ".tools-scroll",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    x: -40,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "power2.out",
  });

  // =========================================
  //  CONTACT — Rise up
  // =========================================
  var connectSection = document.querySelector(".connect-section");
  if (connectSection) {
    gsap.from(connectSection.children, {
      scrollTrigger: {
        trigger: connectSection,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out",
    });
  }

  // =========================================
  //  SCROLL PROGRESS BAR (top of page)
  // =========================================
  var progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  progressBar.style.cssText =
    "position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#3b82f6,#2563eb);z-index:10000;transform-origin:left;transform:scaleX(0);pointer-events:none;";
  document.body.prepend(progressBar);

  gsap.to("#scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });

  // =========================================
  //  PARALLAX DEPTH — Background layers
  // =========================================
  var bgGrid = document.querySelector(".bg-grid");
  var bgGlow = document.querySelector(".bg-glow");

  if (bgGrid) {
    gsap.to(bgGrid, {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }

  if (bgGlow) {
    gsap.to(bgGlow, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  }
});
