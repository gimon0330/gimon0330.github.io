(() => {
  "use strict";

  const app = document.getElementById("universe-app");
  if (!app) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const base = String(app.dataset.base || "").replace(/\/$/, "");
  const withBase = (path) => `${base}/${String(path).replace(/^\/+/, "")}`;

  const fallbackProjects = [
    { title: "GR 3D Relativity Simulator", year: 2026, featured: true, summary: "Schwarzschild spacetime을 3D로 시각화한 상대성이론 시뮬레이터.", links: { overview: "https://gimon0330.github.io/gr-3d-relativity-simulator/" } },
    { title: "Paperplane Flight", year: 2026, featured: true, summary: "Three.js로 구현한 browser-based 3D paper plane flight game.", links: { overview: "https://gimon0330.github.io/paperplane/" } },
    { title: "CCDI Internship Platform", year: 2026, summary: "외국인 유학생 표준현장실습학기제 신청과 관리자 심사를 위한 full-stack platform.", links: { overview: "https://ccdi.kr" } }
  ];

  const fallbackCareer = [
    { date: "2026", type: "Project", title: "외국인 유학생 표준현장실습학기제 신청 플랫폼 개발", desc: "사단법인 문화콘텐츠개발원 프로젝트" },
    { date: "2025", type: "Leadership", title: "포항공과대학교 음악감상동아리 음이랑 회장" },
    { date: "2024", type: "Research", title: "포항공과대학교 학부생 연구프로그램 참여", desc: "LLM을 이용한 북퍼퓸 제작 시스템" },
    { date: "2023", type: "Award", title: "유니스트 슈퍼컴퓨팅 청소년캠프 대상" }
  ];

  const state = { projects: fallbackProjects, career: fallbackCareer, activeWorld: null };

  const canvas = $("#universe-canvas");
  const ctx = canvas?.getContext("2d", { alpha: true });
  const map = $("#universe-map");
  const mapCoordinates = $("#map-coordinates");
  const panel = $("#detail-panel");
  const emptyPanel = $(".detail-empty", panel);
  const contentPanel = $(".detail-content", panel);
  const detailKicker = $("#detail-kicker");
  const detailTitle = $("#detail-title");
  const detailDescription = $("#detail-description");
  const detailMeta = $("#detail-meta");
  const detailList = $("#detail-list");
  const actions = { close: $(".detail-close", panel) };
  const nodes = $$(".world-node");

  const pointer = { current: { x: .5, y: .52, force: 0 }, target: { x: .5, y: .52, force: 0 } };
  let canvasWidth = 0;
  let canvasHeight = 0;
  let deviceScale = 1;
  let frameId = 0;
  let touchFadeTimer = 0;
  let stars = [];

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  }

  function safeUrl(value) {
    const url = String(value || "").trim();
    return /^(https?:|mailto:)/i.test(url) ? url : "";
  }

  function linkLabel(key) {
    return ({ github: "GH", overview: "↗", docs: "DOC", youtube: "YT" })[key] || "↗";
  }

  function appendLink(parent, key, url) {
    const safe = safeUrl(url);
    if (!safe) return;
    const link = makeElement("a", "catalog-link", linkLabel(key));
    link.href = safe;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", `${key} 링크 열기`);
    parent.append(link);
  }

  function yearFrom(value) {
    const match = String(value || "").match(/\d{4}/);
    return match ? match[0] : "—";
  }

  function itemLinks(item) {
    if (item.links && !Array.isArray(item.links)) return Object.entries(item.links);
    if (Array.isArray(item.links)) return item.links.map((link) => [link.icon || link.label || "link", link.url]);
    return [];
  }

  function catalogItem(item) {
    const article = makeElement("article", "catalog-item");
    article.append(makeElement("div", "catalog-year", yearFrom(item.year || item.date)));

    const body = makeElement("div", "catalog-body");
    body.append(makeElement("h3", "", item.title || "Untitled"));
    if (item.summary || item.desc) body.append(makeElement("p", "", item.summary || item.desc));
    if (item.type || item.featured) body.append(makeElement("span", "catalog-type", item.featured ? "FEATURED PROJECT" : String(item.type || "PROJECT").toUpperCase()));
    article.append(body);

    const links = makeElement("div", "catalog-links");
    itemLinks(item).forEach(([key, url]) => appendLink(links, key, url));
    if (links.childElementCount) article.append(links);
    return article;
  }

  function profileContent() {
    const grid = makeElement("div", "profile-grid");
    const about = makeElement("div", "profile-block");
    about.append(makeElement("h3", "", "ABOUT"));
    about.append(makeElement("p", "", "POSTECH 컴퓨터공학과 24학번으로 공부하고 있습니다."));
    about.append(makeElement("p", "", "ML 응용과 AI Architecture에 관심이 있고, 배운 것을 정리해 공유하는 개발자를 목표로 합니다."));
    const links = makeElement("div", "profile-links");
    [["email", "mailto:gimon0331@gmail.com"], ["github", "https://github.com/gimon0330"], ["instagram", "https://instagram.com/gimon0303"]].forEach(([label, url]) => {
      const link = makeElement("a", "", label);
      link.href = url;
      if (!url.startsWith("mailto:")) { link.target = "_blank"; link.rel = "noopener"; }
      links.append(link);
    });
    about.append(links);
    const education = makeElement("div", "profile-block");
    education.append(makeElement("h3", "", "EDUCATION"));
    education.append(makeElement("p", "", "포항공과대학교"));
    education.append(makeElement("p", "", "Computer Science & Mathematics · 2024 — 2030"));
    education.append(makeElement("p", "", "부산일과학고등학교 · 2021 — 2024"));
    grid.append(about, education);
    return grid;
  }

  function learningItems() {
    return [
      { year: "NOW", type: "INTEREST", title: "Machine Learning", desc: "모델을 실제 문제와 usable interface로 연결하는 방법을 탐구합니다." },
      { year: "NOW", type: "INTEREST", title: "AI Architecture", desc: "학습 시스템의 구조와 효율적인 응용을 공부하고 있습니다." },
      { year: "2024—25", type: "RESEARCH", title: "UWB Indoor Positioning", desc: "무선 IoT와 AI를 연결하는 indoor positioning 연구에 참여했습니다." },
      { year: "ARCHIVE", type: "COURSEWORK", title: "Coursework Archive", desc: "POSTECH에서 배운 내용과 과제를 정리해두었습니다.", links: { archive: `${base}/coursework.html` } }
    ];
  }

  function regionData(key) {
    if (key === "profile") return {
      kicker: "CORE / PROFILE",
      title: "안강현",
      description: "문제를 관찰하고, 배운 것을 직접 만져볼 수 있는 결과물로 바꾸는 개발자입니다.",
      meta: [["ROLE", "AI Developer · Researcher"], ["BASE", "POSTECH / KOREA"]],
      custom: profileContent
    };
    if (key === "projects") return {
      kicker: "ORBIT / PROJECTS",
      title: "만든 것들",
      description: "게임, 시뮬레이션, AI와 웹 서비스까지 — 아이디어가 작동하는 세계가 되는 과정입니다.",
      meta: [["OBJECTS", state.projects.length], ["LATEST", yearFrom(state.projects[0]?.year)]],
      items: state.projects
    };
    if (key === "path") return {
      kicker: "TIMELINE / PATH",
      title: "지나온 궤도",
      description: "학교와 연구실, 동아리와 프로젝트에서 배운 것들이 지금의 관심사로 이어졌습니다.",
      meta: [["EVENTS", state.career.length], ["RANGE", `${yearFrom(state.career[0]?.date)} — ${yearFrom(state.career[state.career.length - 1]?.date)}`]],
      items: [...state.career].reverse()
    };
    if (key === "research") {
      const research = state.career.filter((item) => /research|project/i.test(String(item.type || "")));
      return {
        kicker: "LAB / RESEARCH",
        title: "질문을 실험으로",
        description: "정답을 바로 찾기보다, 관찰하고 구현하고 다시 질문하는 과정을 좋아합니다.",
        meta: [["RECORDS", research.length], ["FOCUS", "AI · IoT · VISION"]],
        items: research.length ? research : fallbackCareer.filter((item) => item.type === "Research")
      };
    }
    return {
      kicker: "STUDY / LEARNING",
      title: "배우는 중",
      description: "수업에서 얻은 개념을 코드와 글로 다시 정리하며 다음 궤도를 준비합니다.",
      meta: [["TOPICS", learningItems().length], ["ARCHIVE", "OPEN"]],
      items: learningItems()
    };
  }

  function renderMeta(meta) {
    detailMeta.replaceChildren();
    meta.forEach(([label, value]) => {
      const item = makeElement("span", "", `${label} `);
      item.append(makeElement("strong", "", value));
      detailMeta.append(item);
    });
  }

  function renderRegion(key) {
    const data = regionData(key);
    detailKicker.textContent = data.kicker;
    detailTitle.textContent = data.title;
    detailDescription.textContent = data.description;
    renderMeta(data.meta);
    detailList.replaceChildren();
    if (data.custom) detailList.append(data.custom());
    else if (data.items.length) data.items.forEach((item) => detailList.append(catalogItem(item)));
    else detailList.append(makeElement("p", "catalog-empty", "아직 기록된 항목이 없습니다."));
  }

  function openRegion(key, shouldScroll = true) {
    state.activeWorld = key;
    nodes.forEach((node) => {
      const active = node.dataset.world === key;
      node.setAttribute("aria-expanded", String(active));
      node.classList.toggle("is-active", active);
    });
    renderRegion(key);
    emptyPanel.hidden = true;
    contentPanel.hidden = false;
    $("#interaction-hint").textContent = "다른 영역을 선택하거나, 닫기를 눌러 지도로 돌아가세요.";
    if (shouldScroll && window.matchMedia("(max-width: 680px)").matches) {
      window.requestAnimationFrame(() => panel.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest" }));
    }
  }

  function closeRegion() {
    state.activeWorld = null;
    nodes.forEach((node) => {
      node.setAttribute("aria-expanded", "false");
      node.classList.remove("is-active");
    });
    contentPanel.hidden = true;
    emptyPanel.hidden = false;
    $("#interaction-hint").textContent = "영역을 선택하면 그곳의 기록이 열립니다.";
  }

  function updateCounts() {
    $("#object-count").textContent = String(state.projects.length + state.career.length).padStart(2, "0");
    $("#world-count").textContent = String(nodes.length).padStart(2, "0");
  }

  async function loadJSON(path, fallback) {
    try {
      const response = await fetch(withBase(path), { cache: "no-store" });
      if (!response.ok) throw new Error(`${response.status} ${path}`);
      const value = await response.json();
      return Array.isArray(value) ? value : fallback;
    } catch (error) {
      console.warn("[universe] catalog unavailable:", path, error);
      return fallback;
    }
  }

  function random(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function createStars() {
    const next = random(240924);
    const amount = Math.min(210, Math.max(105, Math.round((window.innerWidth * window.innerHeight) / 10500)));
    stars = Array.from({ length: amount }, () => ({ x: next(), y: next(), radius: .35 + next() * 1.15, alpha: .18 + next() * .58, depth: .25 + next() * .75 }));
  }

  function setPointer(x, y, force = 1) {
    pointer.target.x = Math.max(0, Math.min(1, x / Math.max(window.innerWidth, 1)));
    pointer.target.y = Math.max(0, Math.min(1, y / Math.max(window.innerHeight, 1)));
    pointer.target.force = force;
    if (!frameId) frameId = window.requestAnimationFrame(animate);
  }

  function resetPointer() {
    pointer.target.force = 0;
    if (!frameId) frameId = window.requestAnimationFrame(animate);
  }

  function warpedPoint(x, y) {
    const cx = pointer.current.x * canvasWidth;
    const cy = pointer.current.y * canvasHeight;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(canvasWidth, canvasHeight) * .31;
    const influence = pointer.current.force * Math.exp(-(distance * distance) / (radius * radius));
    const pull = .27 * influence;
    return [x - dx * pull, y - dy * pull + influence * 26];
  }

  function nodeCenter(node) {
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function drawRoutes() {
    const route = ["profile", "projects", "research", "learning", "path", "profile"]
      .map((key) => document.querySelector(`[data-world="${key}"]`))
      .filter(Boolean)
      .map(nodeCenter);
    if (route.length < 2) return;
    ctx.save();
    ctx.globalAlpha = .14;
    ctx.strokeStyle = getComputedStyle(app).getPropertyValue("--u-cyan").trim() || "#91d5ff";
    ctx.lineWidth = .7;
    ctx.setLineDash([2, 10]);
    ctx.beginPath();
    route.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else {
        const previous = route[index - 1];
        const middleX = (previous.x + point.x) / 2;
        ctx.quadraticCurveTo(middleX, (previous.y + point.y) / 2 - 28, point.x, point.y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  function drawUniverse() {
    if (!ctx || !canvasWidth || !canvasHeight) return;
    const style = getComputedStyle(app);
    const gridColor = style.getPropertyValue("--u-grid").trim() || "rgba(115,161,203,.26)";
    const ink = style.getPropertyValue("--u-ink").trim() || "#edf3ff";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    stars.forEach((star) => {
      const x = star.x * canvasWidth + (pointer.current.x - .5) * star.depth * 12;
      const y = star.y * canvasHeight + (pointer.current.y - .5) * star.depth * 9;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = .2;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = .65;
    const step = Math.max(54, Math.min(76, Math.round(canvasWidth / 19)));
    for (let x = -step; x <= canvasWidth + step; x += step) {
      ctx.beginPath();
      for (let y = -70; y <= canvasHeight + 70; y += 9) {
        const point = warpedPoint(x, y);
        if (y === -70) ctx.moveTo(point[0], point[1]);
        else ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }
    for (let y = -step; y <= canvasHeight + step; y += step) {
      ctx.beginPath();
      for (let x = -70; x <= canvasWidth + 70; x += 9) {
        const point = warpedPoint(x, y);
        if (x === -70) ctx.moveTo(point[0], point[1]);
        else ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }

    drawRoutes();
    ctx.globalAlpha = 1;
  }

  function animate() {
    frameId = 0;
    const ease = reduceMotion.matches ? 1 : .13;
    let distance = 0;
    ["x", "y", "force"].forEach((key) => {
      const difference = pointer.target[key] - pointer.current[key];
      pointer.current[key] += difference * ease;
      distance += Math.abs(difference);
    });
    drawUniverse();
    if (distance > .0015) frameId = window.requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    deviceScale = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(canvasWidth * deviceScale);
    canvas.height = Math.round(canvasHeight * deviceScale);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    createStars();
    drawUniverse();
  }

  function updateMapCoordinates(clientX, clientY) {
    if (!mapCoordinates || !map) return;
    const rect = map.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(rect.width, 1)));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(rect.height, 1)));
    mapCoordinates.textContent = `FIELD ${(x * 100).toFixed(2)} / ${(y * 100).toFixed(2)}`;
  }

  function attractToNode(node) {
    const center = nodeCenter(node);
    setPointer(center.x, center.y, .9);
    updateMapCoordinates(center.x, center.y);
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => openRegion(node.dataset.world));
    node.addEventListener("pointerenter", () => attractToNode(node));
    node.addEventListener("focus", () => attractToNode(node));
  });

  if (map) {
    map.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") {
        setPointer(event.clientX, event.clientY, .95);
        updateMapCoordinates(event.clientX, event.clientY);
        window.clearTimeout(touchFadeTimer);
        touchFadeTimer = window.setTimeout(() => { if (!state.activeWorld) resetPointer(); }, 900);
      }
    }, { passive: true });
    map.addEventListener("pointermove", (event) => updateMapCoordinates(event.clientX, event.clientY), { passive: true });
    map.addEventListener("pointerleave", () => { if (!state.activeWorld) resetPointer(); });
  }

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    setPointer(event.clientX, event.clientY, 1);
    if (map) updateMapCoordinates(event.clientX, event.clientY);
  }, { passive: true });
  window.addEventListener("blur", resetPointer, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.activeWorld) {
      closeRegion();
      $(".world-node:focus")?.focus();
    }
  });
  actions.close?.addEventListener("click", closeRegion);
  $("#current-year").textContent = String(new Date().getFullYear());

  updateCounts();
  resizeCanvas();

  Promise.all([
    loadJSON("/projects.json", fallbackProjects),
    loadJSON("/career.json", fallbackCareer)
  ]).then(([projects, career]) => {
    state.projects = projects;
    state.career = career;
    updateCounts();
    if (state.activeWorld) renderRegion(state.activeWorld);
  });
})();
