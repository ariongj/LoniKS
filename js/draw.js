/*
 * The scaled plan / front view that the quote builder draws as you change
 * sizes, in the style of an architect's drawing.
 */
window.DRAW = (() => {
  "use strict";

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

    out.push(`<defs><pattern id="pStripe" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#f6efe1"/><rect width="7" height="14" fill="#9b958a"/></pattern>
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

  return { plan, scale, isElevation: (p) => elevations.has(p.plan) };
})();
