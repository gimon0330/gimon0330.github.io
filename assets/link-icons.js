(() => {
  "use strict";

  const ICON_LABELS = new Set(["GitHub", "Docs", "Link", "YouTube"]);

  function iconClass(label) {
    return `link-icon-${String(label || "link").toLowerCase()}`;
  }

  function decorateIconLinks(root = document) {
    root.querySelectorAll(".icon-link").forEach((anchor) => {
      if (anchor.dataset.iconDecorated === "true") return;

      const text = anchor.textContent.replace(/\s+/g, " ").trim();
      const parts = text.split(" · ");
      if (parts.length < 2 || !ICON_LABELS.has(parts[0])) return;

      const icon = parts[0];
      const label = parts.slice(1).join(" · ");
      anchor.textContent = "";

      const iconSpan = document.createElement("span");
      iconSpan.className = `link-icon ${iconClass(icon)}`;
      iconSpan.setAttribute("aria-hidden", "true");

      const labelSpan = document.createElement("span");
      labelSpan.textContent = label;

      anchor.append(iconSpan, labelSpan);
      anchor.dataset.iconDecorated = "true";
      anchor.setAttribute("aria-label", label.replace(/\s*→\s*$/, ""));
    });
  }

  document.addEventListener("DOMContentLoaded", () => decorateIconLinks());

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.(".icon-link")) decorateIconLinks(node.parentElement || document);
        if (node.querySelector?.(".icon-link")) decorateIconLinks(node);
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  });
})();
