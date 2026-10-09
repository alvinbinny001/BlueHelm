/* ============================================================
   NEURONEX Overview Background: React Bits <LightPillar />
   Integration of the 3D LightPillar raymarched WebGL component
   ============================================================ */

(() => {
  "use strict";

  // Component configuration props: tuned for professional maritime cyber aesthetics
  const CONFIG = {
    topColor: "#2563eb",       // Luminous cyber sapphire blue
    bottomColor: "#059669",    // Maritime emerald / teal
    intensity: 0.65,           // Rich luminous energy visible across the viewport
    rotationSpeed: 0.32,       // Dynamic majestic motion
    glowAmount: 0.0038,        // Volumetric aura
    pillarWidth: 3.4,          // Broad volumetric coverage
    pillarHeight: 0.50,
    noiseIntensity: 0.16,      // Clean fine film grain
    pillarRotation: 0,
    interactive: false,
    mixBlendMode: "screen",
    quality: "high",
    lightMode: false
  };

  let activeInstance = null;

  function initLightPillar() {
    if (typeof THREE === "undefined") {
      // Retry once THREE is loaded
      window.setTimeout(initLightPillar, 100);
      return false;
    }

    // Check if already mounted and active
    if (document.getElementById("nx-light-pillar-bg") && activeInstance) {
      return true;
    }

    // Clean up any stale instance
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }

    let container = document.getElementById("nx-light-pillar-bg");
    if (!container) {
      container = document.createElement("div");
      container.id = "nx-light-pillar-bg";
      container.className = "light-pillar-container";
      document.body.prepend(container);
    } else if (container.parentElement !== document.body) {
      document.body.prepend(container);
    }
    container.style.mixBlendMode = CONFIG.mixBlendMode;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    let effectiveQuality = CONFIG.quality;
    if (isLowEndDevice && CONFIG.quality === "high") effectiveQuality = "medium";
    if (isMobile && CONFIG.quality !== "low") effectiveQuality = "low";

    const qualitySettings = {
      low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: "mediump", stepMultiplier: 1.5 },
      medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: "mediump", stepMultiplier: 1.2 },
      high: {
        iterations: 80,
        waveIterations: 4,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        precision: "highp",
        stepMultiplier: 1.0
      }
    };

    const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: effectiveQuality === "high" ? "high-performance" : "low-power",
        precision: settings.precision,
        stencil: false,
        depth: false
      });
    } catch (e) {
      console.warn("WebGL not supported for LightPillar:", e);
      container.innerHTML = '<div class="light-pillar-fallback">WebGL not supported</div>';
      return false;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(settings.pixelRatio);
    container.appendChild(renderer.domElement);

    const parseColor = (hex) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uLightMode;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      vec3 safe_tanh(vec3 x) {
        vec3 e2x = exp(2.0 * clamp(x, -20.0, 20.0));
        return (e2x - 1.0) / (e2x + 1.0);
      }

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        float energy = length(col) * (uGlowAmount / widthNorm);
        float compressed = (exp(2.0 * clamp(energy, -10.0, 10.0)) - 1.0) / (exp(2.0 * clamp(energy, -10.0, 10.0)) + 1.0);
        
        // Preserve rich chromatic hue so the core never desaturates to a white shade
        vec3 hue = normalize(col + vec3(0.001));
        vec3 result = hue * compressed * uIntensity * 1.35;
        result -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 24.0 * uNoiseIntensity;
        result = clamp(result, 0.0, 1.0);
        
        float alpha = smoothstep(0.008, 0.35, compressed);
        gl_FragColor = vec4(result, alpha);
      }
    `;

    const pillarRotRad = (CONFIG.pillarRotation * Math.PI) / 180;
    const waveSin = Math.sin(0.4);
    const waveCos = Math.cos(0.4);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTopColor: { value: parseColor(CONFIG.topColor) },
        uBottomColor: { value: parseColor(CONFIG.bottomColor) },
        uIntensity: { value: CONFIG.intensity },
        uInteractive: { value: CONFIG.interactive },
        uGlowAmount: { value: CONFIG.glowAmount },
        uPillarWidth: { value: CONFIG.pillarWidth },
        uPillarHeight: { value: CONFIG.pillarHeight },
        uNoiseIntensity: { value: CONFIG.noiseIntensity },
        uLightMode: { value: CONFIG.lightMode ? 1 : 0 },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) },
        uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: waveSin },
        uWaveCos: { value: waveCos }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId = null;
    let time = 0;
    let lastTime = performance.now();
    const targetFPS = effectiveQuality === "low" ? 30 : 60;
    const frameTime = 1000 / targetFPS;

    function animate(currentTime) {
      if (!material || !renderer || !scene || !camera) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameTime) {
        time += 0.016 * CONFIG.rotationSpeed;
        material.uniforms.uTime.value = time;
        material.uniforms.uRotCos.value = Math.cos(time * 0.3);
        material.uniforms.uRotSin.value = Math.sin(time * 0.3);
        renderer.render(scene, camera);
        lastTime = currentTime - (deltaTime % frameTime);
      }

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    let resizeTimeout = null;
    function handleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!renderer || !material || !container) return;
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        if (newWidth > 0 && newHeight > 0) {
          renderer.setSize(newWidth, newHeight);
          material.uniforms.uResolution.value.set(newWidth, newHeight);
        }
      }, 100);
    }

    window.addEventListener("resize", handleResize, { passive: true });

    activeInstance = {
      destroy: () => {
        window.removeEventListener("resize", handleResize);
        if (rafId) cancelAnimationFrame(rafId);
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
        if (material) material.dispose();
        if (geometry) geometry.dispose();
        container.remove();
      }
    };

    return true;
  }

  // Lifecycle listeners
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightPillar);
  } else {
    initLightPillar();
  }

  // MutationObserver to ensure the motion background stays attached to document.body across route changes
  const observer = new MutationObserver(() => {
    const bg = document.getElementById("nx-light-pillar-bg");
    if (!bg || !activeInstance) {
      initLightPillar();
    } else if (bg.parentElement !== document.body) {
      document.body.prepend(bg);
    }
  });

  observer.observe(document.body, { childList: true, subtree: false });

  window.addEventListener("popstate", () => window.setTimeout(initLightPillar, 50));
  window.addEventListener("hashchange", () => window.setTimeout(initLightPillar, 50));
  window.setTimeout(initLightPillar, 100);
  window.setTimeout(initLightPillar, 500);
})();
