(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    const scenes = Array.from(document.querySelectorAll(".home-scene, .home-main > .hero-full"));
    if (!scenes.length || reduceMotion) return;

    let ticking = false;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (a, b, t) => a + (b - a) * t;

    function updateScene(scene) {
      const rect = scene.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const distance = (center - vh / 2) / vh;
      const progress = clamp(1 - Math.abs(distance) * 1.15, 0, 1);
      const enter = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
      const signed = clamp(distance, -1.4, 1.4);

      // Keep sections visually stable while preserving a light parallax feel.
      // Large opacity/translate changes on mobile caused cards to shimmer while scrolling.
      scene.style.setProperty("--scene-opacity", "1");
      scene.style.setProperty("--scene-scale", String(lerp(.985, 1, progress).toFixed(3)));
      scene.style.setProperty("--scene-y", `${(signed * -12).toFixed(1)}px`);
      scene.style.setProperty("--scene-head-y", `${((1 - progress) * 14).toFixed(1)}px`);
      scene.style.setProperty("--orb-x", `${(signed * 18).toFixed(1)}px`);
      scene.style.setProperty("--orb-y", `${(signed * -24).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-y", `${(signed * -18).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-x", `${(signed * 8).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-scale", String(lerp(.985, 1.005, progress).toFixed(3)));

      const cards = Array.from(scene.querySelectorAll(".card, .edu-card"));
      cards.forEach((card, index) => {
        const stagger = index * .055;
        const local = clamp((enter - stagger) / .42, 0, 1);
        const eased = 1 - Math.pow(1 - local, 3);
        card.style.setProperty("--card-opacity", "1");
        card.style.setProperty("--card-y", `${lerp(18, 0, eased).toFixed(1)}px`);
        card.style.setProperty("--card-scale", String(lerp(.985, 1, eased).toFixed(3)));
        card.style.setProperty("--card-tilt", `${lerp(1.4, 0, eased).toFixed(2)}deg`);
      });
    }

    function update() {
      scenes.forEach(updateScene);
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  });
})();