/**
 * ShinyText — Vanilla JS implementation of React Bits component
 */
(function() {
  'use strict';

  function initShinyText() {
    const elements = document.querySelectorAll('.shiny-text');
    
    elements.forEach(el => {
      // Logic for pause on hover (already handled in CSS, but can be expanded here)
      const speed = el.dataset.speed || 5;
      el.style.animationDuration = `${speed}s`;
    });
  }

  // Initialize
  initShinyText();
})();
