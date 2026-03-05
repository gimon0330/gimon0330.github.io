/* CCDI section helper (i18n + docs renderer)
   - Language selection is stored in localStorage("ccdi_lang")
   - UI chrome texts can be translated via /ccdi/i18n/<lang>.json (optional)
   - User manual content is loaded from /ccdi/content/usermanual.<lang>.md
*/

(function(){
  const LANGS = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
  ];

  const STORAGE_KEY = 'ccdi_lang';
  const DEFAULT_LANG = 'ko';

  function availableLangs(){
    const raw = document.documentElement.getAttribute('data-ccdi-langs') || 'ko';
    const set = new Set(raw.split(/[\s,]+/).filter(Boolean));
    if(set.size === 0) set.add('ko');
    return set;
  }

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function getQueryLang(){
    try{
      const u = new URL(window.location.href);
      const v = u.searchParams.get('lang');
      return v && LANGS.some(x=>x.value===v) ? v : null;
    }catch{ return null; }
  }

  function getSavedLang(){
    try{
      const v = localStorage.getItem(STORAGE_KEY);
      return v && LANGS.some(x=>x.value===v) ? v : null;
    }catch{ return null; }
  }

  function setSavedLang(lang){
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch{}
  }

  function toast(msg){
    let el = qs('#ccdi-toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'ccdi-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-on');
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(()=> el.classList.remove('is-on'), 2200);
  }

  async function fetchJSON(url){
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error('missing json');
    return res.json();
  }

  function applyI18n(dict){
    // data-i18n="key" with optional data-i18n-attr="placeholder|title|..."
    qsa('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = (dict && key && dict[key]) ? dict[key] : null;
      if(val == null) return;
      const attr = el.getAttribute('data-i18n-attr');
      if(attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });
  }

  function slugify(s){
    return (s || '')
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, '-')
      .replace(/[^a-z0-9\-가-힣_]/g, '')
      .replace(/\-+/g, '-');
  }

  function addHeadingAnchors(container){
    const hs = qsa('h2, h3', container);
    hs.forEach(h=>{
      if(!h.id){
        const base = slugify(h.textContent);
        let id = base || 'section';
        let n = 2;
        while(document.getElementById(id)){
          id = `${base}-${n++}`;
        }
        h.id = id;
      }
      if(!qs('.h-anchor', h)){
        const a = document.createElement('a');
        a.className = 'h-anchor';
        a.href = `#${h.id}`;
        a.setAttribute('aria-label', '링크 복사');
        a.textContent = '#';
        a.addEventListener('click', (e)=>{
          // keep default jump, but also copy
          try{
            const url = `${location.origin}${location.pathname}#${h.id}`;
            navigator.clipboard && navigator.clipboard.writeText(url);
            toast('링크를 복사했어요');
          }catch{}
        });
        h.appendChild(a);
      }
    });
  }

  function buildTOC(container, tocEl){
    if(!tocEl) return;
    const hs = qsa('h2, h3', container);
    const items = hs
      .filter(h=>h.id)
      .map(h=>({
        id: h.id,
        level: h.tagName === 'H2' ? 2 : 3,
        text: (h.textContent || '').replace(/\s*#\s*$/,'').trim()
      }));

    tocEl.innerHTML = items.map(it=>{
      const cls = it.level === 3 ? 'lvl-3' : 'lvl-2';
      return `<a class="${cls}" href="#${it.id}">${it.text}</a>`;
    }).join('');

    // scroll spy
    const links = qsa('a', tocEl);
    const byId = new Map(links.map(a=>[a.getAttribute('href')?.slice(1), a]));
    const obs = new IntersectionObserver((entries)=>{
      // choose most visible heading
      const visible = entries
        .filter(e=>e.isIntersecting)
        .sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
      if(!visible) return;
      const id = visible.target.id;
      links.forEach(a=>a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0.1, 0.25, 0.5]
    });
    hs.forEach(h=>obs.observe(h));

    // smooth scroll
    tocEl.addEventListener('click', (e)=>{
      const a = e.target.closest('a');
      if(!a) return;
      const id = a.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  }

  async function loadChromeI18n(lang){
    // Optional: if /ccdi/i18n/<lang>.json exists, apply it.
    // Otherwise it silently falls back.
    const url = `${(window.__BASEURL__||'')}/ccdi/i18n/${lang}.json`;
    try{
      const dict = await fetchJSON(url);
      applyI18n(dict);
    }catch{}
  }

  async function loadUserManual(lang){
    const mount = qs('#doc');
    if(!mount) return;

    // Optional dynamic mode:
    // - Put data-doc-src="/ccdi/content/usermanual.{lang}.md" on #doc
    // - Add more language md files later
    const tpl = mount.getAttribute('data-doc-src');
    if(!tpl) return; // static HTML mode

    const base = (window.__BASEURL__||'');
    const url = tpl.includes('{lang}') ? `${base}${tpl.replace('{lang}', lang)}` : `${base}${tpl}`;
    let md = null;
    try{
      const res = await fetch(url, { cache: 'no-store' });
      if(res.ok) md = await res.text();
    }catch{}

    if(md == null && lang !== 'ko'){
      toast('해당 언어는 아직 준비 중입니다. 한국어로 표시합니다.');
      return loadUserManual('ko');
    }
    if(md == null){
      mount.innerHTML = `<div class="callout"><strong>문서를 불러오지 못했습니다.</strong><div class="muted" style="margin-top:6px">파일 경로를 확인해 주세요: <code>/ccdi/content/usermanual.${lang}.md</code></div></div>`;
      return;
    }

    if(typeof window.marked === 'undefined'){
      mount.textContent = md;
      return;
    }

    window.marked.setOptions({ gfm: true, breaks: false });
    mount.innerHTML = window.marked.parse(md);
    addHeadingAnchors(mount);
    buildTOC(mount, qs('#toc'));

    // Re-bind gradient hover effects for newly injected anchors/buttons
    if (typeof window.setupGradientButtons === 'function') {
      window.setupGradientButtons(mount);
    }
  }

  function enhanceStaticDoc(){
    const mount = qs('#doc');
    if(!mount) return;
    addHeadingAnchors(mount);
    buildTOC(mount, qs('#toc'));
  }

  function setupNavActive(){
    const path = (location.pathname || '').replace(/\/+$/,'/');
    qsa('.ccdi-links a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      // treat exact match, and also folder index.html equivalence
      try{
        const u = new URL(href, location.origin);
        const p = u.pathname.replace(/\/+$/,'/');
        const isActive = p === path;
        a.classList.toggle('is-active', isActive);
      }catch{}
    });
  }

  function initLangSelect(){
    const sel = qs('#lang-select');
    if(!sel) return { lang: DEFAULT_LANG };

    // ensure options exist (in case HTML kept minimal)
    if(sel.options.length === 0){
      LANGS.forEach(l=>{
        const o = document.createElement('option');
        o.value = l.value;
        o.textContent = l.label;
        sel.appendChild(o);
      });
    }

    const qLang = getQueryLang();
    const saved = getSavedLang();
    const allowed = availableLangs();
    const lang = (qLang && allowed.has(qLang)) ? qLang : (saved && allowed.has(saved) ? saved : DEFAULT_LANG);
    sel.value = lang;
    setSavedLang(lang);

    sel.addEventListener('change', ()=>{
      const v = sel.value;
      const allowed = availableLangs();
      if(!allowed.has(v)){
        toast('해당 언어는 아직 준비 중입니다.');
        sel.value = DEFAULT_LANG;
        setSavedLang(DEFAULT_LANG);
        return;
      }
      setSavedLang(v);

      // Reload chrome and optional doc content
      applyLang(v);
    });

    return { lang };
  }

  async function applyLang(lang){
    await loadChromeI18n(lang);
    const page = document.documentElement.getAttribute('data-ccdi-page');
    if(page === 'ccdi-usermanual'){
      await loadUserManual(lang);
      // If we are in static mode (default), enhance whatever is already in DOM.
      enhanceStaticDoc();
    }
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    setupNavActive();
    const { lang } = initLangSelect();
    await applyLang(lang);
  });
})();
