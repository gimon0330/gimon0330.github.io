const BASE = (typeof window !== "undefined" && window.__BASEURL__) || "";
const PROJECTS_URL = BASE + "/projects.json";

const CAREER = [
  { date:"2021", type:"Club", title:"부산일과학고등학교 AI동아리 Mathcom 동아리원" },
  { date:"2021", type:"Research", title:"수학 교과 R&E 프로그램", desc:"아핀 암호, 힐 암호 연구 및 해독기 개발" },
  { date:"2022", type:"Leadership", title:"부산일과학고등학교 AI동아리 Mathcom 동아리장" },
  { date:"2022", type:"Research", title:"정보 교과 R&E 프로그램", desc:"CNN 및 Mediapipe를 이용한 동작 감지 연구" },
  { date:"2022.12.21", type:"Project", title:"BSIS IT Festival 출전", desc:"오목 AI", links:[{label:"GitHub", url:"https://github.com/gimon0330/omok-ai", icon:"GitHub"}] },
  { date:"2023.6.8 ~ 2023.6.9", type:"Award", title:"부산과학전람회 동상", desc:"손 포즈 및 제스처의 인식을 이용한 지능형 스피커의 개발" },
  { date:"2023.7.6 ~ 2023.7.8", type:"Activity", title:"독도의용수비대 활동", desc:"Zep Platform 게임 개발", links:[{label:"YouTube", url:"https://youtu.be/iEmnS4XCC1A?feature=shared", icon:"YouTube"}] },
  { date:"2023.7.10 ~ 2023.7.13", type:"Award", title:"BSIS AIoT Hack 2023 장려상" },
  { date:"2023.7.17 ~ 2023.7.21", type:"Award", title:"유니스트 슈퍼컴퓨팅 청소년캠프 대상" },
  { date:"2024", type:"Campus", title:"포항공과대학교 해맞이한마당 준비위원회 기획 3팀원" },
  { date:"2024", type:"Campus", title:"포항공과대학교 동아리연합회 재정총괄부원" },
  { date:"2024.7.15 ~ 2024.7.16", type:"Mentor", title:"부산일과학고등학교 해커톤 멘토" },
  { date:"2024.8.9 ~ 2024.8.11", type:"Hackathon", title:"Junction ASIA 2024 Hackathon 출전" },
  { date:"2024.11.1 ~ 2024.11.14", type:"Award", title:"포항공과대학교 IT융합공학과 창의캠프 대상", desc:"YOLO V5를 이용한 도로 위협 감지 시스템" },
  { date:"2024.03.18 ~ 2025.01.14", type:"Research", title:"포항공과대학교 학부생 연구프로그램 참여", desc:"LLM을 이용한 북퍼퓸 제작 시스템" },
  { date:"2024.12.23 ~ 2025.2.1", type:"Research", title:"Artificial Intelligence of Things Laboratory at POSTECH", desc:"학부연구생 신분으로 UWB 연구 진행" },
  { date:"2025", type:"Leadership", title:"포항공과대학교 동아리연합회 재정총괄부장" },
  { date:"2025", type:"Leadership", title:"포항공과대학교 음악감상동아리 음이랑 회장" },
  { date:"2025", type:"Competition", title:"포스텍-카이스트 학생대제전, 포카전 AI 종목 선수단원" },
  { date:"2025.2.10 ~ 2025.2.14", type:"Mentor", title:"포항공과대학교 새내기새로배움터 13분반 인솔자" },
  { date:"2025.2.17 ~ 2025.5.6", type:"Mentor", title:"포항공과대학교 무은재학부 미적분학I SMP 멘토" },
  { date:"2025.6.30 ~ 2025.7.18", type:"Exchange", title:"연세대학교 학점교류", desc:"노어노문학과" },
  { date:"2025.9.1 ~ 2025.12.19", type:"Mentor", title:"포항공과대학교 무은재학부 미적분학II SMP 멘토" },
  { date:"2025.12.22 ~ 2026.1.8", type:"Exchange", title:"한국예술종합학교 학점교류", desc:"연극과" },
  { date:"2026.2.9 ~ 2026.2.10", type:"Leadership", title:"포항공과대학교 새내기새로배움터 동아리탐방 음이랑 인솔자 진행" },
  { date:"2026.2.22 ~ 2026.3.22", type:"Project", title:"사단법인 문화콘텐츠개발원", desc:"외국인 유학생 표준현장실습학기제 신청 플랫폼 개발 · ccdi.kr" },
  { date:"2026.3.23 ~ 2027.12.22", type:"Service", title:"입대", desc:"군 복무", icon:"Shield" }
];

