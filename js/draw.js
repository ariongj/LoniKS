/*
 * Line drawings: a small technical figure for every product card, and the
 * scaled plan / front view that the quote builder draws as you change sizes.
 * Everything is plain SVG markup in the style of an architect's sketch.
 */
window.DRAW = (() => {
  "use strict";

  /* ======================================================================
     Product figures (viewBox 0 0 240 150)
     ====================================================================== */
  const ground = `<path class="f-ground" d="M6 134H234"/><path class="f-thin" d="${Array.from({ length: 19 }, (_, i) => `M${14 + i * 12} 134l-7 7`).join("")}"/>`;
  const wall = (x) => `<rect class="f-wall" x="${x}" y="12" width="10" height="122"/>`;
  const shade = (a, b) => `<path class="f-shade" d="M${a} 134H${b}l-10 8H${a - 10}z"/>`;
  const scallops = (x0, x1, y) => {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1 - 1; x += 8) d += `q4 5 8 0`;
    return `<path class="f-line" d="${d}"/>`;
  };
  const glassRoof = (tilt = 0) => {
    const p = [[30, 46 + tilt], [200, 62], [222, 50], [52, 34 + tilt]];
    const rafters = [0, .25, .5, .75, 1].map((t) => {
      const x = 30 + 170 * t, y = 46 + tilt + (16 - tilt) * t;
      return `M${x} ${y}l22 -12`;
    }).join("");
    return `<path class="f-glass" d="M${p.map((q) => q.join(" ")).join("L")}Z"/><path class="f-line" d="${rafters}M30 ${46 + tilt}L200 62M52 ${34 + tilt}L222 50"/>`;
  };
  const glassRoofFrame = `${wall(20)}<rect class="f-alu-back" x="216" y="50" width="5" height="72"/><rect class="f-alu" x="194" y="62" width="7" height="72"/><path class="f-alu" d="M30 46L200 62v6L30 52z"/>`;

  const FIG = {
    pergola: () => {
      const louvres = Array.from({ length: 9 }, (_, k) => {
        const t = (k + 1) / 10, x = 46 + 34 * t, y = 56 - 16 * t;
        return `<path class="f-louvre" d="M${x} ${y}h130l3 -5h-130z"/>`;
      }).join("");
      return `${shade(52, 176)}
        <rect class="f-alu-back" x="80" y="40" width="5" height="78"/><rect class="f-alu-back" x="204" y="40" width="5" height="78"/>
        <path class="f-alu-back" d="M80 36h130v6H80z"/>
        ${louvres}
        <path class="f-alu" d="M46 56l34-16v6L46 62zM176 56l34-16v6l-34 16z"/>
        <rect class="f-alu" x="46" y="56" width="130" height="8"/>
        <rect class="f-alu" x="46" y="62" width="7" height="72"/><rect class="f-alu" x="169" y="62" width="7" height="72"/>
        <path class="f-led" d="M56 66h110"/>`;
    },
    glassroof: () => `${shade(30, 196)}${glassRoofFrame}${glassRoof()}`,
    slide: () => {
      const panels = [26, 72, 118, 164].map((x, i) =>
        `<rect class="f-glass" x="${x}" y="${36 + (i % 2) * 1}" width="52" height="${92 - (i % 2) * 2}"/><path class="f-thin" d="M${x + 44} 76v12"/>`).join("");
      return `${panels}<rect class="f-alu" x="22" y="28" width="196" height="8"/><rect class="f-alu" x="22" y="128" width="196" height="6"/>
        <path class="f-arrow" d="M86 108h40m-7-5 7 5-7 5M86 108l7-5m-7 5 7 5"/>`;
    },
    gijot: () => `<rect class="f-alu" x="20" y="16" width="200" height="12" rx="2"/>
        <rect class="f-alu" x="20" y="28" width="7" height="106"/><rect class="f-alu" x="213" y="28" width="7" height="106"/>
        <rect class="f-glass f-glass--soft" x="27" y="30" width="186" height="34"/><rect class="f-glass f-glass--soft" x="27" y="64" width="186" height="34"/>
        <rect class="f-glass" x="27" y="98" width="186" height="32"/><path class="f-alu" d="M27 96h186v4H27z"/>
        <path class="f-arrow" d="M196 42v40m-5-7 5 7 5-7m-10-33 5-7 5 7"/>`,
    cassette: () => `${shade(34, 190)}${wall(20)}
        <rect class="f-alu" x="30" y="32" width="22" height="16" rx="3"/>
        <path class="f-fab" d="M50 40L204 72v8L50 48z"/>
        <rect class="f-alu" x="30" y="60" width="7" height="12"/>
        <path class="f-arm" d="M35 66L128 72L204 80"/>
        <rect class="f-alu" x="200" y="70" width="11" height="13" rx="2"/>`,
    classic: () => `${shade(34, 196)}${wall(20)}
        <circle class="f-alu" cx="40" cy="42" r="7"/>
        <path class="f-fab" d="M44 36L206 70v8L44 46z"/>
        <path class="f-fab" d="M202 70h11v16h-11z"/>${scallops(202, 214, 86)}
        <rect class="f-alu" x="30" y="60" width="7" height="12"/>
        <path class="f-arm" d="M35 66L132 70L204 78"/>`,
    window: () => `<path class="f-thin" d="M20 14H220M20 14V134M220 14V134"/>
        <rect class="f-frame" x="72" y="60" width="96" height="60"/><path class="f-thin" d="M120 60v60M72 90h96"/><rect class="f-glass f-glass--soft" x="74" y="62" width="92" height="56"/>
        <rect class="f-alu" x="64" y="122" width="112" height="5"/>
        <rect class="f-alu" x="62" y="34" width="116" height="10" rx="3"/>
        <path class="f-fab" d="M66 44H174L182 78H58z"/>${scallops(58, 182, 78)}
        <path class="f-arm" d="M68 64L60 78M172 64L180 78"/>`,
    screen: () => `${shade(40, 200)}
        <rect class="f-alu" x="28" y="30" width="184" height="14" rx="2"/>
        <rect class="f-alu" x="28" y="44" width="9" height="90"/><rect class="f-alu" x="203" y="44" width="9" height="90"/>
        <path class="f-fab" d="M38 44H202V98H38z"/>
        <path class="f-thin f-thin--fab" d="${Array.from({ length: 15 }, (_, i) => `M${48 + i * 10} 46v50`).join("")}"/>
        <rect class="f-alu" x="38" y="98" width="164" height="6"/>
        <path class="f-arrow f-arrow--on" d="M120 58v24m-6-6 6 6 6-6"/>`,
    overglass: () => `${shade(30, 196)}${glassRoofFrame}${glassRoof()}
        <path class="f-fab" d="M30 40L150 51l22-12L52 28z"/>
        <rect class="f-alu" x="24" y="22" width="22" height="12" rx="3"/>`,
    underglass: () => `${shade(30, 196)}${glassRoofFrame}
        <path class="f-fab" d="M32 54L150 65l22-12L54 42z"/>${glassRoof()}`,
    double: () => `${shade(34, 206)}
        <rect class="f-alu" x="116" y="44" width="8" height="90"/><rect class="f-alu" x="104" y="36" width="32" height="12" rx="3"/>
        <path class="f-fab" d="M108 42L26 64v7L108 49zM132 42L214 64v7L132 49z"/>
        <path class="f-arm" d="M116 76L70 72L32 70M124 76L170 72L208 70"/>
        <rect class="f-alu" x="20" y="62" width="10" height="12" rx="2"/><rect class="f-alu" x="210" y="62" width="10" height="12" rx="2"/>
        <path class="f-alu" d="M96 134h48v-4H96z"/>`,
    parasol: () => `${shade(40, 200)}
        <path class="f-fab" d="M26 66L120 26L214 66z"/>${scallops(26, 214, 66)}
        <path class="f-thin f-thin--fab" d="M120 26L58 66M120 26L90 66M120 26L150 66M120 26L182 66"/>
        <path class="f-arm" d="M120 84L66 64M120 84L174 64"/>
        <rect class="f-alu" x="117" y="20" width="6" height="114"/>
        <path class="f-alu" d="M86 134h68v-5H86z"/>`
  };

  function figure(name) {
    return `<svg class="fig" viewBox="0 0 240 150" aria-hidden="true">${ground}${(FIG[name] || FIG.pergola)()}</svg>`;
  }

  /* ======================================================================
     Quote builder sketch (viewBox 0 0 420 300)
     ====================================================================== */
  const fmt = (n) => n.toFixed(2);
  const elevations = new Set(["slide", "gijot", "screen"]);
  const walled = new Set(["louvres", "glassroof", "awning", "window"]);

  function dimH(x0, x1, y, label, cls = "") {
    return `<g class="p-dim ${cls}"><path d="M${x0} ${y - 14}V${y + 4}M${x1} ${y - 14}V${y + 4}M${x0} ${y}H${x1}M${x0 - 4} ${y + 4}l8 -8M${x1 - 4} ${y + 4}l8 -8"/>
      <text x="${(x0 + x1) / 2}" y="${y - 6}" text-anchor="middle">${label}</text></g>`;
  }
  function dimV(x, y0, y1, label) {
    return `<g class="p-dim"><path d="M${x - 4} ${y0}H${x + 14}M${x - 4} ${y1}H${x + 14}M${x} ${y0}V${y1}M${x - 4} ${y0 + 4}l8 -8M${x - 4} ${y1 + 4}l8 -8"/>
      <text x="${x + 10}" y="${(y0 + y1) / 2}" text-anchor="middle" transform="rotate(-90 ${x + 10} ${(y0 + y1) / 2})" dy="-4">${label}</text></g>`;
  }

  // o: { product, w, d, color, fabric, extras:Set, labels:{wall, view} }
  function plan(o) {
    const p = o.product;
    const elev = elevations.has(p.plan);
    const sc = Math.min(310 / o.w, (elev ? 190 : 186) / o.d);
    const W = o.w * sc, D = o.d * sc;
    const x0 = 196 - W / 2, x1 = x0 + W;
    const top = elev ? 252 - D : 52, y1 = top + D;
    const frame = o.color.hex, fab = o.fabric ? (o.fabric.stripe ? "url(#pStripe)" : o.fabric.hex) : "#e9e0cc";
    const out = [];

    out.push(`<defs><pattern id="pStripe" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#f6efe1"/><rect width="7" height="14" fill="#f2a43a"/></pattern>
      <pattern id="pHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v7" stroke="currentColor" stroke-width="1.2"/></pattern></defs>`);
    out.push(`<path class="p-grid" d="${Array.from({ length: 21 }, (_, i) => `M${i * 21} 0V300`).join("")}${Array.from({ length: 15 }, (_, i) => `M0 ${i * 21}H420`).join("")}"/>`);

    if (walled.has(p.plan)) {
      out.push(`<rect class="p-wall" x="${Math.min(x0 - 30, 40)}" y="${top - 14}" width="${Math.max(W + 60, 312)}" height="14"/>`);
      out.push(`<text class="p-note" x="${Math.min(x0 - 30, 40) + 4}" y="${top - 20}">${o.labels.wall}</text>`);
      if (p.plan === "window") out.push(`<rect class="p-opening" x="${x0 + W * .12}" y="${top - 14}" width="${W * .76}" height="14"/>`);
    }
    if (elev) out.push(`<path class="p-floor" d="M20 ${y1}H400"/><path class="p-thin" d="${Array.from({ length: 19 }, (_, i) => `M${26 + i * 20} ${y1}l-8 8`).join("")}"/>`);

    const rect = (cls, fill = "") => `<rect class="${cls}" x="${x0}" y="${top}" width="${W}" height="${D}" ${fill}/>`;

    switch (p.plan) {
      case "louvres": {
        out.push(rect("p-fill"));
        const step = Math.max(5, .2 * sc);
        let d = "";
        for (let y = top + step; y < y1 - 2; y += step) d += `M${x0 + 4} ${y.toFixed(1)}H${x1 - 4}`;
        out.push(`<path class="p-louvre" d="${d}"/>`);
        if (o.extras.has("led")) out.push(`<path class="p-led" d="M${x0 + 10} ${top + 10}H${x1 - 10}V${y1 - 10}H${x0 + 10}Z"/>`);
        break;
      }
      case "glassroof": {
        out.push(rect("p-glass"));
        const n = Math.max(2, Math.round(o.w / .9));
        let d = "";
        for (let i = 1; i < n; i++) d += `M${(x0 + W * i / n).toFixed(1)} ${top}V${y1}`;
        out.push(`<path class="p-rafter" d="${d}"/>`);
        if (p.fabric) out.push(`<rect class="p-fab ${p.id === "nenxham" ? "p-fab--under" : ""}" x="${x0 + 6}" y="${top + 4}" width="${W - 12}" height="${D - 8}" fill="${fab}"/>`);
        break;
      }
      case "awning":
      case "window": {
        out.push(`<rect class="p-fab" x="${x0}" y="${top}" width="${W}" height="${D}" fill="${fab}"/>`);
        out.push(`<path class="p-arm" d="M${x0 + 8} ${top + 2}L${x0 + W * .42} ${y1 - 4}M${x1 - 8} ${top + 2}L${x1 - W * .42} ${y1 - 4}"/>`);
        out.push(`<rect class="p-alu" x="${x0 - 4}" y="${top}" width="${W + 8}" height="7" fill="${frame}"/>`);
        out.push(`<rect class="p-alu" x="${x0 - 2}" y="${y1 - 5}" width="${W + 4}" height="6" fill="${frame}"/>`);
        out.push(`<path class="p-arrow" d="M${(x0 + x1) / 2} ${top + 16}V${y1 - 14}m-6 -7 6 7 6 -7"/>`);
        break;
      }
      case "slide": {
        const n = Math.max(2, Math.ceil(o.w / .8));
        const pw = W / n;
        for (let i = 0; i < n; i++) out.push(`<rect class="p-glass" x="${(x0 + i * pw - (i ? 3 : 0)).toFixed(1)}" y="${top + 6}" width="${(pw + (i ? 3 : 0)).toFixed(1)}" height="${D - 12}"/>`);
        out.push(`<rect class="p-alu" x="${x0}" y="${top}" width="${W}" height="6" fill="${frame}"/><rect class="p-alu" x="${x0}" y="${y1 - 6}" width="${W}" height="6" fill="${frame}"/>`);
        out.push(`<path class="p-arrow" d="M${x0 + pw * .5 - 14} ${(top + y1) / 2}h28m-7 -6 7 6 -7 6M${x0 + pw * .5 - 14} ${(top + y1) / 2}l7 -6m-7 6 7 6"/>`);
        break;
      }
      case "gijot": {
        const m = (D - 12) / 3;
        out.push(`<rect class="p-alu" x="${x0}" y="${top - 4}" width="${W}" height="10" fill="${frame}"/>`);
        for (let i = 0; i < 3; i++) out.push(`<rect class="p-glass ${i === 2 ? "p-glass--fixed" : ""}" x="${x0 + 6}" y="${(top + 6 + i * m).toFixed(1)}" width="${W - 12}" height="${m.toFixed(1)}"/>`);
        out.push(`<rect class="p-alu" x="${x0}" y="${top - 4}" width="6" height="${D + 4}" fill="${frame}"/><rect class="p-alu" x="${x1 - 6}" y="${top - 4}" width="6" height="${D + 4}" fill="${frame}"/>`);
        out.push(`<path class="p-arrow" d="M${x1 - 26} ${top + 18}v${m * 1.4}m-6 -7 6 7 6 -7m-12 ${-m * 1.4 + 7} 6 -7 6 7"/>`);
        break;
      }
      case "screen": {
        out.push(`<rect class="p-fab" x="${x0 + 6}" y="${top + 10}" width="${W - 12}" height="${D * .72}" fill="${fab}"/>`);
        out.push(`<rect class="p-alu" x="${x0}" y="${top}" width="${W}" height="10" fill="${frame}"/>`);
        out.push(`<rect class="p-alu" x="${x0}" y="${top}" width="6" height="${D}" fill="${frame}"/><rect class="p-alu" x="${x1 - 6}" y="${top}" width="6" height="${D}" fill="${frame}"/>`);
        out.push(`<rect class="p-alu" x="${x0 + 6}" y="${top + 10 + D * .72}" width="${W - 12}" height="5" fill="${frame}"/>`);
        out.push(`<path class="p-arrow" d="M${(x0 + x1) / 2} ${top + 22}v${D * .36}m-6 -7 6 7 6 -7"/>`);
        break;
      }
      case "double": {
        const mid = (top + y1) / 2;
        out.push(`<rect class="p-fab" x="${x0}" y="${top}" width="${W}" height="${D}" fill="${fab}"/>`);
        out.push(`<rect class="p-alu" x="${x0 - 4}" y="${mid - 4}" width="${W + 8}" height="8" fill="${frame}"/>`);
        out.push(`<rect class="p-alu" x="${x0}" y="${top}" width="${W}" height="5" fill="${frame}"/><rect class="p-alu" x="${x0}" y="${y1 - 5}" width="${W}" height="5" fill="${frame}"/>`);
        out.push(`<path class="p-arrow" d="M${(x0 + x1) / 2} ${mid - 10}V${top + 14}m-6 7 6 -7 6 7M${(x0 + x1) / 2} ${mid + 10}V${y1 - 14}m-6 -7 6 7 6 -7"/>`);
        break;
      }
      case "parasol": {
        const cx = (x0 + x1) / 2, cy = (top + y1) / 2;
        out.push(`<rect class="p-fab" x="${x0}" y="${top}" width="${W}" height="${D}" fill="${fab}"/>`);
        out.push(`<path class="p-rib" d="M${x0} ${top}L${x1} ${y1}M${x1} ${top}L${x0} ${y1}M${cx} ${top}V${y1}M${x0} ${cy}H${x1}"/>`);
        out.push(`<circle class="p-alu" cx="${cx}" cy="${cy}" r="7" fill="${frame}"/>`);
        break;
      }
    }

    // frame outline: a dark keyline under the chosen colour, so white still shows
    if (["louvres", "glassroof"].includes(p.plan)) {
      out.push(`<rect class="p-key" x="${x0}" y="${top}" width="${W}" height="${D}"/><rect class="p-frame" x="${x0}" y="${top}" width="${W}" height="${D}" stroke="${frame}"/>`);
      const post = (x, y) => `<rect class="p-post" x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${frame}"/>`;
      out.push(post(x0 + 6, y1 - 6) + post(x1 - 6, y1 - 6));
      if (o.extras.has("side")) out.push(`<path class="p-side" d="M${x0} ${top}V${y1}M${x1} ${top}V${y1}" stroke="${fab}"/>`);
      if (o.extras.has("glass")) out.push(`<path class="p-sideglass" d="M${x0 - 5} ${top}V${y1}M${x1 + 5} ${top}V${y1}"/>`);
    } else {
      out.push(`<rect class="p-key p-key--soft" x="${x0}" y="${top}" width="${W}" height="${D}"/>`);
    }

    out.push(dimH(x0, x1, elev ? Math.min(y1 + 30, 292) : y1 + 30, `${fmt(o.w)} m`));
    out.push(dimV(x1 + 26, top, y1, `${fmt(o.d)} m`));
    return out.join("");
  }

  // The drawing always fills the sheet, so its scale changes with the size, as on a real drawing.
  function scale(o) {
    const sc = Math.min(310 / o.w, (elevations.has(o.product.plan) ? 190 : 186) / o.d);
    const real = 4000 / sc;   // one unit is drawn at about 0.25 mm
    return [20, 25, 50, 75, 100, 125, 150, 200].find((r) => r >= real) || 200;
  }

  return { figure, plan, scale, isElevation: (p) => elevations.has(p.plan) };
})();
