# Loni Tenda

Website redesign for [Loni Tenda](https://loni-ks.com/) (LONI Pergola SH.P.K.), a maker of aluminium pergolas, glass systems and awnings in Davidovc, Shtime, Kosovo.

A fast, single-page site with no build step and no dependencies. It is in **Albanian** by default, with an **English** toggle (the choice is remembered).

## What makes it different

- **Run the terrace.** The hero is a live cross-section through a house wall, a bioclimatic pergola, guillotine glass and a vertical screen. A Loni remote stands next to it: switch channels (Pergola, Screen, Glass, LED) and use ▲ ■ ▼ like the real thing. Motors run at their own speeds and stop on ■.
- **The real sun over Shtime.** The sun's position is calculated for Shtime, today, in real time (or any time you drag to). Shadows are worked out geometrically: every louvre, beam and the screen is projected along the sun's rays onto the floor, light shafts fall through the gaps, and the "Shade" figure is the share of the floor actually in shade. Sun behind the house, dusk, night with stars and moon are all handled.
- **Follow the sun.** Like a Somfy sun sensor: the louvres turn to the widest angle that still keeps the direct sun off the floor, and the screen lowers just far enough to finish the job when the sun is low. On load the remote does this once by itself to show how it works (and turns the LED on if it is dark outside).
- **Rain.** Tap "Shi" and the rain sensor closes the louvres and raises the glass. Rain only gets under the roof while the louvres are open.
- **Catalogue as technical drawings.** All 12 products (pergola, glass roof, sliding and guillotine glass, seven awning types and parasols) have their own line drawing, with filters by category. "Request a quote" loads the product into the quote builder.
- **Quote builder with a spec sheet.** Pick the product, width and depth (or height), frame colour (RAL), fabric, motor (SOMFY / BECKER / manual) and extras. A scaled plan or front view draws itself with dimension lines, and a spec sheet with a reference number fills in as you go, then gets stamped when sent. The request opens in the visitor's email app addressed to `tenda@loni-ks.com`, fully written out (or in WhatsApp, if a number is set). It can also be copied.
- Smaller touches: an awning that rolls out as the scroll progress bar, a header chip with the live time and sun height in Shtime, a ticker that speeds up as you scroll, a manifesto that lights up word by word, louvres that turn as you reach the end of the page, magnetic buttons and a matching `404.html`.

The site works on phones, can be used with a keyboard, and switches the motion off for people who ask their device for reduced motion. It includes search-engine data (`HomeAndConstructionBusiness` structured data), social share tags, `assets/og.png`, `robots.txt`, `sitemap.xml` and `site.webmanifest`.

## Editing the details

Everything about the company is in **`js/config.js`**:

| Field | What it does |
| --- | --- |
| `phones`, `email` | Call and email links, the mobile call button, and where quote requests go |
| `whatsapp`, `viber` | Digits only, e.g. `38349206030`. With `whatsapp` set, quote requests open in WhatsApp |
| `address`, `city`, `mapsQuery` | The address, the directions link and the embedded Google Map |
| `hours` | Opening hours per day (`null` = closed). Leave `hours: null` to hide them |
| `instagram`, `facebook` | Social links in the contact section (hidden while empty) |
| `since` | The year shown in the about section (`null` hides it) |
| `scene` | Where the hero sun is calculated (`lat`, `lon`) and which way the terrace faces (`facing`, 180 = south) |
| `products` | The catalogue and the quote builder: name and text (sq/en), category, tags, size ranges, motors and extras. Add `photo: "assets/img/…"` to show a real photo on a card instead of the drawing |
| `colors`, `fabrics`, `drives`, `extras` | The options offered in the quote builder |

Empty fields are hidden automatically. Page text lives in `index.html` (Albanian) and `js/i18n.js` (English).

## Before going live

The content comes from the current loni-ks.com (products, descriptions, phones, email and address) and the public business register. Please check:

- **WhatsApp / Viber.** No messaging number is set, so quote requests go by email. If `+383 49 20 60 30` or `+383 44 20 60 30` is on WhatsApp, put it in `whatsapp`.
- **`since: 2016`** comes from the company's registration date in the business register. Change or remove it if Loni has been working longer.
- **Photos.** The current site's photos couldn't be downloaded, so every card uses a drawing. Add real project photos with `photo` on each product.
- **Size ranges** in the quote builder are reasonable defaults per product type, not Loni's production limits. Adjust `w` and `dpt` to what you actually build.
- The current site's footer also lists `v.asllani@loni-ks.com`. This redesign uses `tenda@loni-ks.com` everywhere.

## Files

```
index.html        page structure (Albanian text)
css/styles.css    all styling
js/config.js      company details, products, quote options
js/i18n.js        English text + runtime strings
js/sun.js         sun position for a place and time
js/scene.js       the hero terrace: drawing, shadows, motors, rain
js/draw.js        product drawings and the quote builder's plan
js/main.js        everything else
```

## Running and publishing

Open the site through any static server, e.g. `python3 -m http.server`, then visit http://localhost:8000.

**GitHub Pages:** in the repository go to Settings → Pages. Under "Build and deployment", choose "Deploy from a branch", pick the branch and the `/ (root)` folder, and save. The site appears at `https://ariongj.github.io/LoniKS/` after a minute. `.nojekyll` is included so files are served as-is. If the site moves to another address (for example loni-ks.com), update the `canonical`, `og:` and structured-data URLs at the top of `index.html`, `robots.txt`, `sitemap.xml`, and the `/LoniKS/` links in `404.html`.
