/**
 * SpotlightCard — Vanilla JS implementation of React Bits component
 */
(function() {
  'use strict';

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

  // Handle scroll to top on refresh
  window.addEventListener('load', () => {
    // If there is no hash in the URL, or it's #top, scroll to top
    if (!window.location.hash || window.location.hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });

  // Initialize
  initSpotlightCards();
})();
