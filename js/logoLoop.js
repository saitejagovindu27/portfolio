document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".tools-scroll");
  if (!container) return;

  // Setup track
  const track = document.createElement("div");
  track.className = "logoloop-track";
  track.style.display = "flex";
  track.style.width = "max-content";
  track.style.willChange = "transform";
  
  // Create first list
  const list = document.createElement("div");
  list.className = "logoloop-list";
  list.style.display = "flex";
  list.style.alignItems = "center";
  
  const tools = Array.from(container.querySelectorAll(".tool"));
  tools.forEach((tool, index) => {
    tool.style.flex = "0 0 auto";
    tool.style.marginRight = "32px";
    list.appendChild(tool);
  });

  track.appendChild(list);
  container.innerHTML = '';
  container.appendChild(track);
  
  // Container styling
  container.style.overflow = "hidden";
  container.style.position = "relative";
  
  // Clone nodes to fill scroll area securely (4 total lists)
  for (let i = 0; i < 3; i++) {
    track.appendChild(list.cloneNode(true));
  }

  let offset = 0;
  let currentSpeed = 120; // Initial speed in px/s
  let lastTime = null;
  let isHovered = false;

  // Hover deceleration effect based on the LogoLoop component
  container.addEventListener("mouseenter", () => { isHovered = true; });
  container.addEventListener("mouseleave", () => { isHovered = false; });

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    const listWidth = list.getBoundingClientRect().width;
    
    if (listWidth > 0) {
      // Target speed is 0 on hover
      const targetSpeed = isHovered ? 0 : 120;
      
      // Exponential smoothing for velocity
      const tau = 0.25;
      const easingFactor = 1 - Math.exp(-dt / tau);
      currentSpeed += (targetSpeed - currentSpeed) * easingFactor;

      offset += currentSpeed * dt;
      // Loop seamlessly
      offset = offset % listWidth;

      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
