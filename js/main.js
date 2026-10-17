(() => {
  "use strict";

  const C = window.LONI;
  const EN = window.I18N.en;
  const DYN = window.I18N.dyn;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k] ?? "");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const store = {
    get(k) { try { return localStorage.getItem("loni." + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem("loni." + k, v); } catch { /* storage unavailable */ } }
  };

  let lang = store.get("lang") === "en" ? "en" : "sq";
  const t = (k) => DYN[lang][k];
  const local = (o) => (o && typeof o === "object" ? o[lang] ?? o.sq : o);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  const phones = (C.phones || []).filter(Boolean);
  const tel = (p) => "tel:" + p.replace(/[^\d+]/g, "");
  const waNumber = (C.whatsapp || "").replace(/\D/g, "");
  const viberNumber = (C.viber || "").replace(/\D/g, "");
  const place = [C.address, C.city].filter(Boolean).join(", ");
  const mapsQuery = C.mapsQuery || (place ? `${C.name}, ${place}` : "");
  const withPhotos = C.products.filter((p) => (p.photos || []).length);
  const isRender = (src) => !/\/(bioklimatike|mbuloje-xhami|mbuloje-xhami-render|gijotine-\d|slide-\d|zip-\d|mbyllje-[a-z]+|collage)\.webp$/.test(src);
  // Every image has a 960 px sibling: name-960.webp.
  const small = (src) => src.replace(/\.webp$/, "-960.webp");
  const srcset = (src) => `${small(src)} 960w, ${src} 1800w`;
  const img = (src, alt, sizes, extra = "") =>
    `<img src="${esc(small(src))}" srcset="${esc(srcset(src))}" sizes="${sizes}" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}/>`;
  const fit = (src) => (innerWidth * (devicePixelRatio || 1) <= 960 ? small(src) : src);

  const ICON = {
    phone: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
    wa: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/></svg>',
    pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    copy: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    photos: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/></svg>',
    social: {
      instagram: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
      facebook: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z"/></svg>',
      youtube: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
      linkedin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>'
    }
  };

  // Background photos load only once they come near the screen.
  const bgQueue = new Map();
  const bgIO = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.backgroundImage = `url("${bgQueue.get(e.target)}")`;
      bgIO.unobserve(e.target);
    });
  }, { rootMargin: "600px 0px" }) : null;
  function lazyBg(el, src) {
    if (!bgIO) { el.style.backgroundImage = `url("${src}")`; return; }
    if (el.style.backgroundImage) { el.style.backgroundImage = `url("${src}")`; return; }
    bgQueue.set(el, src);
    bgIO.observe(el);
  }

  /* ======================================================================
     Language
     ====================================================================== */
  function applyLang(next) {
    lang = next;
    store.set("lang", lang);
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      if (el.dataset.sq === undefined) el.dataset.sq = el.textContent;
      el.textContent = lang === "sq" ? el.dataset.sq : EN[el.dataset.i18n] ?? el.dataset.sq;
    });
    $$("[data-i18n-html]").forEach((el) => {
      if (el.dataset.sq === undefined) el.dataset.sq = el.innerHTML;
      el.innerHTML = lang === "sq" ? el.dataset.sq : EN[el.dataset.i18nHtml] ?? el.dataset.sq;
    });
    $$("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        const k = "sq" + attr.replace(/\W/g, "");
        if (el.dataset[k] === undefined) el.dataset[k] = el.getAttribute(attr) || "";
        el.setAttribute(attr, lang === "sq" ? el.dataset[k] : EN[key] ?? el.dataset[k]);
      });
    });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$(".hero__title .line").forEach((l) => (l.innerHTML = `<span>${l.innerHTML}</span>`));
    $$(".js-years").forEach((el) => (el.textContent = C.years));
    splitManifesto();
    renderAll();
  }

  function renderAll() {
    renderHeroNav();
    renderFeature();
    renderCatalog();
    renderClosures();
    renderCerts();
    renderStory();
    renderOffer();
    renderContact();
  }

  /* ======================================================================
     Header, menu, progress, dock
     ====================================================================== */
  const header = $("#header");
  const burger = $("#burger");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
  }
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  if (phones[0]) {
    $("#headerPhone").href = tel(phones[0]);
    $("#headerPhone span").textContent = phones[0];
  } else $("#headerPhone").hidden = true;

  const progressFill = $("#progressFill");
  const dock = $("#dock");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle("is-scrolled", y > 30);
      progressFill.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      const offer = $("#offer").getBoundingClientRect();
      dock.classList.toggle("is-on", y > innerHeight * 0.7 && !(offer.top < innerHeight && offer.bottom > innerHeight * 0.4));
      lightManifesto();
      parallax();
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ======================================================================
     Reveal on scroll
     ====================================================================== */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;
  const observe = (root = document) => $$(".reveal:not(.is-in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));

  /* ======================================================================
     Manifesto: words light up as you read
     ====================================================================== */
  const manifesto = $("#manifesto");
  function splitManifesto() {
    if (manifesto.dataset.sq === undefined) manifesto.dataset.sq = manifesto.textContent;
    const text = lang === "sq" ? manifesto.dataset.sq : EN["intro.text"];
    manifesto.innerHTML = text.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(" ");
    lightManifesto();
  }
  function lightManifesto() {
    const words = manifesto.children;
    if (!words.length) return;
    const r = manifesto.getBoundingClientRect();
    const p = reduceMotion ? 1 : clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
    const n = Math.round(p * words.length);
    for (let i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n);
  }

  /* ======================================================================
     Hero: each photo opens through louvres
     ====================================================================== */
  const slides = (C.hero || []).filter((s) => s.src);
  const heroMedia = $("#heroMedia"), heroImg = $("#heroImg"), heroSlats = $("#heroSlats");
  const sizes = {};
  let current = 0, busy = false, timer = 0, paused = false;
  const SLIDE_MS = 7000;

  function loadSize(src) {
    if (sizes[src]) return Promise.resolve(sizes[src]);
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => res((sizes[src] = { w: im.naturalWidth, h: im.naturalHeight }));
      im.onerror = () => res((sizes[src] = { w: 16, h: 9 }));
      im.src = src;
    });
  }

  function renderHeroNav() {
    const nav = $("#heroNav");
    if (!slides.length) { $(".hero__foot").hidden = true; return; }
    nav.innerHTML = slides.map((s, i) =>
      `<button type="button" class="slides__item" data-slide="${i}" aria-pressed="${i === current}" aria-label="${esc(local(s))}"><i><b></b></i><span aria-hidden="true">${esc(local(s))}</span></button>`).join("");
    restartBar();
  }
  function restartBar() {
    $$("#heroNav .slides__item").forEach((b, i) => {
      b.setAttribute("aria-pressed", String(i === current));
      b.classList.remove("is-run");
      if (i === current && !reduceMotion && !paused) { void b.offsetWidth; b.classList.add("is-run"); }
    });
  }

  async function show(next) {
    if (busy || !slides.length) return;
    next = (next + slides.length) % slides.length;
    if (next === current && heroImg.style.backgroundImage) return;
    busy = true;
    const src = fit(slides[next].src);
    const { w, h } = await loadSize(src);
    const W = heroMedia.clientWidth, H = heroMedia.clientHeight;
    const first = !heroImg.style.backgroundImage;

    if (first || reduceMotion) {
      heroImg.style.backgroundImage = `url("${src}")`;
      heroImg.classList.remove("is-zoom"); void heroImg.offsetWidth; heroImg.classList.add("is-zoom");
    } else {
      // Slice the next photo into horizontal louvres, sized exactly like background-size: cover.
      const n = W < 700 ? 7 : 11;
      const s = Math.max(W / w, H / h), bw = w * s, bh = h * s, ox = (W - bw) / 2, oy = (H - bh) / 2;
      heroSlats.innerHTML = Array.from({ length: n }, (_, i) => {
        const top = Math.floor((H / n) * i), hh = Math.ceil(H / n) + 1;
        return `<i style="top:${top}px;height:${hh}px;background-image:url('${src}');background-size:${bw}px ${bh}px;background-position:${ox}px ${oy - top}px;animation-delay:${i * 55}ms"></i>`;
      }).join("");
      heroSlats.classList.add("is-on");
      await new Promise((r) => setTimeout(r, 1000 + n * 55));
      heroImg.style.backgroundImage = `url("${src}")`;
      heroImg.classList.remove("is-zoom"); void heroImg.offsetWidth; heroImg.classList.add("is-zoom");
      heroSlats.classList.remove("is-on");
      heroSlats.innerHTML = "";
    }
    current = next;
    restartBar();
    // preload the following photo
    if (slides.length > 1) loadSize(fit(slides[(current + 1) % slides.length].src));
    busy = false;
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (!paused && !reduceMotion && slides.length > 1) timer = setTimeout(() => show(current + 1), SLIDE_MS);
  }
  function pause(p) { paused = p; restartBar(); schedule(); }

  if (slides.length) {
    $("#heroNav").addEventListener("click", (e) => { const b = e.target.closest("[data-slide]"); if (b) show(+b.dataset.slide); });
    $("#heroPrev").addEventListener("click", () => show(current - 1));
    $("#heroNext").addEventListener("click", () => show(current + 1));
    const hero = $(".hero");
    hero.addEventListener("focusin", () => pause(true));
    hero.addEventListener("focusout", () => pause(false));
    document.addEventListener("visibilitychange", () => pause(document.hidden));
    let sx = null;
    heroMedia.parentElement.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    heroMedia.parentElement.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  } else $(".hero").classList.add("is-empty");

  /* ======================================================================
     Partners, feature
     ====================================================================== */
  $("#partners").innerHTML = (C.partners || []).map((p) => `<li>${esc(p)}</li>`).join("");

  let configIndex = 0;
  const specList = (specs) => (specs || []).map(([k, v]) => `<div><dt>${esc(local(k))}</dt><dd>${esc(local(v))}</dd></div>`).join("");
  function renderFeature() {
    const f = C.featured;
    const p = C.products.find((x) => x.id === f.product);
    if (!f || !p) { $("#feature").hidden = true; return; }
    $("#featureKicker").textContent = f.name || local(p);
    $("#featureSpecs").innerHTML = specList(p.specs);
    const configs = f.configs || [];
    $("#configTabs").innerHTML = configs.map((c, i) =>
      `<button type="button" data-config="${i}" aria-pressed="${i === configIndex}">${esc(local(c))}</button>`).join("");
    const stage = $("#configStage");
    if (!stage.children.length) {
      stage.innerHTML = configs.map((c, i) =>
        img(c.img, "", "(max-width: 1080px) 100vw, 60vw", `class="${i === configIndex ? "is-on" : ""}"`)).join("") +
        `<span class="configs__label" id="configLabel"></span>`;
    }
    $$("img", stage).forEach((im, i) => im.setAttribute("alt", `${local(p)} · ${local(configs[i])}`));
    $("#configLabel").textContent = `${String(configIndex + 1).padStart(2, "0")} / ${String(configs.length).padStart(2, "0")} · ${local(configs[configIndex] || {})}`;
  }
  $("#configTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-config]");
    if (!b) return;
    configIndex = +b.dataset.config;
    $$("#configTabs button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$("#configStage img").forEach((im, i) => im.classList.toggle("is-on", i === configIndex));
    renderFeature();
  });

  /* ======================================================================
     Products
     ====================================================================== */
  function renderCatalog() {
    // The first card spans two columns; a card left alone on the last row spans all three.
    const lonely = (withPhotos.length + 1) % 3 === 1;
    $("#catalog").innerHTML = withPhotos.map((p, i) => {
      const src = p.photos[0];
      const n = p.photos.length;
      const keys = (p.specs || []).slice(0, 2).map(([k, v]) => `<li><span>${esc(local(k))}</span>${esc(local(v))}</li>`).join("");
      return `
      <li class="card reveal${i === 0 ? " card--wide" : ""}${lonely && i === withPhotos.length - 1 ? " card--wide card--full" : ""}">
        <button type="button" class="card__media${isRender(src) ? " card__media--render" : ""}" data-gallery="${p.id}" aria-label="${esc(local(p))}: ${n} ${esc(t("photos"))}">
          ${img(src, "", i === 0 || (lonely && i === withPhotos.length - 1) ? "(max-width: 960px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw")}
          <span class="card__count">${ICON.photos}${n}</span>
        </button>
        <div class="card__body">
          <p class="card__cat">${esc(local(C.categories[p.cat]))}</p>
          <h3 class="card__title">${esc(local(p))}</h3>
          <p class="card__text">${esc(local(p.d))}</p>
          <ul class="card__keys">${keys}</ul>
          <div class="card__actions">
            <button type="button" class="card__cta" data-quote="${p.id}">${esc(t("request"))}${ICON.arrow}</button>
            <button type="button" class="card__more" data-gallery="${p.id}">${esc(t("details"))}${ICON.plus}</button>
          </div>
        </div>
      </li>`;
    }).join("");
    $("#moreList").innerHTML = C.products.filter((p) => !(p.photos || []).length).map((p) => `
      <li>
        <div><h4>${esc(local(p))}</h4><p>${esc(local(p.d))}</p></div>
        <button type="button" class="card__cta" data-quote="${p.id}">${esc(t("request"))}${ICON.arrow}</button>
      </li>`).join("");
    observe($("#catalog"));
  }

  function quote(id) {
    selectProduct(id);
    $("#offer").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quote]");
    if (q) { if (viewer.open) viewer.close(); quote(q.dataset.quote); return; }
    const g = e.target.closest("[data-gallery]");
    if (g) openViewer(g.dataset.gallery);
  });

  /* ======================================================================
     Product viewer
     ====================================================================== */
  const viewer = $("#viewer");
  let vProduct = null, vIndex = 0;
  function openViewer(id, index = 0) {
    const p = C.products.find((x) => x.id === id);
    if (!p || !(p.photos || []).length) return;
    vProduct = p;
    $("#viewerCat").textContent = local(C.categories[p.cat]);
    $("#viewerTitle").textContent = local(p);
    $("#viewerText").textContent = local(p.d);
    $("#viewerSpecs").innerHTML = specList(p.specs);
    $("#viewerQuote").dataset.quote = p.id;
    $("#viewerThumbs").innerHTML = p.photos.map((src, i) =>
      `<button type="button" data-thumb="${i}" class="${isRender(src) ? "is-render" : ""}" aria-label="${i + 1} / ${p.photos.length}"><img src="${esc(small(src))}" alt="" loading="lazy" /></button>`).join("");
    const multi = p.photos.length > 1;
    $("#viewerPrev").hidden = $("#viewerNext").hidden = $("#viewerThumbs").hidden = !multi;
    showPhoto(index);
    if (typeof viewer.showModal === "function") viewer.showModal(); else viewer.setAttribute("open", "");
    document.body.classList.add("viewer-open");
  }
  function showPhoto(i) {
    const photos = vProduct.photos;
    vIndex = (i + photos.length) % photos.length;
    const src = photos[vIndex];
    const box = $("#viewerImg");
    box.classList.toggle("is-render", isRender(src));
    box.innerHTML = `<img src="${esc(small(src))}" srcset="${esc(srcset(src))}" sizes="(max-width: 1080px) 100vw, 60vw" alt="${esc(local(vProduct))} · ${vIndex + 1}/${photos.length}" decoding="async" />`;
    $$("#viewerThumbs button").forEach((b, j) => b.setAttribute("aria-current", String(j === vIndex)));
  }
  $("#viewerPrev").addEventListener("click", () => showPhoto(vIndex - 1));
  $("#viewerNext").addEventListener("click", () => showPhoto(vIndex + 1));
  $("#viewerThumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-thumb]"); if (b) showPhoto(+b.dataset.thumb); });
  $("#viewerClose").addEventListener("click", () => viewer.close());
  viewer.addEventListener("close", () => document.body.classList.remove("viewer-open"));
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPhoto(vIndex - 1);
    if (e.key === "ArrowRight") showPhoto(vIndex + 1);
  });

  /* ======================================================================
     Closures, certificates, story
     ====================================================================== */
  function renderClosures() {
    const list = (C.closures || []).filter((c) => c.img);
    $("#closures").hidden = !list.length;
    $("#closureGrid").innerHTML = list.map((c, i) => `
      <li class="tile reveal" style="transition-delay:${i * 70}ms">
        ${img(c.img, local(c), i === 0 ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 640px) 100vw, 33vw")}
        <div class="tile__cap"><span class="tile__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(local(c))}</h3>
          ${c.product ? `<button type="button" class="tile__link" data-gallery="${c.product}">${esc(t("details"))}${ICON.arrow}</button>` : ""}</div>
      </li>`).join("");
    observe($("#closureGrid"));
  }

  function renderCerts() {
    $("#certs").innerHTML = (C.certificates || []).map((c, i) => `
      <li class="cert reveal" style="transition-delay:${i * 60}ms">
        <span class="cert__issuer">${esc(c.issuer)}</span>
        <b class="cert__code">${esc(c.code)}</b>
        <span class="cert__label">${esc(local(c))}</span>
        <svg class="cert__seal" viewBox="0 0 48 48" aria-hidden="true"><use href="#badge"/></svg>
      </li>`).join("");
    $("#certHolder").textContent = fill(t("holder"), { name: C.legalName, address: C.address, city: C.city });
    observe($("#certs"));
  }

  function renderStory() {
    const s = C.story || {};
    $("#storyNum").textContent = C.years;
    if (s.collage) lazyBg($("#storyNum"), fit(s.collage));
    $(".story__num").classList.toggle("has-photo", !!s.collage);
    const photos = [[s.factory, t("factory")], [s.team, t("team")]].filter(([src]) => src);
    $("#storyPhotos").innerHTML = photos.map(([src, label]) =>
      `<figure class="reveal">${img(src, label, "(max-width: 1080px) 50vw, 25vw")}<figcaption>${esc(label)}</figcaption></figure>`).join("");
    observe($("#storyPhotos"));
  }

  /* ======================================================================
     Quote builder
     ====================================================================== */
  const offer = {
    product: C.products[0].id,
    w: C.products[0].w[2],
    d: C.products[0].dpt[2],
    color: C.colors[0].id,
    fabric: C.fabrics[0].id,
    drive: (C.products[0].drives || [])[0] || "",
    extras: new Set(),
    no: String(Math.floor(1000 + Math.random() * 9000))
  };
  const prod = () => C.products.find((p) => p.id === offer.product) || C.products[0];

  function selectProduct(id) {
    const p = C.products.find((x) => x.id === id);
    if (!p) return;
    offer.product = id;
    offer.w = p.w[2];
    offer.d = p.dpt[2];
    if (!(p.drives || []).includes(offer.drive)) offer.drive = (p.drives || [])[0] || "";
    offer.extras = new Set([...offer.extras].filter((x) => (p.extras || []).includes(x)));
    $("#sStamp").classList.remove("is-on");
    renderOffer();
  }

  const swatch = (group, o, on) =>
    `<button type="button" class="swatch${o.stripe ? " swatch--stripe" : ""}" data-${group}="${o.id}" aria-pressed="${on}" style="--c:${o.hex}">
      <i aria-hidden="true"></i><span>${esc(local(o))}</span>${group === "color" && o.id !== "wood" ? `<small>RAL ${o.id}</small>` : ""}</button>`;

  function renderOffer() {
    const p = prod();
    const tile = (x) => {
      const src = x.photos[0];
      return `<button type="button" class="pick__item" data-product="${x.id}" aria-pressed="${x.id === p.id}">
        <img src="${esc(small(src))}" alt="" loading="lazy" class="${isRender(src) ? "is-render" : ""}" /><span>${esc(local(x))}</span></button>`;
    };
    const pill = (x) => `<button type="button" class="pick__pill" data-product="${x.id}" aria-pressed="${x.id === p.id}">${esc(local(x))}</button>`;
    $("#pickProduct").innerHTML = `<div class="pick__tiles">${withPhotos.map(tile).join("")}</div>
      <div class="pick__pills">${C.products.filter((x) => !(x.photos || []).length).map(pill).join("")}</div>`;

    const W = $("#dimW"), D = $("#dimD");
    [W.min, W.max] = [p.w[0], p.w[1]];
    [D.min, D.max] = [p.dpt[0], p.dpt[1]];
    W.value = offer.w;
    D.value = offer.d;
    $("#dimDWrap").hidden = !!p.square;
    $("label[for=dimW]").textContent = p.square ? t("size") : t("width");
    $("#dimDLabel").textContent = p.h ? t("height") : t("depth");

    $("#pickColor").innerHTML = C.colors.map((c) => swatch("color", c, c.id === offer.color)).join("");
    $("#fabricWrap").hidden = !p.fabric;
    $("#pickFabric").innerHTML = C.fabrics.map((f) => swatch("fabric", f, f.id === offer.fabric)).join("");
    const drives = p.drives || [];
    $("#driveWrap").hidden = !drives.length;
    $("#pickDrive").innerHTML = drives.map((d) =>
      `<button type="button" data-drive="${d}" aria-pressed="${d === offer.drive}">${esc(local(C.drives[d]))}</button>`).join("");
    const extras = p.extras || [];
    $("#extrasWrap").hidden = !extras.length;
    $("#pickExtras").innerHTML = extras.map((x) =>
      `<button type="button" class="chip" data-extra="${x}" aria-pressed="${offer.extras.has(x)}">${esc(local(C.extras[x]))}</button>`).join("");

    renderSheet();
  }

  function sizeText() {
    const p = prod();
    const d = p.square ? offer.w : offer.d;
    return `${offer.w.toFixed(2)} × ${d.toFixed(2)} m`;
  }
  function colorText() {
    const c = C.colors.find((x) => x.id === offer.color);
    return c.id === "wood" ? local(c) : `RAL ${c.id} · ${local(c)}`;
  }

  function renderSheet() {
    const p = prod();
    if (p.square) offer.d = offer.w;
    $("#dimWOut").textContent = `${offer.w.toFixed(2)} m`;
    $("#dimDOut").textContent = `${offer.d.toFixed(2)} m`;

    const color = C.colors.find((x) => x.id === offer.color);
    const fabric = p.fabric ? C.fabrics.find((x) => x.id === offer.fabric) : null;
    $("#plan").innerHTML = DRAW.plan({
      product: p, w: offer.w, d: offer.d, color, fabric, extras: offer.extras,
      labels: { wall: t("wall") }
    });
    const elev = DRAW.isElevation(p);
    $("#planView").textContent = fill(t(elev ? "frontView" : "planView"), { s: DRAW.scale({ product: p, w: offer.w, d: offer.d }) });

    $("#sNo").textContent = `LN-${offer.no}`;
    $("#sProduct").textContent = local(p);
    $("#sSize").textContent = sizeText();
    $("#sArea").textContent = `${(offer.w * offer.d).toFixed(2)} m²`;
    $("#sColor").innerHTML = `<i class="dot" style="--c:${color.hex}"></i>${esc(colorText())}${fabric ? ` <span class="sep">/</span> <i class="dot${fabric.stripe ? " dot--stripe" : ""}" style="--c:${fabric.hex}"></i>${esc(local(fabric))}` : ""}`;
    $("#sDriveRow").hidden = !(p.drives || []).length;
    $("#sDrive").textContent = offer.drive ? local(C.drives[offer.drive]) : "–";
    $("#sExtras").textContent = offer.extras.size ? [...offer.extras].map((x) => local(C.extras[x])).join(", ") : t("noExtras");
    const name = $("#fName").value.trim(), where = $("#fPlace").value.trim();
    $("#sClient").textContent = [name, where].filter(Boolean).join(", ") || "–";
    const now = new Date();
    $("#sDate").textContent = `${now.getDate()} ${t("months")[now.getMonth()]} ${now.getFullYear()}`;

    $("#submitLabel").textContent = waNumber ? t("sendWa") : C.email ? t("sendEmail") : t("copy");
    $("#formFine").textContent = waNumber ? t("fineWa") : C.email ? fill(t("fineEmail"), { email: C.email }) : t("fineNone");
    const alt = [];
    if (waNumber && C.email) alt.push(`<a class="btn btn--line" href="mailto:${esc(C.email)}" data-send="email">${ICON.mail}<span>${esc(t("sendEmail"))}</span></a>`);
    if (viberNumber) alt.push(`<a class="btn btn--line" href="viber://chat?number=%2B${viberNumber}">Viber</a>`);
    alt.push(`<button type="button" class="btn btn--line" id="copyBtn">${ICON.copy}<span>${esc(t("copy"))}</span></button>`);
    if (phones[0]) alt.push(`<a class="btn btn--line" href="${tel(phones[0])}">${ICON.phone}<span>${esc(t("callUs"))}</span></a>`);
    $("#offerAlt").innerHTML = alt.join("");
  }

  $("#offerForm").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-product],button[data-color],button[data-fabric],button[data-drive],button[data-extra]");
    if (!b) return;
    const d = b.dataset;
    $("#sStamp").classList.remove("is-on");
    if (d.product) return selectProduct(d.product);
    if (d.color) offer.color = d.color;
    if (d.fabric) offer.fabric = d.fabric;
    if (d.drive) offer.drive = d.drive;
    if (d.extra) offer.extras.has(d.extra) ? offer.extras.delete(d.extra) : offer.extras.add(d.extra);
    if (d.extra) b.setAttribute("aria-pressed", String(offer.extras.has(d.extra)));
    else $$("button", b.parentElement).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderSheet();
  });
  $("#dimW").addEventListener("input", (e) => { offer.w = +e.target.value; renderSheet(); });
  $("#dimD").addEventListener("input", (e) => { offer.d = +e.target.value; renderSheet(); });
  ["#fName", "#fPlace"].forEach((id) => $(id).addEventListener("input", renderSheet));

  function message() {
    const p = prod();
    const fabric = p.fabric ? C.fabrics.find((x) => x.id === offer.fabric) : null;
    const lines = [
      t("msgHead"), "",
      `${t("msgProduct")}: ${local(p)}`,
      `${t("msgSize")}: ${sizeText()}`,
      `${t("msgArea")}: ${(offer.w * offer.d).toFixed(2)} m²`,
      `${t("msgColor")}: ${colorText()}`
    ];
    if (fabric) lines.push(`${t("msgFabric")}: ${local(fabric)}`);
    if (offer.drive) lines.push(`${t("msgDrive")}: ${local(C.drives[offer.drive])}`);
    if (offer.extras.size) lines.push(`${t("msgExtras")}: ${[...offer.extras].map((x) => local(C.extras[x])).join(", ")}`);
    lines.push("", `${t("msgName")}: ${$("#fName").value.trim()}`, `${t("msgPhone")}: ${$("#fPhone").value.trim()}`);
    const where = $("#fPlace").value.trim(), note = $("#fNote").value.trim();
    if (where) lines.push(`${t("msgPlace")}: ${where}`);
    if (note) lines.push(`${t("msgNote")}: ${note}`);
    lines.push("", `${t("msgRef")} LN-${offer.no}`);
    return lines.join("\n");
  }

  function validate() {
    const err = $("#formError");
    const name = $("#fName"), phone = $("#fPhone");
    let problem = "";
    if (!name.value.trim()) problem = "needName";
    else if (phone.value.replace(/\D/g, "").length < 6) problem = "needPhone";
    name.setAttribute("aria-invalid", String(problem === "needName"));
    phone.setAttribute("aria-invalid", String(problem === "needPhone"));
    err.hidden = !problem;
    if (problem) {
      err.textContent = t(problem);
      (problem === "needName" ? name : phone).focus();
    }
    return !problem;
  }

  async function copyMessage() {
    try { await navigator.clipboard.writeText(message()); toast(t("copied")); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = message();
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(t("copied")); } catch { /* nothing more to try */ }
      ta.remove();
    }
  }

  const mailHref = () => `mailto:${C.email}?subject=${encodeURIComponent(`${local(prod())} · ${sizeText()} · LN-${offer.no}`)}&body=${encodeURIComponent(message())}`;

  $("#offerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (waNumber) window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message())}`, "_blank", "noopener");
    else if (C.email) location.href = mailHref();
    else copyMessage();
    $("#sStamp").classList.add("is-on");
    toast(t("sent"));
  });
  $("#offerAlt").addEventListener("click", (e) => {
    if (e.target.closest("#copyBtn")) { if (validate()) copyMessage(); }
    const mail = e.target.closest("[data-send=email]");
    if (mail) { e.preventDefault(); if (validate()) location.href = mailHref(); }
  });

  /* ======================================================================
     Contact, social, map
     ====================================================================== */
  const socials = Object.entries(C.social || {}).filter(([, url]) => url);
  const socialLinks = socials.map(([k, url]) =>
    `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${k[0].toUpperCase() + k.slice(1)}">${ICON.social[k] || ""}</a>`).join("");

  function renderContact() {
    const items = [];
    phones.forEach((p, i) => items.push(`<li><span class="contact__k">${ICON.phone}${i ? "" : esc(t("phone"))}</span><a href="${tel(p)}">${esc(p)}</a></li>`));
    if (C.email) items.push(`<li><span class="contact__k">${ICON.mail}${esc(t("email"))}</span><a href="mailto:${esc(C.email)}">${esc(C.email)}</a></li>`);
    if (waNumber) items.push(`<li><span class="contact__k">${ICON.wa}WhatsApp</span><a href="https://wa.me/${waNumber}" target="_blank" rel="noopener">+${esc(waNumber)} ↗</a></li>`);
    if (place) items.push(`<li><span class="contact__k">${ICON.pin}${esc(t("address"))}</span><span>${esc([place, t("country")].join(", "))}<a class="contact__dir" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}" target="_blank" rel="noopener">${esc(t("directions"))} ↗</a></span></li>`);
    if (C.hours) {
      const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const rows = order.map((k, i) => {
        const h = C.hours[k];
        return `<span>${esc(t("days")[(i + 1) % 7])}</span><span>${h ? `${h[0]}–${h[1]}` : esc(t("closed"))}</span>`;
      }).join("");
      items.push(`<li><span class="contact__k">${ICON.clock}${esc(t("hours"))}</span><span class="contact__hours">${rows}</span></li>`);
    }
    if (socials.length) items.push(`<li><span class="contact__k">${esc(t("follow"))}</span><span class="contact__social">${socialLinks}</span></li>`);
    $("#contactList").innerHTML = items.join("");
    $("#footerSocial").innerHTML = socialLinks;
    const dockCall = $("#dockCall");
    if (phones[0]) dockCall.href = tel(phones[0]);
    else dockCall.hidden = true;
  }

  const map = $("#map");
  if (mapsQuery) {
    const load = () => {
      if (map.dataset.loaded) return;
      map.dataset.loaded = "1";
      map.insertAdjacentHTML("beforeend", `<iframe title="Google Maps · ${esc(place)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=13&output=embed"></iframe>`);
    };
    if ("IntersectionObserver" in window) {
      const mo = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { load(); mo.disconnect(); } }, { rootMargin: "400px" });
      mo.observe(map);
    } else load();
  }

  /* ======================================================================
     Finale photo with a gentle parallax
     ====================================================================== */
  const finalePhoto = $(".finale__photo");
  const finaleSrc = (slides[1] || slides[0] || {}).src;
  if (finaleSrc) lazyBg(finalePhoto, fit(finaleSrc));
  function parallax() {
    if (reduceMotion) return;
    const r = finalePhoto.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    finalePhoto.style.transform = `translate3d(0, ${(p * 60).toFixed(1)}px, 0) scale(1.12)`;
  }

  /* ======================================================================
     Small things
     ====================================================================== */
  let toastTimer = 0;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-on"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove("is-on"); setTimeout(() => (el.hidden = true), 300); }, 4200);
  }

  if (finePointer && !reduceMotion) {
    document.addEventListener("pointermove", (e) => {
      const b = e.target.closest?.("[data-magnetic]");
      $$("[data-magnetic].is-pulled").forEach((x) => { if (x !== b) { x.classList.remove("is-pulled"); x.style.transform = ""; } });
      if (!b) return;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.16, dy = (e.clientY - (r.top + r.height / 2)) * 0.26;
      b.classList.add("is-pulled");
      b.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });
  }

  $("#year").textContent = String(new Date().getFullYear());
  $("#legalName").textContent = C.name;

  $$(".lang button").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  applyLang(lang);
  observe();
  onScroll();

  // The loader lifts as soon as the first hero photo is in (at most 1.2 s), never waiting for the whole page.
  let lifted = false;
  function ready() {
    if (lifted) return;
    lifted = true;
    document.body.classList.remove("is-loading");
    $("#loader").classList.add("is-done");
  }
  const started = performance.now();
  show(0).then(() => setTimeout(ready, reduceMotion ? 0 : Math.max(0, 350 - (performance.now() - started))));
  setTimeout(ready, 1200);
})();