document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  setupReveal();
  setupPageTransitions();
  if (document.getElementById("featured-grid")) renderFeatured();
  if (document.getElementById("projects-grid")) renderAllProjects();
  if (document.getElementById("career-timeline")) renderCareerTimeline();
});

function setupReveal(){
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add("is-visible"); io.unobserve(entry.target); } });
  }, { threshold:.14 });
  els.forEach(el=>io.observe(el));
}

function setupPageTransitions(){
  const layer = document.querySelector(".page-transition");
  if (!layer) return;
  document.querySelectorAll("a[data-transition-link]").forEach(a=>{
    a.addEventListener("click", (e)=>{
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || a.target === "_blank") return;
      e.preventDefault();
      layer.classList.add("is-active");
      setTimeout(()=>{ window.location.href = href; }, 220);
    });
  });
}

const linkOf = (p) => (p?.links?.overview) || (p?.links?.github) || (p?.links?.docs) || "#";
const imgOf = (title) => BASE + `/src/projects/${encodeURIComponent(title)}.jpg`;

function projectCardHTML(p, span = 4){
  const tech = (p.tech || []).slice(0,6).map(t=>`<span class="pill">${t}</span>`).join(" ");
  const img = `<img class="thumb" src="${imgOf(p.title)}" alt="${p.title} 썸네일" onerror="this.style.display='none'">`;
  return `<article class="card reveal is-visible" role="listitem" style="grid-column:span ${span}">
    <span class="pill">${p.year || ""}${p.featured ? " · Featured" : ""}</span>
    <h3><a href="${linkOf(p)}" target="_blank" rel="noopener">${p.title}</a></h3>${img}
    <p>${p.summary || ""}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${tech}</div>
    <div class="timeline-links">${p.links?.github ? `<a class="icon-link" href="${p.links.github}" target="_blank" rel="noopener">GitHub →</a>` : ""}${p.links?.docs ? `<a class="icon-link" href="${p.links.docs}" target="_blank" rel="noopener">Docs →</a>` : ""}${p.links?.overview ? `<a class="icon-link" href="${p.links.overview}" target="_blank" rel="noopener">Overview →</a>` : ""}</div>
  </article>`;
}

async function getProjects(){
  const res = await fetch(PROJECTS_URL, { cache:"no-store" });
  if (!res.ok) throw new Error("missing projects.json");
  return await res.json();
}
async function renderFeatured(){
  const grid = document.getElementById("featured-grid");
  const fallback = document.getElementById("featured-fallback");
  try{
    const data = await getProjects();
    const list = data.filter(p=>p.featured).sort((a,b)=>(b.year||0)-(a.year||0)).slice(0,3);
    grid.innerHTML = list.map(p=>projectCardHTML(p,4)).join("");
  }catch{ if(fallback) fallback.hidden=false; }
}
async function renderAllProjects(){
  const grid = document.getElementById("projects-grid");
  const fallback = document.getElementById("projects-fallback");
  const filter = document.getElementById("project-filter");
  try{
    const data = await getProjects();
    const tags = Array.from(new Set(data.flatMap(p=>p.tech || []))).sort();
    const draw = (tag="ALL") => {
      const list = tag === "ALL" ? data : data.filter(p=>(p.tech||[]).includes(tag));
      grid.innerHTML = list.sort((a,b)=>(b.year||0)-(a.year||0)).map(p=>projectCardHTML(p,4)).join("");
    };
    if(filter){
      filter.innerHTML = [`<button class="chip is-active" data-tag="ALL">ALL</button>`, ...tags.map(t=>`<button class="chip" data-tag="${t}">${t}</button>`)].join("");
      filter.addEventListener("click", e=>{ const btn=e.target.closest(".chip"); if(!btn) return; filter.querySelectorAll(".chip").forEach(x=>x.classList.toggle("is-active",x===btn)); draw(btn.dataset.tag); });
    }
    draw();
  }catch{ if(fallback) fallback.hidden=false; }
}
function renderCareerTimeline(){
  const root = document.getElementById("career-timeline");
  root.innerHTML = CAREER.map(item=>`<article class="timeline-item reveal is-visible"><div class="timeline-card"><div class="timeline-meta"><span class="pill">${item.date}</span><span class="pill">${item.icon === "Shield" ? "🛡️ " : ""}${item.type}</span></div><h3>${item.title}</h3>${item.desc ? `<p>${item.desc}</p>` : ""}${item.links ? `<div class="timeline-links">${item.links.map(l=>`<a class="icon-link" href="${l.url}" target="_blank" rel="noopener">${l.icon || "Link"} · ${l.label} →</a>`).join("")}</div>` : ""}</div></article>`).join("");
}
