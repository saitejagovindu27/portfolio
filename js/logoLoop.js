/**
 * LogoLoop - Vanilla JS port of React Bits LogoLoop component
 * Renders an infinite auto-scrolling loop of items.
 */
(function () {
  const SMOOTH_TAU = 0.25;
  const MIN_COPIES = 3;

  function initLogoLoop(container, items, options) {
    const {
      speed        = 80,
      direction    = 'left',
      gap          = 16,
      hoverSpeed   = 0,
      fadeOut      = true,
    } = options || {};

    const isVertical = direction === 'up' || direction === 'down';

    // Apply fade class
    container.classList.add('logoloop');
    if (fadeOut) container.classList.add('logoloop--fade');

    // Build track
    const track = document.createElement('div');
    track.className = 'logoloop__track';
    container.appendChild(track);

    // Build one sequence of list items
    function makeList(ariaHidden) {
      const ul = document.createElement('ul');
      ul.className = 'logoloop__list';
      ul.setAttribute('role', 'list');
      if (ariaHidden) ul.setAttribute('aria-hidden', 'true');
      items.forEach(label => {
        const li = document.createElement('li');
        li.className = 'logoloop__item';
        li.setAttribute('role', 'listitem');
        const pill = document.createElement('span');
        pill.className = 'logoloop-tool-pill';
        pill.textContent = label;
        li.appendChild(pill);
        ul.appendChild(li);
      });
      return ul;
    }

    // Add copies
    for (let i = 0; i < MIN_COPIES; i++) {
      track.appendChild(makeList(i > 0));
    }

    // Measure first list width
    let seqWidth = 0;
    function measureAndExpand() {
      const firstList = track.querySelector('.logoloop__list');
      seqWidth = firstList ? firstList.getBoundingClientRect().width : 0;

      // Add more copies to fill viewport if needed
      const existing = track.querySelectorAll('.logoloop__list').length;
      const needed = Math.ceil(window.innerWidth / (seqWidth || 1)) + 2;
      for (let i = existing; i < Math.max(MIN_COPIES, needed); i++) {
        track.appendChild(makeList(true));
      }
    }

    measureAndExpand();
    window.addEventListener('resize', measureAndExpand);

    // Animation
    let offset = 0;
    let velocity = 0;
    let isHovered = false;
    let lastTs = null;

    const magnitude = Math.abs(speed);
    const dirMult = direction === 'left' ? 1 : -1;
    const targetVelocity = magnitude * dirMult;

    function loop(ts) {
      if (lastTs === null) lastTs = ts;
      const dt = Math.max(0, ts - lastTs) / 1000;
      lastTs = ts;

      const target = isHovered ? hoverSpeed : targetVelocity;
      const ease = 1 - Math.exp(-dt / SMOOTH_TAU);
      velocity += (target - velocity) * ease;

      if (seqWidth > 0) {
        offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      requestAnimationFrame(loop);
    }

    track.addEventListener('mouseenter', () => { isHovered = true; });
    track.addEventListener('mouseleave', () => { isHovered = false; });

    requestAnimationFrame(loop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toolsSection = document.getElementById('tools');
    if (!toolsSection) return;

    // Remove old tools-scroll div
    const oldScroll = toolsSection.querySelector('.tools-scroll');
    if (oldScroll) oldScroll.remove();

    const tools = ['Figma', 'Adobe Suite', 'ChatGPT', 'Claude', 'Antigravity', 'Lovable', 'Stitch', 'FigJam', 'Notion', 'Maze'];

    const loopContainer = document.createElement('div');
    loopContainer.style.cssText = 'width:100%;padding:20px 0;';
    toolsSection.appendChild(loopContainer);

    initLogoLoop(loopContainer, tools, {
      speed: 80,
      direction: 'left',
      gap: 16,
      hoverSpeed: 0,
      fadeOut: true,
    });
  });
})();
