(() => {
  "use strict";

  const ICONS = {
    github: `
      <svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
      </svg>`,
    youtube: `
      <svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
      </svg>`,
    link: `
      <svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M10.6 13.4a1.4 1.4 0 0 1 0-2l3.8-3.8a3 3 0 1 1 4.2 4.2l-2.1 2.1a1.25 1.25 0 1 0 1.8 1.8l2.1-2.1a5.5 5.5 0 1 0-7.8-7.8l-3.8 3.8a3.9 3.9 0 0 0 0 5.6 1.25 1.25 0 0 0 1.8-1.8Zm2.8-2.8a1.4 1.4 0 0 1 0 2l-3.8 3.8a3 3 0 1 1-4.2-4.2l2.1-2.1a1.25 1.25 0 0 0-1.8-1.8l-2.1 2.1a5.5 5.5 0 1 0 7.8 7.8l3.8-3.8a3.9 3.9 0 0 0 0-5.6 1.25 1.25 0 1 0-1.8 1.8Z" />
      </svg>`,
  };

  function normalizeTimelineLinks() {
    document.querySelectorAll(".timeline-links .icon-link").forEach((anchor) => {
      const raw = anchor.textContent || "";
      const cleaned = raw
        .replace(/→/g, "")
        .split("·")
        .map((part) => part.trim())
        .filter(Boolean);

      const label = cleaned[cleaned.length - 1] || raw.replace(/→/g, "").trim() || "Link";
      const key = label.toLowerCase().includes("youtube")
        ? "youtube"
        : label.toLowerCase().includes("github")
          ? "github"
          : "link";

      anchor.innerHTML = `${ICONS[key]}<span>${label}</span><span aria-hidden="true">→</span>`;
      anchor.setAttribute("aria-label", `${label} 열기`);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(normalizeTimelineLinks, 0);
  });
})();
