/**
 * ScrollReveal — Vanilla JS implementation of React Bits component
 */
(function() {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('ScrollReveal: GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(el => {
      // 1. Get settings from data attributes or defaults
      const baseOpacity = parseFloat(el.dataset.baseOpacity) || 0;
      const enableBlur = el.dataset.enableBlur !== 'false';
      const baseRotation = parseFloat(el.dataset.baseRotation) || 5;
      const blurStrength = parseFloat(el.dataset.blurStrength) || 10;
      const rotationEnd = el.dataset.rotationEnd || 'bottom bottom';
      const wordAnimationEnd = el.dataset.wordAnimationEnd || 'bottom bottom';

      // 2. Split text into words
      // Handle nested structures or just text
      const originalText = el.innerText;
      el.innerHTML = ''; // Clear
      
      const textNode = document.createElement('p');
      textNode.className = 'scroll-reveal-text';
      
      const words = originalText.split(/(\s+)/);
      words.forEach(word => {
        if (word.match(/^\s+$/)) {
          textNode.appendChild(document.createTextNode(word));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.innerText = word;
          textNode.appendChild(span);
        }
      });
      el.appendChild(textNode);

      // 3. Container Rotation Animation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );

      // 4. Word Animations
      const wordElements = el.querySelectorAll('.word');

      // Opacity
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );

      // Blur
      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true
            }
          }
        );
      }
    });
  }

  // Initialize
  initScrollReveal();
})();
