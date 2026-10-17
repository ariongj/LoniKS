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
  const fmtMin = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.round(m) % 60).padStart(2, "0")}`;

  const ICON = {
    phone: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
    wa: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/></svg>',
    pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    copy: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    ig: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z"/></svg>',
    arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    diag: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>'
  };

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
    splitManifesto();
    renderAll();
  }

  function renderAll() {
    $$(".js-city").forEach((el) => (el.textContent = [C.city, t("country")].filter(Boolean).join(", ")));
    renderTabs();
    renderCatalog();
    renderOffer();
    renderContact();
    renderRemote();
    if (scene && scene.state.info) onScene(scene.state.info, true);
    renderSunChip();
  }

  /* ======================================================================
     Header, menu, progress
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

  const awningFill = $("#awningFill");
  const dock = $("#dock");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle("is-scrolled", y > 20);
      awningFill.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      const heroEnd = $(".hero").offsetHeight * 0.7;
      const offerTop = $("#offer").getBoundingClientRect();
      dock.classList.toggle("is-on", y > heroEnd && !(offerTop.top < innerHeight && offerTop.bottom > innerHeight * .4));
      lightManifesto();
      turnFinale();
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  // The ticker runs faster while the page is scrolling.
  const tickerAnim = () => $("#ticker").getAnimations?.()[0];
  let lastY = scrollY, boost = 0;
  if (!reduceMotion) {
    (function loop() {
      const dy = Math.abs(scrollY - lastY);
      lastY = scrollY;
      boost = boost * 0.9 + Math.min(dy, 80) * 0.06;
      const a = tickerAnim();
      if (a) a.playbackRate = 1 + boost;
      requestAnimationFrame(loop);
    })();
  }

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
    const text = lang === "sq" ? manifesto.dataset.sq ?? manifesto.textContent : EN["about.text"];
    if (manifesto.dataset.sq === undefined) manifesto.dataset.sq = manifesto.textContent;
    manifesto.innerHTML = text.split(/\s+/).map((w) => `<span>${esc(w)}</span>`).join(" ");
    lightManifesto();
  }
  function lightManifesto() {
    const words = manifesto.children;
    if (!words.length) return;
    const r = manifesto.getBoundingClientRect();
    const p = reduceMotion ? 1 : clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1);
    const n = Math.round(p * words.length);
    for (let i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n);
  }

  /* ======================================================================
     Hero scene and remote control
     ====================================================================== */
  const CHANNELS = ["pergola", "screen", "glass", "led"];
  let chIndex = 0;
  let scene = null;
  let timeTouched = false;
  const sceneHost = $("#scene");

  try {
    scene = Scene.create(sceneHost, Object.assign({}, C.scene, { timezone: C.timezone, reduceMotion }));
  } catch (err) {
    console.error(err);
    sceneHost.classList.add("is-broken");
  }

  const ch = () => CHANNELS[chIndex];
  const toRange = (c, v) => c === "pergola" ? Math.round(v / 135 * 100) : Math.round(v * 100);
  const fromRange = (c, v) => c === "pergola" ? v / 100 * 135 : v / 100;
  function valueText(c, v) {
    if (c === "pergola") return `${Math.round(v)}°`;
    if (c === "led") return v > 0.5 ? t("on") : t("off");
    return `${Math.round(v * 100)}%`;
  }

  function renderRemote() {
    if (!scene) return;
    const c = ch();
    $("#chName").textContent = t("ch")[c];
    $("#chDots").innerHTML = CHANNELS.map((_, i) => `<i class="${i === chIndex ? "on" : ""}"></i>`).join("");
    const pos = scene.state.ch[c].pos;
    $("#chVal").textContent = valueText(c, pos);
    const range = $("#chRange");
    range.step = c === "led" ? 100 : 1;
    if (document.activeElement !== range) range.value = toRange(c, c === "led" ? scene.state.ch[c].target : pos);
    range.setAttribute("aria-label", t("ch")[c]);
    range.setAttribute("aria-valuetext", valueText(c, pos));
  }

  const flash = () => {
    const led = $("#remoteLed");
    led.classList.remove("is-on");
    void led.offsetWidth;
    led.classList.add("is-on");
  };
  function manual(c) {
    if ((c === "pergola" || c === "screen") && scene.state.auto) { scene.setAuto(false); $("#autoBtn").setAttribute("aria-pressed", "false"); }
  }
  function press(dir) {
    if (!scene) return;
    const c = ch();
    const s = scene.state.ch[c];
    flash();
    manual(c);
    if (dir === 0) return scene.stop(c);
    if (c === "pergola") {
      if (dir > 0) scene.setTarget(c, s.pos < 89.5 ? 90 : 135);
      else scene.setTarget(c, s.pos > 90.5 ? 90 : 0);
    } else if (c === "screen") scene.moveTo(c, dir < 0);
    else scene.moveTo(c, dir > 0);
  }
  $("#keyUp").addEventListener("click", () => press(1));
  $("#keyDown").addEventListener("click", () => press(-1));
  $("#keyStop").addEventListener("click", () => press(0));
  $("#chPrev").addEventListener("click", () => { chIndex = (chIndex + CHANNELS.length - 1) % CHANNELS.length; flash(); renderRemote(); });
  $("#chNext").addEventListener("click", () => { chIndex = (chIndex + 1) % CHANNELS.length; flash(); renderRemote(); });
  $("#chRange").addEventListener("input", (e) => {
    if (!scene) return;
    const c = ch();
    manual(c);
    scene.setTarget(c, fromRange(c, +e.target.value));
  });

  const timeRange = $("#timeRange");
  timeRange.addEventListener("input", () => {
    timeTouched = true;
    scene && scene.setTime(+timeRange.value);
  });
  $("#nowBtn").addEventListener("click", () => {
    timeTouched = false;
    if (!scene) return;
    const now = scene.nowMinutes();
    timeRange.value = now;
    scene.setTime(now);
  });
  $("#autoBtn").addEventListener("click", (e) => {
    if (!scene) return;
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    scene.setAuto(on);
  });
  $("#rainBtn").addEventListener("click", (e) => {
    if (!scene) return;
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    scene.setRain(on);
  });

  const shown = {};
  const setText = (id, v) => { if (shown[id] !== v) { shown[id] = v; $(id).textContent = v; } };
  function onScene(info, force) {
    if (force) for (const k in shown) delete shown[k];
    setText("#rShade", info.night ? t("night") : info.rain ? t("rain") : `${Math.round(info.shade * 100)}%`);
    setText("#rSun", info.night ? "–" : `${Math.round(info.elevation)}°`);
    setText("#rTime", fmtMin(info.minutes));
    const msg = info.rain ? t("msgRain") : info.night ? t("msgNight") : info.behind ? t("msgBehind") : info.auto ? t("msgAuto") : t("msgHint");
    setText("#sceneMsg", msg);
    sceneHost.dataset.night = String(info.night);
    renderRemote();
  }

  function renderSunChip() {
    const chip = $("#sunChip");
    if (!scene) { chip.hidden = true; return; }
    const now = SUN.partsIn(new Date(), C.timezone);
    const { elevation } = SUN.position(new Date(), C.scene.lat, C.scene.lon);
    const night = elevation < 0;
    chip.dataset.state = night ? "night" : "day";
    $("span", chip).textContent = `${C.city} · ` + fill(t(night ? "chipNight" : "chipDay"), { t: fmtMin(now.min), e: Math.round(elevation) });
  }

  if (scene) {
    const now = scene.nowMinutes();
    timeRange.value = clamp(now, +timeRange.min, +timeRange.max);
    scene.setTime(now);
    scene.onUpdate((info) => onScene(info));
    setInterval(() => {
      renderSunChip();
      if (!timeTouched) { const m = scene.nowMinutes(); timeRange.value = m; scene.setTime(m); }
    }, 30000);
  }

  // A short demo once the page is in: the louvres find the sun (and the light comes on at night).
  function intro() {
    if (!scene) return;
    setTimeout(() => {
      $("#autoBtn").setAttribute("aria-pressed", "true");
      scene.setAuto(true);
      if (scene.state.sun.elevation < 2) { chIndex = 3; scene.setTarget("led", 1); }
      renderRemote();
    }, reduceMotion ? 0 : 500);
  }

  /* ======================================================================
     Products
     ====================================================================== */
  let activeCat = "all";
  function renderTabs() {
    const tabs = [["all", t("all")], ...Object.entries(C.categories).map(([k, v]) => [k, local(v)])];
    $("#productTabs").innerHTML = tabs.map(([k, label]) =>
      `<button type="button" class="tab" data-cat="${k}" aria-pressed="${k === activeCat}">${esc(label)}</button>`).join("");
  }
  $("#productTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    activeCat = b.dataset.cat;
    $$("#productTabs .tab").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$("#catalog .card").forEach((c) => (c.hidden = activeCat !== "all" && c.dataset.cat !== activeCat));
  });

  function renderCatalog() {
    $("#catalog").innerHTML = C.products.map((p, i) => `
      <li class="card reveal" data-cat="${p.cat}" ${activeCat !== "all" && p.cat !== activeCat ? "hidden" : ""}>
        <div class="card__fig">
          ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(local(p))}" loading="lazy" decoding="async" />` : DRAW.figure(p.fig)}
          <span class="card__no">${t("fig")} ${String(i + 1).padStart(2, "0")}</span>
          ${p.featured ? `<span class="card__badge">${esc(t("featured"))}</span>` : ""}
        </div>
        <div class="card__body">
          <p class="card__cat">${esc(local(C.categories[p.cat]))}</p>
          <h3 class="card__title">${esc(local(p))}</h3>
          <p class="card__text">${esc(local(p.d))}</p>
          <ul class="card__tags">${(p.tags || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <button type="button" class="card__cta" data-quote="${p.id}">${esc(t("request"))}${ICON.arrow}</button>
        </div>
      </li>`).join("");
    observe($("#catalog"));
  }
  $("#catalog").addEventListener("click", (e) => {
    const b = e.target.closest("[data-quote]");
    if (!b) return;
    selectProduct(b.dataset.quote);
    $("#offer").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

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

    $("#pickProduct").innerHTML = C.products.map((x) =>
      `<button type="button" class="pick__item" data-product="${x.id}" aria-pressed="${x.id === p.id}">${DRAW.figure(x.fig)}<span>${esc(local(x))}</span></button>`).join("");

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
    const now = SUN.partsIn(new Date(), C.timezone);
    $("#sDate").textContent = `${now.d} ${t("months")[now.m - 1]} ${now.y}`;

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
    const group = b.parentElement;
    if (d.extra) b.setAttribute("aria-pressed", String(offer.extras.has(d.extra)));
    else $$("button", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderSheet();
  });
  $("#dimW").addEventListener("input", (e) => { offer.w = +e.target.value; renderSheet(); });
  $("#dimD").addEventListener("input", (e) => { offer.d = +e.target.value; renderSheet(); });
  ["#fName", "#fPlace"].forEach((id) => $(id).addEventListener("input", renderSheet));

  function message() {
    const p = prod();
    const fabric = p.fabric ? C.fabrics.find((x) => x.id === offer.fabric) : null;
    const lines = [
      t("msgHead"),
      "",
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
     Contact & map
     ====================================================================== */
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
    const social = [];
    if (C.instagram) social.push(`<a href="https://www.instagram.com/${esc(C.instagram)}/" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>`);
    if (C.facebook) social.push(`<a href="${esc(C.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.fb}</a>`);
    if (social.length) items.push(`<li class="contact__social">${social.join("")}</li>`);
    $("#contactList").innerHTML = items.join("");
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
     Finale: louvres that turn as you scroll
     ====================================================================== */
  const finaleLouvres = $("#finaleLouvres");
  finaleLouvres.innerHTML = "<i></i>".repeat(14);
  function turnFinale() {
    const r = finaleLouvres.getBoundingClientRect();
    const p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
    finaleLouvres.style.setProperty("--turn", `${(reduceMotion ? 0.5 : p) * 90}deg`);
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
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.18, dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
      b.classList.add("is-pulled");
      b.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    });
  }

  $("#year").textContent = String(new Date().getFullYear());
  if (C.legalName) $("#legalName").textContent = C.legalName;
  if (C.since) { $("#since").hidden = false; $("#sinceYear").textContent = C.since; }

  $$(".lang button").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  applyLang(lang);
  observe();
  onScroll();

  function ready() {
    document.body.classList.remove("is-loading");
    $("#loader").classList.add("is-done");
    intro();
  }
  if (reduceMotion) ready();
  else {
    const started = performance.now();
    const go = () => setTimeout(ready, Math.max(0, 900 - (performance.now() - started)));
    if (document.readyState === "complete") go();
    else addEventListener("load", go, { once: true });
  }
})();
