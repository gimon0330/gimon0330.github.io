(() => {
  "use strict";

  const BASE = ((typeof window !== "undefined" && window.__BASEURL__) || "").replace(/\/$/, "");
  const PROJECTS_URL = withBase("/projects.json");
  const CAREER_URL = withBase("/career.json");

  document.addEventListener("DOMContentLoaded", boot);
  window.addEventListener("pageshow", resetPageTransition);

  function boot() {
    injectFontStylesheet();
    setCurrentYear();
    setupReveal();
    setupPageTransitions();
    renderFeaturedProjects();
    renderAllProjects();
    renderCareerTimeline();
  }

  function withBase(path) {
    if (!path) return "#";
    const value = String(path);
    if (/^(https?:|mailto:|tel:|#|data:|blob:)/i.test(value)) return value;
    return `${BASE}/${value.replace(/^\/+/, "")}`;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function injectFontStylesheet() {
    if (document.querySelector('link[data-portfolio-font="pretendard"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = withBase("/assets/font.css");
    link.dataset.portfolioFont = "pretendard";
    document.head.prepend(link);
  }

  function setCurrentYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function resetPageTransition() {
    document.querySelector(".page-transition")?.classList.remove("is-active");
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  function setupReveal() {
    const items = [...document.querySelectorAll(".reveal")];
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    items.forEach((el) => observer.observe(el));
  }

  function setupPageTransitions() {
    const layer = document.querySelector(".page-transition");
    if (!layer) return;
    document.querySelectorAll("a[data-transition-link]").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("#") || anchor.target === "_blank") return;
        event.preventDefault();
        layer.classList.add("is-active");
        window.setTimeout(() => { window.location.href = href; }, 220);
      });
    });
  }

  async function fetchJSON(src) {
    const res = await fetch(src, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${src}`);
    return res.json();
  }

  const sortByRecentYear = (a, b) =>
    (Number(b.year) || 0) - (Number(a.year) || 0)
      || String(a.title || "").localeCompare(String(b.title || ""), "ko");

  function slugifyProjectTitle(title) {
    return String(title || "project")
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project";
  }

  function getProjectLink(project) {
    return project?.links?.overview || project?.links?.github || project?.links?.docs || "#";
  }

  function getProjectImageCandidates(project) {
    if (project?.image) return [withBase(project.image)];
    const slug = slugifyProjectTitle(project?.title);
    return ["webp", "jpg", "png", "jpeg", "svg"].map((ext) => withBase(`/assets/projects/${slug}.${ext}`));
  }

  window.__portfolioProjectImageFallback = (img) => {
    let candidates = [];
    try { candidates = JSON.parse(img.dataset.fallbackSrcs || "[]"); } catch (_) { candidates = []; }
    const next = candidates.shift();
    if (!next) {
      img.style.display = "none";
      img.removeAttribute("src");
      return;
    }
    img.dataset.fallbackSrcs = JSON.stringify(candidates);
    img.src = next;
  };

  function linkIcon(key) {
    const safeKey = escapeHTML(key || "link");
    return `<span class="link-icon link-icon-${safeKey}" aria-hidden="true"></span>`;
  }

  function iconLink(label, url, key = "link") {
    return `<a class="icon-link" href="${escapeHTML(url)}" target="_blank" rel="noopener">${linkIcon(key)}<span>${escapeHTML(label)} →</span></a>`;
  }

  function projectCardHTML(project, span = 4) {
    const imageCandidates = getProjectImageCandidates(project);
    const links = [
      project.links?.github ? iconLink("GitHub", project.links.github, "github") : "",
      project.links?.docs ? iconLink("Docs", project.links.docs, "docs") : "",
      project.links?.overview ? iconLink("Overview", project.links.overview, "link") : "",
    ].join("");

    return `
      <article class="card reveal is-visible" role="listitem" style="grid-column:span ${Number(span) || 4}">
        <span class="pill">${escapeHTML(project.year || "")}${project.featured ? " · Featured" : ""}</span>
        <h3><a href="${escapeHTML(getProjectLink(project))}" target="_blank" rel="noopener">${escapeHTML(project.title || "Untitled Project")}</a></h3>
        <img class="thumb" src="${escapeHTML(imageCandidates[0])}" data-fallback-srcs="${escapeHTML(JSON.stringify(imageCandidates.slice(1)))}" alt="${escapeHTML(project.title || "Project")} 썸네일" loading="lazy" onerror="window.__portfolioProjectImageFallback && window.__portfolioProjectImageFallback(this)">
        <p>${escapeHTML(project.summary || "")}</p>
        ${links ? `<div class="timeline-links">${links}</div>` : ""}
      </article>`;
  }

  async function renderFeaturedProjects() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;
    try {
      const limit = Number(grid.dataset.limit || 3);
      const projects = (await fetchJSON(PROJECTS_URL)).filter((project) => project.featured).sort(sortByRecentYear).slice(0, limit);
      if (!projects.length) throw new Error("No featured projects");
      grid.innerHTML = projects.map((project) => projectCardHTML(project, 4)).join("");
    } catch (error) {
      console.warn("[portfolio] featured projects failed:", error);
      const fallback = document.getElementById("featured-fallback");
      if (fallback) fallback.hidden = false;
    }
  }

  async function renderAllProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;
    try {
      const projects = (await fetchJSON(PROJECTS_URL)).sort(sortByRecentYear);
      if (!projects.length) throw new Error("No projects");
      grid.innerHTML = projects.map((project) => projectCardHTML(project, 4)).join("");
    } catch (error) {
      console.warn("[portfolio] projects failed:", error);
      const fallback = document.getElementById("projects-fallback");
      if (fallback) fallback.hidden = false;
    }
  }

  async function renderCareerTimeline() {
    const root = document.getElementById("career-timeline");
    if (!root) return;
    try {
      const career = await fetchJSON(CAREER_URL);
      root.innerHTML = career.map(careerItemHTML).join("");
    } catch (error) {
      console.warn("[portfolio] career timeline failed:", error);
    }
  }

  function careerItemHTML(item) {
    const links = (item.links || [])
      .map((link) => iconLink(link.label || "Link", link.url || "#", link.icon || "link"))
      .join("");
    return `
      <article class="timeline-item reveal is-visible">
        <div class="timeline-card">
          <div class="timeline-meta"><span class="pill">${escapeHTML(item.date)}</span><span class="pill">${item.icon === "Shield" ? "🛡️ " : ""}${escapeHTML(item.type)}</span></div>
          <h3>${escapeHTML(item.title)}</h3>
          ${item.desc ? `<p>${escapeHTML(item.desc)}</p>` : ""}
          ${links ? `<div class="timeline-links">${links}</div>` : ""}
        </div>
      </article>`;
  }
})();
