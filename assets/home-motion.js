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

      scene.style.setProperty("--scene-opacity", String(lerp(.34, 1, progress).toFixed(3)));
      scene.style.setProperty("--scene-scale", String(lerp(.955, 1, progress).toFixed(3)));
      scene.style.setProperty("--scene-y", `${(signed * -34).toFixed(1)}px`);
      scene.style.setProperty("--scene-head-y", `${((1 - progress) * 42).toFixed(1)}px`);
      scene.style.setProperty("--orb-x", `${(signed * 42).toFixed(1)}px`);
      scene.style.setProperty("--orb-y", `${(signed * -64).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-y", `${(signed * -42).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-x", `${(signed * 18).toFixed(1)}px`);
      scene.style.setProperty("--hero-visual-scale", String(lerp(.96, 1.02, progress).toFixed(3)));

      const cards = Array.from(scene.querySelectorAll(".card, .edu-card"));
      cards.forEach((card, index) => {
        const stagger = index * .095;
        const local = clamp((enter - stagger) / .48, 0, 1);
        const eased = 1 - Math.pow(1 - local, 3);
        card.style.setProperty("--card-opacity", String(lerp(.18, 1, eased).toFixed(3)));
        card.style.setProperty("--card-y", `${lerp(80, 0, eased).toFixed(1)}px`);
        card.style.setProperty("--card-scale", String(lerp(.94, 1, eased).toFixed(3)));
        card.style.setProperty("--card-tilt", `${lerp(7, 0, eased).toFixed(2)}deg`);
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
