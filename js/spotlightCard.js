/**
 * SpotlightCard — Vanilla JS implementation of React Bits component
 * Includes definitive scroll-to-top on refresh
 */
(function() {
  'use strict';

  // Force scroll to top on refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Execute as early as possible
  scrollToTop();

  window.addEventListener('load', scrollToTop);

  function initSpotlightCards() {
    const cards = document.querySelectorAll('.card-spotlight');

    cards.forEach(card => {
      const spotlightColor = card.dataset.spotlightColor || 'rgba(255, 255, 255, 0.25)';
      
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.setProperty('--spotlight-color', spotlightColor);
      });
    });
  }

  // Initialize
  initSpotlightCards();
})();
