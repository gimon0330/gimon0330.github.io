// ========= Config =========
const BASE = (typeof window !== "undefined" && window.__BASEURL__) || "";
const PROJECTS_URL  = BASE + "/projects.json";
const BLOG_INDEX_URL = BASE + "/posts/blog/index.json";

const CATEGORY_INDEX = {
  blog:   BASE + "/posts/blog/index.json",
  bsis:   BASE + "/posts/bsis/index.json",
  postech:BASE + "/posts/postech/index.json",
  lecture: BASE + "/posts/lecture/index.json"
};


// ========= Boot =========
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // 메인 페이지 요소가 있을 때만 실행
  if (document.getElementById("featured-grid")) renderFeatured();
  if (document.getElementById("recent-grid")) renderRecentPosts();
  if (document.getElementById("projects-grid")) renderAllProjects();
  if (document.getElementById("all-posts"))     renderAllPostsIndex();

  // 버튼 그라데이션 컨트롤러
  setupGradientButtons();
});

// ========= Helpers =========
const imgOf = (title) => `/src/projects/${encodeURIComponent(title)}.jpg`;
const linkOf = (p) =>
  (p?.links?.overview) || (p?.links?.github) || (p?.links?.docs) || "#";

function categoryFromUrl(url) {
  try {
    const m = url.match(/\/posts\/([^\/]+)\//i);
    return m ? m[1] : null;
  } catch { return null; }
}

function postCoverSrc(category, slug){
  return BASE + `/src/posts/${category}/${encodeURIComponent(slug)}.jpg`;
}

function postItemHTML(category, item){
  const date = item.date ?? "";
  const excerpt = (item.excerpt ?? "").slice(0, 180);
  // cover 우선순위: item.cover > 규칙 경로
  let cover = item.cover;
  if (!cover && item.url){
    const m = item.url.match(/\/([^\/]+)\.(html|md)$/i);
    const slug = m ? m[1] : null;
    if (slug && category) cover = postCoverSrc(category, slug);
  }
  const coverImg = cover
    ? `<img class="post-cover" src="${cover}" alt="${item.title} 표지" onerror="this.style.display='none'">`
    : `<img class="post-cover" src="" alt="" style="display:none">`;

  return `
    <article class="card post-card" role="listitem">
      <div>${coverImg}</div>
      <div>
        <div class="post-meta">
          <span class="pill">${date}</span>
          ${category ? `<span class="pill">${category}</span>` : ""}
        </div>
        <h3 style="margin:8px 0">
          <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>
        </h3>
        <p class="post-excerpt">${excerpt}</p>
        <div style="margin-top:10px">
          <a class="btn btn-3" href="${item.url}" target="_blank" rel="noopener"><span>읽기 →</span></a>
        </div>
      </div>
    </article>
  `;
}

/* ======= 모든 글 최신순(Posts 인덱스) ======= */
async function renderAllPostsIndex(){
  const listEl = document.getElementById("all-posts");
  const fallback = document.getElementById("all-posts-fallback");
  if (!listEl) return;

  try{
    const [blog, bsis, postech] = await Promise.all([
      fetch(CATEGORY_INDEX.blog,   { cache: "no-store" }).then(r=>r.ok?r.json():[]),
      fetch(CATEGORY_INDEX.bsis,   { cache: "no-store" }).then(r=>r.ok?r.json():[]),
      fetch(CATEGORY_INDEX.postech,{ cache: "no-store" }).then(r=>r.ok?r.json():[]),
    ]);

    // 카테고리 라벨을 URL에서 추정해 부착
    const withCat = (arr) => (arr || []).map(item => ({
      ...item,
      __cat: categoryFromUrl(item.url) || null
    }));

    const merged = [...withCat(blog), ...withCat(bsis), ...withCat(postech)]
      // Projects 카테고리는 원래 안 섞었지만, 혹시 섞여도 필터
      .filter(item => item.__cat !== "projects");

    // 최신순 정렬 (YYYY-MM-DD 문자열 비교)
    merged.sort((a,b) => (b.date ?? "").localeCompare(a.date ?? ""));

    listEl.innerHTML = merged.map(item => postItemHTML(item.__cat, item)).join("");
    setupGradientButtons(listEl); // "읽기" 버튼 애니메이션 적용
  }catch{
    if (fallback) fallback.hidden = false;
  }
}

function projectIconsHTML(p){
  if (!p?.links) return "";
  const items = [];

  if (p.links.github) {
    items.push(`
      <a class="icon-btn" href="${p.links.github}" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 .5A11.4 11.4 0 0 0 .6 11.9c0 5 3.3 9.2 7.8 10.7.6.1.8-.2.8-.5v-2c-3.2.7-3.8-1.5-3.8-1.5-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1.8-.8 1.7-1 .1-.7.4-1.1.7-1.3-2.5-.3-5.1-1.3-5.1-5.8 0-1.3.5-2.4 1.2-3.3 0-.3-.5-1.5.1-3 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.5.1 2.7.1 3 .7.9 1.2 2 1.2 3.3 0 4.5-2.6 5.5-5.2 5.8.4.3.8 1 .8 2v3c0 .3.2.6.8.5 4.6-1.5 7.8-5.7 7.8-10.7A11.4 11.4 0 0 0 12 .5z"/>
        </svg>
      </a>
    `);
  }

  if (p.links.docs) {
    items.push(`
      <a class="icon-btn" href="${p.links.docs}" target="_blank" rel="noopener" aria-label="Docs">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 11h8v1.5H8V11zm0 3h8v1.5H8V14zm0 3h5v1.5H8V17z"/>
        </svg>
      </a>
    `);
  }

  if (p.links.overview) {
    items.push(`
      <a class="icon-btn" href="${p.links.overview}" target="_blank" rel="noopener" aria-label="Overview">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3l2.3 2.3-5.4 5.4 3.4 3.4 5.4-5.4L21 12V3zM3 21h18v-2H5V5H3v16z"/>
        </svg>
      </a>
    `);
  }

  if (!items.length) return "";
  return `<div class="icons">${items.join("")}</div>`;
}

function projectCardHTML(p, span = 6) {
  const tech = (p.tech ?? [])
    .slice(0, 5)
    .map((t) => `<span class="pill">${t}</span>`)
    .join(" ");
  const img = `<img class="thumb" src="${imgOf(p.title)}" alt="${p.title} 썸네일" onerror="this.style.display='none'">`;

  return `
  <article class="card" role="listitem" style="grid-column:span ${span}">
    <div class="pill">${p.year ?? ""}${p.featured ? " · Featured" : ""}</div>
    <h3 style="margin:8px 0"><a href="${linkOf(p)}" target="_blank" rel="noopener">${p.title}</a></h3>
    ${img}
    <p style="min-height:48px">${p.summary ?? ""}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${tech}</div>
    ${projectIconsHTML(p)}
  </article>`;
}

// ========= Renderers =========
async function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  const fallback = document.getElementById("featured-fallback");
  if (!grid) return;

  try {
    const res = await fetch(PROJECTS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("missing projects.json");
    const data = await res.json();

    const list = data
      .filter((p) => p.featured)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "ko"))
      .slice(0, 4);

    grid.innerHTML = list.map((p)=>projectCardHTML(p, 6)).join("");
    setupGradientButtons(grid); // 새로 생긴 아이콘 버튼에 애니메이션 바인딩
  } catch {
    if (fallback) fallback.hidden = false;
  }
}

