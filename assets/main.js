(() => {
  "use strict";

  const BASE = ((typeof window !== "undefined" && window.__BASEURL__) || "").replace(/\/$/, "");
  const PROJECTS_URL = withBase("/projects.json");

  const CAREER = [
    { date: "2021", type: "Club", title: "부산일과학고등학교 AI동아리 Mathcom 동아리원" },
    { date: "2021", type: "Research", title: "수학 교과 R&E 프로그램", desc: "아핀 암호, 힐 암호 연구 및 해독기 개발" },
    { date: "2022", type: "Leadership", title: "부산일과학고등학교 AI동아리 Mathcom 동아리장" },
    { date: "2022", type: "Research", title: "정보 교과 R&E 프로그램", desc: "CNN 및 Mediapipe를 이용한 동작 감지 연구" },
    { date: "2022.12.21", type: "Project", title: "BSIS IT Festival 출전", desc: "오목 AI", links: [{ label: "GitHub", url: "https://github.com/gimon0330/omok-ai", icon: "github" }] },
    { date: "2023.6.8 ~ 2023.6.9", type: "Award", title: "부산과학전람회 동상", desc: "손 포즈 및 제스처의 인식을 이용한 지능형 스피커의 개발" },
    { date: "2023.7.6 ~ 2023.7.8", type: "Activity", title: "독도의용수비대 활동", desc: "Zep Platform 게임 개발", links: [{ label: "YouTube", url: "https://youtu.be/iEmnS4XCC1A?feature=shared", icon: "youtube" }] },
    { date: "2023.7.10 ~ 2023.7.13", type: "Award", title: "BSIS AIoT Hack 2023 장려상" },
    { date: "2023.7.17 ~ 2023.7.21", type: "Award", title: "유니스트 슈퍼컴퓨팅 청소년캠프 대상" },
    { date: "2024", type: "Campus", title: "포항공과대학교 해맞이한마당 준비위원회 기획 3팀원" },
    { date: "2024", type: "Campus", title: "포항공과대학교 동아리연합회 재정총괄부원" },
    { date: "2024.7.15 ~ 2024.7.16", type: "Mentor", title: "부산일과학고등학교 해커톤 멘토" },
    { date: "2024.8.9 ~ 2024.8.11", type: "Hackathon", title: "Junction ASIA 2024 Hackathon 출전" },
    { date: "2024.11.1 ~ 2024.11.14", type: "Award", title: "포항공과대학교 IT융합공학과 창의캠프 대상", desc: "YOLO V5를 이용한 도로 위협 감지 시스템" },
    { date: "2024.03.18 ~ 2025.01.14", type: "Research", title: "포항공과대학교 학부생 연구프로그램 참여", desc: "LLM을 이용한 북퍼퓸 제작 시스템" },
    { date: "2024.12.23 ~ 2025.2.1", type: "Research", title: "Artificial Intelligence of Things Laboratory at POSTECH", desc: "학부연구생 신분으로 UWB 연구 진행" },
    { date: "2025", type: "Leadership", title: "포항공과대학교 동아리연합회 재정총괄부장" },
    { date: "2025", type: "Leadership", title: "포항공과대학교 음악감상동아리 음이랑 회장" },
    { date: "2025", type: "Competition", title: "포스텍-카이스트 학생대제전, 포카전 AI 종목 선수단원" },
    { date: "2025.2.10 ~ 2025.2.14", type: "Mentor", title: "포항공과대학교 새내기새로배움터 13분반 인솔자" },
    { date: "2025.2.17 ~ 2025.5.6", type: "Mentor", title: "포항공과대학교 무은재학부 미적분학I SMP 멘토" },
    { date: "2025.6.30 ~ 2025.7.18", type: "Exchange", title: "연세대학교 학점교류", desc: "노어노문학과" },
    { date: "2025.9.1 ~ 2025.12.19", type: "Mentor", title: "포항공과대학교 무은재학부 미적분학II SMP 멘토" },
    { date: "2025.12.22 ~ 2026.1.8", type: "Exchange", title: "한국예술종합학교 학점교류", desc: "연극과" },
    { date: "2026.2.9 ~ 2026.2.10", type: "Leadership", title: "포항공과대학교 새내기새로배움터 동아리탐방 음이랑 인솔자 진행" },
    { date: "2026.2.22 ~ 2026.3.22", type: "Project", title: "사단법인 문화콘텐츠개발원", desc: "외국인 유학생 표준현장실습학기제 신청 플랫폼 개발 · ccdi.kr" },
    { date: "2026.3.23 ~ 2027.12.22", type: "Service", title: "입대", desc: "군 복무", icon: "Shield" },
  ];

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

  async function getProjects() {
    const data = await fetchJSON(PROJECTS_URL);
    return Array.isArray(data) ? data : [];
  }

  function sortByRecentYear(a, b) {
    return (Number(b.year) || 0) - (Number(a.year) || 0)
      || String(a.title || "").localeCompare(String(b.title || ""), "ko");
  }

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
      const projects = (await getProjects()).filter((project) => project.featured).sort(sortByRecentYear).slice(0, limit);
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
      const projects = (await getProjects()).sort(sortByRecentYear);
      if (!projects.length) throw new Error("No projects");
      grid.innerHTML = projects.map((project) => projectCardHTML(project, 4)).join("");
    } catch (error) {
      console.warn("[portfolio] projects failed:", error);
      const fallback = document.getElementById("projects-fallback");
      if (fallback) fallback.hidden = false;
    }
  }

  function renderCareerTimeline() {
    const root = document.getElementById("career-timeline");
    if (!root) return;
    root.innerHTML = CAREER.map((item) => {
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
    }).join("");
  }
})();
