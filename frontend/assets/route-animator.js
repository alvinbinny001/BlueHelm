/* ============================================================
   NEURONEX Hero Route Animator
   Animates the pencil route sketch SVG with:
   - Dynamic SVG glowing vessel beacon traversing the bezier curve
   - Multi-ring sonar/radar ripples at each waypoint
   - Glowing particle trail along the route
   - Animated destination beacon and origin beacon
   - Route path flowing pulse
   ============================================================ */

(() => {
  'use strict';

  function initRouteAnimation() {
    const svg = document.querySelector('svg.route-doodle');
    if (!svg) return false;

    // Check if already enhanced
    if (svg.dataset.animated === 'true') return true;
    svg.dataset.animated = 'true';

    // 1. Add SVG defs for gradients and glow filters if not present
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <filter id="route-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="vessel-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="beacon-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d6ff55" stop-opacity="1" />
          <stop offset="40%" stop-color="#d6ff55" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#d6ff55" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d6ff55" stop-opacity="0" />
          <stop offset="50%" stop-color="#d6ff55" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9" />
        </linearGradient>
      `;
      svg.prepend(defs);
    }

    // 2. Add radar ripples around waypoints
    const waypoints = [
      { cx: 31,  cy: 243, label: 'Mundra',    delay: '0s' },
      { cx: 178, cy: 142, label: 'Waypoint',  delay: '1.2s' },
      { cx: 309, cy: 123, label: 'Waypoint',  delay: '2.4s' },
      { cx: 506, cy: 65,  label: 'Rotterdam', delay: '3.6s' }
    ];

    const rippleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    rippleGroup.setAttribute('class', 'route-ripples-layer');

    waypoints.forEach((wp, idx) => {
      // Create 2 concentric pulse rings per node
      for (let r = 1; r <= 2; r++) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', wp.cx);
        ring.setAttribute('cy', wp.cy);
        ring.setAttribute('r', '7');
        ring.setAttribute('class', `sonar-ring sonar-ring-${idx + 1}-${r}`);
        ring.style.animationDelay = `${parseFloat(wp.delay) + (r - 1) * 0.9}s`;
        rippleGroup.appendChild(ring);
      }
    });
    svg.insertBefore(rippleGroup, svg.firstChild);

    // 3. Find the main route path for tracking the vessel dot
    const routePath = svg.querySelector('path.doodle-route');
    if (routePath) {
      const pathLength = routePath.getTotalLength();

      // Create glowing animated vessel / cargo carrier group
      const vesselGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      vesselGroup.setAttribute('class', 'route-vessel-signal');

      // Trailing wake glow
      const wake = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      wake.setAttribute('r', '14');
      wake.setAttribute('fill', 'url(#beacon-grad)');
      wake.setAttribute('class', 'vessel-wake');

      // Vessel core outer ring
      const vesselRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      vesselRing.setAttribute('r', '7');
      vesselRing.setAttribute('fill', 'none');
      vesselRing.setAttribute('stroke', '#d6ff55');
      vesselRing.setAttribute('stroke-width', '2');
      vesselRing.setAttribute('filter', 'url(#vessel-glow)');
      vesselRing.setAttribute('class', 'vessel-outer-ring');

      // Vessel core glowing bead
      const vesselCore = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      vesselCore.setAttribute('r', '4');
      vesselCore.setAttribute('fill', '#ffffff');
      vesselCore.setAttribute('filter', 'url(#vessel-glow)');

      // Live ping text tag
      const vesselTag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      vesselTag.setAttribute('class', 'vessel-live-tag');
      vesselTag.setAttribute('dy', '-12');
      vesselTag.setAttribute('text-anchor', 'middle');
      vesselTag.textContent = '● IN TRANSIT';

      vesselGroup.appendChild(wake);
      vesselGroup.appendChild(vesselRing);
      vesselGroup.appendChild(vesselCore);
      vesselGroup.appendChild(vesselTag);
      svg.appendChild(vesselGroup);

      // Trailing active stream path
      const streamPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      streamPath.setAttribute('d', routePath.getAttribute('d'));
      streamPath.setAttribute('class', 'doodle-active-stream');
      streamPath.setAttribute('fill', 'none');
      streamPath.setAttribute('stroke', 'url(#stream-gradient)');
      streamPath.setAttribute('stroke-width', '3.5');
      streamPath.setAttribute('stroke-linecap', 'round');
      streamPath.setAttribute('filter', 'url(#route-glow)');
      svg.insertBefore(streamPath, vesselGroup);

      // 4. Animate vessel position smoothly once from Origin to Destination (NO LOOP)
      let startTime = null;
      const DURATION = 5500; // 5.5s total voyage time
      let animationFrameId = null;

      function animateVessel(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        let progress = Math.min(elapsed / DURATION, 1);
        
        // Use smooth easing so vessel accelerates and decelerates naturally through waypoints
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const currentLen = eased * pathLength;
        const point = routePath.getPointAtLength(currentLen);

        // Update vessel position
        vesselGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`);

        // Active glowing stream drawn continuously from origin up to vessel beacon
        streamPath.style.strokeDasharray = `${currentLen} ${pathLength}`;
        streamPath.style.strokeDashoffset = '0';

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateVessel);
        } else {
          // Reached destination - RUN ONCE, DO NOT LOOP
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          vesselTag.textContent = '✓ ROUTE LOCKED';
          vesselTag.style.fill = '#d6ff55';
          vesselTag.style.fontWeight = '700';
          vesselGroup.classList.add('vessel-arrived');
          svg.classList.add('route-completed');

          // Highlight final route locked stamp
          const stamp = document.querySelector('.hero-stamp');
          if (stamp) {
            stamp.classList.add('stamp-locked');
          }
        }
      }

      // Run once on load
      animationFrameId = requestAnimationFrame(animateVessel);

      // Optional: Click on SVG route or stamp to replay voyage once if desired
      svg.style.cursor = 'pointer';
      svg.setAttribute('title', 'Click to replay route voyage');
      svg.addEventListener('click', () => {
        if (svg.classList.contains('route-completed')) {
          svg.classList.remove('route-completed');
          vesselGroup.classList.remove('vessel-arrived');
          vesselTag.textContent = '● IN TRANSIT';
          vesselTag.style.fill = '';
          const stamp = document.querySelector('.hero-stamp');
          if (stamp) stamp.classList.remove('stamp-locked');
          startTime = null;
          animationFrameId = requestAnimationFrame(animateVessel);
        }
      });
    }

    return true;
  }

  // Mount with retry & MutationObserver
  if (!initRouteAnimation()) {
    const observer = new MutationObserver(() => {
      if (initRouteAnimation()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