async function renderAllProjects() {
  const grid = document.getElementById("projects-grid");
  const fallback = document.getElementById("projects-fallback");
  if (!grid) return;

  try {
    const res = await fetch(PROJECTS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("missing projects.json");
    const data = await res.json();

    const list = data
      .slice()
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "ko"));

    grid.innerHTML = list.map((p)=>projectCardHTML(p, 4)).join("");
    setupGradientButtons(grid); // 아이콘 버튼 그라데이션
  } catch {
    if (fallback) fallback.hidden = false;
  }
}

// ========= Recent posts (기존) =========
async function renderRecentPosts() {
  const grid = document.getElementById("recent-grid");
  const fallback = document.getElementById("recent-fallback");
  if (!grid) return;

  try {
    const res = await fetch(BLOG_INDEX_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("missing blog index");
    const data = await res.json();

    const list = data
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
      .slice(0, 4);

    grid.innerHTML = list.map((post) => `
      <article class="card" role="listitem" style="grid-column:span 6">
        <div class="pill">${post.date ?? ""}</div>
        <h3><a href="${post.url}" target="_blank" rel="noopener">${post.title}</a></h3>
        <p style="min-height:48px">${(post.excerpt ?? "").slice(0, 140)}</p>
      </article>`).join("");
  } catch {
    if (fallback) fallback.hidden = false;
  }
}

// ========= Gradient controller (업데이트: .icon-btn 포함) =========
const HOVER_FADE_IN = 350;   // CSS opacity .35s와 동일
const HOLD_AT_FULL  = 120;   // 완전 불투명 유지 시간(ms)

function setupGradientButtons(root = document) {
  // btn-3는 라인 애니메이션을 쓰므로 제외
  const selectors = [
    ".btn:not(.btn-3)",
    ".sidebtn:not(.btn-3)",
    ".icon-btn"
  ].join(",");

  const els = Array.from(root.querySelectorAll(selectors));

  const HOVER_FADE_IN = 350;   // ms
  const HOLD_AT_FULL  = 120;   // ms

  els.forEach((el) => {
    let inTimer = null, holdTimer = null;
    let leaving = false, inDone = false;

    const clearTimers = () => {
      if (inTimer) { clearTimeout(inTimer); inTimer = null; }
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    };

    const beginFadeIn = () => {
      clearTimers();
      leaving = false; inDone = false;
      el.classList.add("grad-on");
      inTimer = setTimeout(() => {
        inDone = true; inTimer = null;
        if (leaving) {
          holdTimer = setTimeout(() => {
            if (!el.matches(":hover") && document.activeElement !== el) {
              el.classList.remove("grad-on");
            }
            holdTimer = null;
          }, HOLD_AT_FULL);
        }
      }, HOVER_FADE_IN);
    };

    const scheduleFadeOut = () => {
      leaving = true;
      if (!inDone) return; // 페이드인이 끝날 때까지 기다림
      holdTimer = setTimeout(() => {
        if (!el.matches(":hover") && document.activeElement !== el) {
          el.classList.remove("grad-on");
        }
        holdTimer = null;
      }, HOLD_AT_FULL);
    };

    el.addEventListener("mouseenter", beginFadeIn);
    el.addEventListener("mouseleave", scheduleFadeOut);
    el.addEventListener("focusin", beginFadeIn);
    el.addEventListener("focusout", scheduleFadeOut);
  });
}

function postCoverSrc(category, slug){
  // slug는 url에서 파일명만 추정할 때 사용 (index.json에 cover가 없을 경우)
  return `/src/posts/${category}/${encodeURIComponent(slug)}.jpg`;
}

function postItemHTML(category, item){
  // item: { title, date:"YYYY-MM-DD", url, excerpt?, cover? }
  const date = item.date ?? "";
  const excerpt = (item.excerpt ?? "").slice(0, 180);
  // cover 확정: 1) item.cover 2) url에서 slug 유추하여 규칙 경로
  let cover = item.cover;
  if (!cover && item.url){
    try{
      const m = item.url.match(/\/([^\/]+)\.(html|md)$/i);
      const slug = m ? m[1] : null;
      if (slug) cover = postCoverSrc(category, slug);
    }catch{}
  }

  const coverImg = cover
    ? `<img class="post-cover" src="${cover}" alt="${item.title} 표지" onerror="this.style.display='none'">`
    : `<img class="post-cover" src="" alt="" style="display:none">`;

  return `
    <article class="card post-card" role="listitem">
      <div>${coverImg}</div>
      <div>
        <div class="post-meta">
          <span class="pill">${date}</span>
        </div>
        <h3 style="margin:8px 0">
          <a href="${item.url}" target="_blank" rel="noopener">${item.title}</a>
        </h3>
        <p class="post-excerpt">${excerpt}</p>
        <div style="margin-top:10px">
          <a class="btn btn-3" href="${item.url}" target="_blank" rel="noopener"><span>읽기 →</span></a>
        </div>
      </div>
    </article>
  `;
}

async function renderCategoryList(){
  const listEl = document.getElementById("cat-list");
  const fallback = document.getElementById("cat-fallback");
  if (!listEl) return;

  const category = listEl.dataset.category; // "blog" | "bsis" | "postech"
  const src = CATEGORY_INDEX[category];
  if (!src){ if (fallback) fallback.hidden = false; return; }

  try{
    const res = await fetch(src, { cache: "no-store" });
    if (!res.ok) throw new Error("missing index");
    const data = await res.json();

    // 최신순 정렬
    const list = data
      .slice()
      .sort((a,b)=> (b.date ?? "").localeCompare(a.date ?? ""));

    listEl.innerHTML = list.map(item => postItemHTML(category, item)).join("");
    setupGradientButtons(listEl); // "읽기" 버튼 애니메이션
  }catch{
    if (fallback) fallback.hidden = false;
  }
}

// ====== Boot hook (이미 있는 DOMContentLoaded에 합쳐도 OK) ======
document.addEventListener("DOMContentLoaded", () => {
  // 기존: featured/recent/projects 초기화 ...
  if (document.getElementById("cat-list")) renderCategoryList();
});
