/*
 * The hero terrace: a cross-section through a house wall, a bioclimatic
 * pergola, guillotine glass and a vertical screen, lit by the real sun.
 *
 * Shadows are worked out geometrically: every louvre, beam and the screen is
 * projected along the sun's rays onto the floor, and the share of floor that
 * is covered is the "shade" figure. The sun is placed using its profile
 * angle, i.e. its height as seen in the plane of the section, which is what
 * actually decides how light passes between louvres on a south-facing terrace.
 */
window.Scene = (() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const RAD = Math.PI / 180;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;

  // Geometry (scene units)
  const F = 760;                 // floor
  const WALL = 262;              // inside face of the house wall
  const FRONT = 1040;            // inside face of the front post
  const ROOF = 383;              // louvre pivot line
  const N = 14;                  // louvres
  const B0 = 288, B1 = 1032;     // first and last pivot span
  const CHORD = 60;
  const STEP = (B1 - B0) / N;
  const pivots = Array.from({ length: N }, (_, i) => B0 + STEP * (i + 0.5));
  const SCREEN_X = 1094, SCREEN_TOP = 428, SCREEN_LEN = F - 6 - SCREEN_TOP;
  const BAND = 70, SKEW = 34;    // the floor surface, drawn obliquely below the section line

  const SPEED = { pergola: 40, screen: 0.32, glass: 0.24, led: 3 };
  const LIMIT = { pergola: [0, 135], screen: [0, 1], glass: [0, 1], led: [0, 1] };

  // Sky colours by sun elevation: [elevation, top, middle, horizon]
  const SKY = [
    [-18, "#050913", "#0a1426", "#121e36"],
    [-6,  "#0d1830", "#283457", "#5d5272"],
    [0,   "#24396a", "#a4675f", "#f0a463"],
    [6,   "#35659f", "#86abd0", "#f3c792"],
    [15,  "#2c69ab", "#71a7d7", "#bfe0f2"],
    [45,  "#225fa6", "#5c9dd5", "#b2dbf3"]
  ];
  const RAIN_SKY = ["#46505b", "#69737e", "#949da6"];

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => {
    const A = hex(a), B = hex(b);
    return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join("");
  };
  function skyAt(e) {
    if (e <= SKY[0][0]) return SKY[0].slice(1);
    for (let i = 1; i < SKY.length; i++) {
      if (e <= SKY[i][0]) {
        const k = (e - SKY[i - 1][0]) / (SKY[i][0] - SKY[i - 1][0]);
        return [1, 2, 3].map((j) => mix(SKY[i - 1][j], SKY[i][j], k));
      }
    }
    return SKY[SKY.length - 1].slice(1);
  }

  // Random but stable
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function markup() {
    const blades = pivots.map((x, i) =>
      `<rect class="sc-blade" data-i="${i}" x="${-CHORD / 2}" y="-4.5" width="${CHORD}" height="9" rx="4.5" transform="translate(${x.toFixed(1)} ${ROOF})"/>`).join("");

    const stars = Array.from({ length: 70 }, () =>
      `<circle cx="${(rnd() * 3600 - 1200).toFixed(0)}" cy="${(rnd() * 1300 - 1100).toFixed(0)}" r="${(rnd() * 1.6 + .6).toFixed(1)}"/>`).join("");

    const drops = (n, x0, x1, y0) => Array.from({ length: n }, () => {
      const x = (x0 + rnd() * (x1 - x0)).toFixed(0);
      const y = (y0 - rnd() * 300).toFixed(0);
      return `<line class="sc-drop" x1="${x}" y1="${y}" x2="${x - 5}" y2="${+y + 26}" style="animation-delay:-${(rnd() * 1.2).toFixed(2)}s;animation-duration:${(.75 + rnd() * .4).toFixed(2)}s"/>`;
    }).join("");

    const cloud = (x, y, s, cls) => `<g class="${cls}" transform="translate(${x} ${y}) scale(${s})"><path d="M0 40a40 40 0 0 1 58-36 56 56 0 0 1 104 8 38 38 0 0 1 48 28z"/></g>`;

    return `
<defs>
  <linearGradient id="scSky" gradientUnits="userSpaceOnUse" x1="0" y1="-900" x2="0" y2="${F}">
    <stop offset="0" id="scSky0"/><stop offset=".62" id="scSky1"/><stop offset="1" id="scSky2"/>
  </linearGradient>
  <radialGradient id="scSunGlow"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9"/><stop offset=".25" stop-color="#ffd27a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <linearGradient id="scEarth" gradientUnits="userSpaceOnUse" x1="0" y1="${F}" x2="0" y2="${F + 420}"><stop offset="0" stop-color="#6a5844"/><stop offset="1" stop-color="#2b251f"/></linearGradient>
  <linearGradient id="scLed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".75"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></linearGradient>
  <pattern id="scHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#22272b"/><path d="M0 0v10" stroke="#3a4147" stroke-width="2"/></pattern>
  <clipPath id="scEnv"><rect x="${WALL}" y="404" width="${FRONT - WALL}" height="${F - 404}"/></clipPath>
  <clipPath id="scGlassClip"><rect x="1000" y="406" width="60" height="${F - 4 - 406}"/></clipPath>
  <clipPath id="scRainOut"><path clip-rule="evenodd" d="M${WALL} -3000H5000V${F}H${WALL}Z M${WALL} 404V${F}H${FRONT + 28}V404Z"/></clipPath>
  <clipPath id="scRainIn"><rect x="${WALL}" y="404" width="${FRONT - WALL}" height="${F - 404}"/></clipPath>
  <filter id="scDim" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feComponentTransfer><feFuncR id="scDimR" type="linear" slope="1"/><feFuncG id="scDimG" type="linear" slope="1"/><feFuncB id="scDimB" type="linear" slope="1"/></feComponentTransfer>
  </filter>
</defs>

<rect x="-3000" y="-3000" width="7000" height="${3000 + F}" fill="url(#scSky)"/>
<g id="scStars" class="sc-stars">${stars}</g>
<g id="scMoon" transform="translate(1250 120)"><circle r="26" fill="#f1ead8"/><circle cx="11" cy="-7" r="23" fill="#0d1830" id="scMoonCut"/></g>
<g id="scSun"><circle r="150" fill="url(#scSunGlow)"/><circle r="34" id="scSunDisc" fill="#fff1c4"/></g>
<g class="sc-clouds" id="scClouds">
  ${cloud(1180, 60, 1.1, "sc-cloud sc-cloud--a")}${cloud(520, -60, .8, "sc-cloud sc-cloud--b")}${cloud(-200, 20, 1.3, "sc-cloud sc-cloud--a")}
</g>
<g id="scStorm" class="sc-storm" opacity="0">
  ${cloud(200, -140, 3.2, "sc-cloud")}${cloud(900, -120, 3.6, "sc-cloud")}${cloud(1500, -150, 3, "sc-cloud")}
</g>

<g id="scFg">
  <path class="sc-hill sc-hill--far" d="M-3000 640 C-1800 560 -900 610 -200 590 C400 560 800 600 1240 572 C1600 548 2200 590 4000 600 V${F + 10} H-3000Z"/>
  <path class="sc-hill sc-hill--near" d="M-3000 700 C-800 660 600 690 1150 676 C1500 664 1900 690 4000 680 V${F + 10} H-3000Z"/>

  <g class="sc-tree" transform="translate(1385 0)">
    <path class="sc-trunk" d="M-9 ${F} L-6 600 L6 600 L9 ${F}Z M-4 640 L-40 590 M3 620 L36 572"/>
    <circle class="sc-leaf" cx="-46" cy="560" r="62"/><circle class="sc-leaf sc-leaf--b" cx="34" cy="540" r="70"/><circle class="sc-leaf" cx="-4" cy="480" r="74"/>
  </g>
  <g class="sc-hedge"><rect x="1170" y="712" width="120" height="48" rx="24"/><rect x="1480" y="704" width="160" height="56" rx="28"/></g>

  <rect class="sc-ground" x="-3000" y="${F}" width="7000" height="800"/>
  <path class="sc-deck" d="M${WALL} ${F}H1120L${1120 - SKEW} ${F + BAND}H${WALL - SKEW}Z"/>
  <path class="sc-grass" d="M1120 ${F}H4000V${F + BAND}H${1120 - SKEW}Z"/>
  <path class="sc-deck-lines" d="${Array.from({ length: 6 }, (_, i) => `M${WALL - SKEW * (i + 1) / 7} ${F + BAND * (i + 1) / 7}H${1120 - SKEW * (i + 1) / 7}`).join("")}"/>
  <path id="scLit" class="sc-lit"/>
  <path id="scShadow" class="sc-shadow"/>

  <!-- House: a tall dark facade, cut through at the terrace wall -->
  <rect class="sc-house" x="-3000" y="-3000" width="${3000 + WALL}" height="${3000 + F}"/>
  <path class="sc-house-lines" d="${Array.from({ length: 40 }, (_, i) => `M-3000 ${F - 38 - i * 38}H222`).join("")}"/>
  <rect x="222" y="-3000" width="40" height="${3000 + F}" fill="url(#scHatch)"/>
  <rect class="sc-slab" x="-3000" y="${F}" width="${3000 + 1120}" height="14"/>

  <!-- Furniture -->
  <g class="sc-furn">
    <path d="M332 760l14-48h110l22-46 10 5-22 49v40h-8v-28H352l-10 28z"/>
    <path class="sc-cushion" d="M348 708h108l20-42 6 3-21 45H346z"/>
    <path d="M598 668h168v8H598zM678 676h8v80h-8zM650 756h64v4h-64z"/>
    <path d="M548 760l4-56h36l-2-62h8l2 62 2 56h-7l-2-48h-32l-4 48z"/>
    <path d="M818 760l-4-56h-36l2-62h-8l-2 62-2 56h7l2-48h32l4 48z"/>
    <path class="sc-pot" d="M944 712h56l-8 48h-40z"/>
    <path class="sc-plant" d="M972 712c-22-30-36-46-30-80 18 18 26 38 30 80zm0 0c4-44 14-70 34-92 4 38-12 62-34 92zm0 0c-4-34-2-60 6-86 14 30 10 56-6 86z"/>
  </g>

  <!-- Pergola -->
  <rect class="sc-frame-far" x="${WALL}" y="362" width="${FRONT + 26 - WALL}" height="42"/>
  <rect class="sc-post" x="${FRONT}" y="404" width="26" height="${F - 404}"/>
  <path id="scShafts" class="sc-shafts" clip-path="url(#scEnv)"/>
  <g id="scBlades">${blades}</g>
  <rect class="sc-alu" x="${WALL}" y="356" width="28" height="52" rx="2"/>
  <rect class="sc-alu" x="1032" y="352" width="52" height="56" rx="3"/>
  <path class="sc-alu-hi" d="M1036 356h44"/>

  <g clip-path="url(#scGlassClip)">
    <rect class="sc-glass" id="scGlassC" x="1018" y="650" width="7" height="120"/>
    <rect class="sc-glass" id="scGlassB" x="1026" y="650" width="7" height="120"/>
    <rect class="sc-glass sc-glass--fixed" x="1034" y="650" width="7" height="106"/>
  </g>
  <rect class="sc-alu" x="1016" y="754" width="28" height="6"/>

  <rect class="sc-alu" x="1084" y="408" width="22" height="22" rx="3"/>
  <rect id="scFabric" class="sc-fabric" x="${SCREEN_X - 2}" y="${SCREEN_TOP}" width="5" height="0"/>
  <rect id="scBar" class="sc-alu" x="${SCREEN_X - 6}" y="${SCREEN_TOP}" width="13" height="6" rx="2"/>
</g>

<!-- Lights that should not be dimmed at night -->
<path id="scLedCone" d="M290 408H1030L1052 ${F}H${WALL}Z" fill="url(#scLed)" opacity="0"/>
<path id="scLedStrip" class="sc-led" d="M290 407H1030" opacity="0"/>

<g id="scRain" class="sc-rain" opacity="0">
  <g clip-path="url(#scRainOut)">${drops(120, WALL, 2000, 0)}</g>
  <g id="scRainIn" clip-path="url(#scRainIn)">${drops(36, WALL, FRONT, 300)}</g>
</g>`;
  }

  function create(host, opts) {
    const cfg = Object.assign({ lat: 42.433, lon: 21.04, facing: 180, timezone: "Europe/Belgrade" }, opts);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "sc");
    svg.setAttribute("preserveAspectRatio", "xMidYMax slice");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = markup();
    host.appendChild(svg);

    const $ = (id) => svg.querySelector("#" + id);
    const el = {
      sky: [$("scSky0"), $("scSky1"), $("scSky2")],
      stars: $("scStars"), moon: $("scMoon"), moonCut: $("scMoonCut"), sun: $("scSun"), sunDisc: $("scSunDisc"),
      clouds: $("scClouds"), storm: $("scStorm"),
      fg: $("scFg"), dim: [$("scDimR"), $("scDimG"), $("scDimB")],
      lit: $("scLit"), shadow: $("scShadow"), shafts: $("scShafts"),
      blades: Array.from(svg.querySelectorAll(".sc-blade")),
      glassB: $("scGlassB"), glassC: $("scGlassC"), fabric: $("scFabric"), bar: $("scBar"),
      ledCone: $("scLedCone"), ledStrip: $("scLedStrip"),
      rain: $("scRain"), rainIn: $("scRainIn")
    };

    const today = SUN.partsIn(new Date(), cfg.timezone);
    const state = {
      ch: {
        pergola: { pos: 0, target: 0 },
        screen:  { pos: 0, target: 0 },
        glass:   { pos: 0, target: 0 },
        led:     { pos: 0, target: 0 }
      },
      minutes: today.min,
      rain: false, rainAmt: 0,
      auto: false,
      sun: null, info: null
    };
    const listeners = [];
    let raf = 0, last = 0, view = { x: 0, y: 0, w: 1600, h: 900 };

    /* ---------- Sun ---------- */
    function computeSun() {
      const when = SUN.instant(today.y, today.m, today.d, state.minutes, cfg.timezone);
      const { elevation, azimuth } = SUN.position(when, cfg.lat, cfg.lon);
      const rel = (azimuth - cfg.facing) * RAD;
      const front = Math.cos(rel) > 0.03;
      const profile = Math.atan2(Math.tan(Math.max(elevation, 0.1) * RAD), Math.abs(Math.cos(rel))) / RAD;
      state.sun = { elevation, azimuth, profile, front, up: elevation > 0.5 };
    }

    /* ---------- Shadows ---------- */
    function bladeEnds(x, deg) {
      const a = deg * RAD, ux = Math.cos(a) * CHORD / 2, uy = -Math.sin(a) * CHORD / 2;
      return [[x - ux, ROOF - uy], [x + ux, ROOF + uy]];
    }
    // Floor x where a point lands when pushed along the sun's rays.
    const toFloor = (p, cot) => p[0] - (F - p[1]) * cot;

    function occluders(louvre, screen, roofOnly) {
      const shapes = pivots.map((x) => bladeEnds(x, louvre));
      shapes.push([[1032, 352], [1084, 352], [1032, 408], [1084, 408]]);       // front beam
      shapes.push([[WALL, 356], [WALL + 28, 408]]);                              // wall beam
      // Everything here runs the full width of the terrace; the corner posts don't, so they cast no band.
      if (!roofOnly) {
        shapes.push([[1084, 408], [1106, 430]]);                                 // screen box
        if (screen > 0.005) shapes.push([[SCREEN_X, SCREEN_TOP], [SCREEN_X, SCREEN_TOP + SCREEN_LEN * screen]]);
        shapes.push([[-3000, 190], [300, 190], [300, 230]]);                     // roof of the house
      }
      return shapes;
    }

    function shadowIntervals(louvre, screen, cot, roofOnly) {
      const iv = occluders(louvre, screen, roofOnly).map((pts) => {
        const xs = pts.map((p) => toFloor(p, cot));
        return [Math.min(...xs), Math.max(...xs)];
      }).sort((a, b) => a[0] - b[0]);
      const out = [];
      for (const [a, b] of iv) {
        if (out.length && a <= out[out.length - 1][1] + 0.5) out[out.length - 1][1] = Math.max(out[out.length - 1][1], b);
        else out.push([a, b]);
      }
      return out;
    }

    const covered = (iv, a, b) => iv.reduce((s, [x, y]) => s + Math.max(0, Math.min(y, b) - Math.max(x, a)), 0);

    function shadeFor(louvre, screen, cot) {
      return covered(shadowIntervals(louvre, screen, cot, false), WALL, FRONT) / (FRONT - WALL);
    }

    // Widest louvre opening that still keeps the direct sun off the floor under the roof.
    function bestAngle() {
      const s = state.sun;
      if (state.rain) return 0;
      if (!s.up || !s.front) return 90;
      const cot = 1 / Math.tan(Math.max(s.profile, 2) * RAD);
      const end = Math.min(FRONT, FRONT - (F - ROOF) * cot);   // floor the roof can shade at all
      if (end <= WALL + 4) return 90;
      let best = 0, bestCover = -1;
      const order = Array.from({ length: 136 }, (_, i) => i).sort((a, b) => Math.abs(a - 90) - Math.abs(b - 90));
      for (const deg of order) {
        const c = covered(shadowIntervals(deg, 0, cot, true), WALL, end) / (end - WALL);
        if (c >= 0.995) return deg;
        if (c > bestCover + 1e-3) { bestCover = c; best = deg; }
      }
      return best;
    }

    /* ---------- Drawing ---------- */
    const band = (a, b) => `M${a.toFixed(1)} ${F}H${b.toFixed(1)}L${(b - SKEW).toFixed(1)} ${F + BAND}H${(a - SKEW).toFixed(1)}Z`;

    function render() {
      const s = state.sun;
      const louvre = state.ch.pergola.pos, screen = state.ch.screen.pos, glass = state.ch.glass.pos, led = state.ch.led.pos;
      const rain = state.rainAmt;

      // Sky
      const sky = skyAt(s.elevation).map((c, i) => mix(c, s.elevation < -4 ? mix(RAIN_SKY[i], "#0b1220", .7) : RAIN_SKY[i], rain * .85));
      el.sky.forEach((st, i) => st.setAttribute("stop-color", sky[i]));
      const night = clamp((6 - s.elevation) / 12, 0, 1);
      el.stars.setAttribute("opacity", (clamp((-s.elevation - 2) / 6, 0, 1) * (1 - rain)).toFixed(2));
      el.moon.setAttribute("opacity", (clamp((-s.elevation - 1) / 5, 0, 1) * (1 - rain)).toFixed(2));
      el.moonCut.setAttribute("fill", sky[0]);
      el.clouds.setAttribute("opacity", ((1 - night * .6) * .55 * (1 - rain)).toFixed(2));
      el.storm.setAttribute("opacity", rain.toFixed(2));

      // Sun on an arc around the terrace, within whatever part of the sky is in view
      const R = clamp(F - view.y - 90, 260, 640);
      const ang = (s.front ? s.profile : 180 - s.profile) * RAD;
      const sx = 700 + Math.cos(ang) * R, sy = F - Math.sin(ang) * R;
      el.sun.setAttribute("transform", `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`);
      el.sun.setAttribute("opacity", (clamp(s.elevation / 2 + 0.6, 0, 1) * (1 - rain * .9)).toFixed(2));
      el.sunDisc.setAttribute("fill", mix("#ff9a3c", "#fff4cf", clamp(s.elevation / 25, 0, 1)));

      // Night dimming of everything on the ground
      const dimK = clamp(night * (1 - rain * .2) + rain * .25, 0, 1);
      if (dimK < 0.01) el.fg.removeAttribute("filter");
      else {
        el.fg.setAttribute("filter", "url(#scDim)");
        [1 - dimK * .7, 1 - dimK * .64, 1 - dimK * .48].forEach((v, i) => el.dim[i].setAttribute("slope", v.toFixed(3)));
      }

      // Moving parts
      el.blades.forEach((b, i) => b.setAttribute("transform", `translate(${pivots[i].toFixed(1)} ${ROOF}) rotate(${(-louvre).toFixed(2)})`));
      el.glassB.setAttribute("y", (650 - 120 * glass).toFixed(1));
      el.glassC.setAttribute("y", (650 - 240 * glass).toFixed(1));
      el.fabric.setAttribute("height", (SCREEN_LEN * screen).toFixed(1));
      el.bar.setAttribute("y", (SCREEN_TOP + SCREEN_LEN * screen).toFixed(1));
      el.ledCone.setAttribute("opacity", (led * (.25 + night * .75)).toFixed(2));
      el.ledStrip.setAttribute("opacity", (led * (.5 + night * .5)).toFixed(2));

      // Rain gets in only through open louvres
      el.rain.setAttribute("opacity", rain.toFixed(2));
      el.rainIn.setAttribute("opacity", clamp(louvre / 70, 0, 1).toFixed(2));

      // Light and shade
      const direct = s.up && s.front && rain < 0.5;
      let shade = 1;
      if (direct) {
        const cot = 1 / Math.tan(Math.max(s.profile, 2) * RAD);
        const iv = shadowIntervals(louvre, screen, cot, false);
        shade = covered(iv, WALL, FRONT) / (FRONT - WALL);
        const shadows = iv.map(([a, b]) => [Math.max(a, WALL), Math.min(b, 2400)]).filter(([a, b]) => b - a > .5);
        el.shadow.setAttribute("d", shadows.map(([a, b]) => band(a, b)).join(""));

        // lit gaps under the roof, and the light shafts that reach them
        const lit = [];
        let x = WALL;
        for (const [a, b] of iv) {
          if (a > x && x < FRONT) lit.push([x, Math.min(a, FRONT)]);
          x = Math.max(x, b);
        }
        if (x < FRONT) lit.push([x, FRONT]);
        const gaps = lit.filter(([a, b]) => b - a > .8);
        el.lit.setAttribute("d", gaps.map(([a, b]) => band(a, b)).join(""));
        const H = 1400, k = H * cot;
        el.shafts.setAttribute("d", gaps.map(([a, b]) =>
          `M${a.toFixed(1)} ${F}H${b.toFixed(1)}L${(b + k).toFixed(1)} ${F - H}H${(a + k).toFixed(1)}Z`).join(""));
        const strength = clamp(s.elevation / 10, 0, 1);
        el.shafts.setAttribute("opacity", (.55 * strength).toFixed(2));
        el.lit.setAttribute("opacity", (.9 * strength).toFixed(2));
        el.shadow.setAttribute("opacity", (.9 * strength + .1).toFixed(2));
      } else {
        el.shadow.setAttribute("d", "");
        el.lit.setAttribute("d", "");
        el.shafts.setAttribute("d", "");
      }

      state.info = {
        shade, direct, night: !s.up, behind: s.up && !s.front, rain: state.rain,
        elevation: s.elevation, minutes: state.minutes, auto: state.auto,
        pergola: louvre, screen, glass, led
      };
      listeners.forEach((fn) => fn(state.info));
    }

    /* ---------- Motors ---------- */
    function tick(now) {
      // The first frame's timestamp can be a touch earlier than when the motor started.
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      let moving = false;
      for (const [k, c] of Object.entries(state.ch)) {
        if (c.pos !== c.target) {
          const d = SPEED[k] * dt;
          c.pos = Math.abs(c.target - c.pos) <= d ? c.target : c.pos + Math.sign(c.target - c.pos) * d;
          moving = true;
        }
      }
      const rt = state.rain ? 1 : 0;
      if (state.rainAmt !== rt) {
        const d = 1.4 * dt;
        state.rainAmt = Math.abs(rt - state.rainAmt) <= d ? rt : state.rainAmt + Math.sign(rt - state.rainAmt) * d;
        moving = true;
      }
      render();
      raf = moving ? requestAnimationFrame(tick) : 0;
    }
    function kick() {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }

    function setTarget(ch, v) {
      const [a, b] = LIMIT[ch];
      state.ch[ch].target = clamp(v, a, b);
      if (opts.reduceMotion) state.ch[ch].pos = state.ch[ch].target;
      kick();
    }
    function moveTo(ch, end) { setTarget(ch, LIMIT[ch][end ? 1 : 0]); }
    function stop(ch) { state.ch[ch].target = state.ch[ch].pos; kick(); }

    // Like a sun sensor: lower the screen just far enough to finish the shade the louvres can't give.
    function bestScreen(louvre) {
      const s = state.sun;
      if (state.rain || !s.up || !s.front) return 0;
      const cot = 1 / Math.tan(Math.max(s.profile, 2) * RAD);
      for (let k = 0; k <= 20; k++) if (shadeFor(louvre, k / 20, cot) >= 0.97) return k / 20;
      return 1;
    }
    function follow() {
      const a = bestAngle();
      setTarget("pergola", a);
      setTarget("screen", bestScreen(a));
    }

    function setAuto(on) {
      state.auto = on;
      if (on) follow();
      kick();
    }
    function setRain(on) {
      state.rain = on;
      if (on) { setTarget("pergola", 0); setTarget("glass", 1); }
      else if (state.auto) follow();
      if (opts.reduceMotion) state.rainAmt = on ? 1 : 0;
      kick();
    }
    function setTime(min) {
      state.minutes = min;
      computeSun();
      if (state.auto && !state.rain) follow();
      kick();
    }

    /* ---------- Framing ---------- */
    function frame() {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const A = r.width / r.height;
      const wide = matchMedia("(min-width: 961px)").matches;
      const x = wide ? -660 : 150, w = wide ? 2240 : 1060;
      const h = w / A;
      view = { x, y: wide ? F - h * 0.7 : F + 140 - h, w, h };
      svg.setAttribute("viewBox", `${x} ${view.y.toFixed(1)} ${w} ${h.toFixed(1)}`);
      render();
    }
    new ResizeObserver(frame).observe(host);

    computeSun();
    frame();

    return {
      state,
      onUpdate(fn) { listeners.push(fn); if (state.info) fn(state.info); },
      setTarget, moveTo, stop, setAuto, setRain, setTime,
      nowMinutes: () => SUN.partsIn(new Date(), cfg.timezone).min,
      limit: (ch) => LIMIT[ch]
    };
  }

  return { create };
})();
