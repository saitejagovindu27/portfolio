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
      duration: 1.5, 
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
    });
    lenis.on("scroll", function(e) {
      ScrollTrigger.update();
      updateScrollSkew(e.velocity);
    });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================
  //  CUSTOM CURSOR
  // =========================================
  var cursor = document.getElementById("custom-cursor");
  var follower = document.getElementById("cursor-follower");
  var mouseX = 0, mouseY = 0;
  var ballX = 0, ballY = 0;

  if (window.innerWidth > 1024) {
    document.addEventListener("mousemove", function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
    });

    gsap.ticker.add(function() {
      ballX += (mouseX - ballX) * 0.15;
      ballY += (mouseY - ballY) * 0.15;
      gsap.set(follower, { x: ballX - 16, y: ballY - 16 });
    });

    document.querySelectorAll("a, button, .work-card, .tool").forEach(function(el) {
      el.addEventListener("mouseenter", function() { follower.classList.add("active"); });
      el.addEventListener("mouseleave", function() { follower.classList.remove("active"); });
    });
  } else {
    if (cursor) cursor.style.display = "none";
    if (follower) follower.style.display = "none";
    document.body.style.cursor = "default";
  }

  // =========================================
  //  MAGNETIC BUTTONS
  // =========================================
  document.querySelectorAll(".btn-primary, .btn-secondary, .logo, .orbit-center").forEach(function(btn) {
    btn.addEventListener("mousemove", function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", function() {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    });
  });

  // =========================================
  //  SCROLL SKEW
  // =========================================
  var skewSetter = gsap.quickSetter(".work-card", "skewY", "deg");
  var proxy = { skew: 0 };
  function updateScrollSkew(velocity) {
    var skew = velocity * 0.005;
    if (Math.abs(skew) > Math.abs(proxy.skew)) {
      proxy.skew = skew;
      gsap.to(proxy, {
        skew: 0, duration: 0.8, ease: "power3",
        onUpdate: function() { skewSetter(proxy.skew); }
      });
    }
  }

  // =========================================
  //  HERO — Simple entrance (preserves HTML for variable-proximity)
  // =========================================
  var heroTitle = document.getElementById("hero-title");
  if (heroTitle) {
    // DO NOT modify innerHTML — variable-proximity needs the original DOM
    gsap.from(heroTitle, {
      y: 28, opacity: 0, duration: 0.85, delay: 0.3,
      ease: "power3.out", clearProps: "transform"
    });
  }

  var heroIdentity = document.querySelector(".hero-identity");
  if (heroIdentity) {
    gsap.from(heroIdentity, { y: 14, opacity: 0, duration: 0.6, delay: 0.15, ease: "power3.out" });
  }

  gsap.from(".hero-sub", { y: 18, opacity: 0, duration: 0.7, delay: 0.55, ease: "power3.out" });
  gsap.from(".hero-cta", { y: 14, opacity: 0, duration: 0.6, delay: 0.7, ease: "power3.out" });

  // Orbit/Visual entrance
  gsap.from(".hero-img-float", { x: 40, opacity: 0, duration: 1.4, delay: 0.4, ease: "power3.out" });
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
  var contactSection = document.querySelector("#contact");
  if (contactSection) {
    var contactEls = contactSection.querySelectorAll("h2, .connect-sub, .connect-actions, .connect-secondary");
    gsap.set(contactEls, { opacity: 1 }); // ensure visible
    gsap.from(contactEls, {
      y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: contactSection, start: "top 88%", toggleActions: "play none none none" },
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
  //  BACKGROUND PARALLAX & FLOW
  // =========================================
  var bgGrid = document.querySelector(".bg-grid");
  var bgGlow = document.querySelector(".bg-glow");
  
  if (bgGrid) {
    gsap.to(bgGrid, { 
      y: 200, 
      ease: "none", 
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true } 
    });
  }
  
  if (bgGlow) {
    gsap.to(bgGlow, { 
      y: 100, 
      opacity: 0.8,
      background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%)",
      ease: "none", 
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true } 
    });
  }

  // =========================================
  //  SCROLL PARALLAX — MEMORABLE DEPTH
  // =========================================
  // Hero Image Parallax (Fast Drift)
  var heroImg = document.querySelector(".hero-img-float");
  if (heroImg) {
    gsap.to(heroImg, {
      y: 180,
      rotate: 5,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // About Orbit Parallax (Slow Drift)
  var aboutOrbit = document.querySelector(".about-visual #heroOrbit");
  if (aboutOrbit) {
    gsap.to(aboutOrbit, {
      y: 150,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Section Content Floating Effect
  gsap.utils.toArray(".section-block").forEach(function(section, i) {
    var content = section.querySelector(".container");
    if (content && i > 0) {
      gsap.to(content, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });
});
