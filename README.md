# Loni Tenda

Website for [Loni Tenda](https://loni-ks.com/) ([@tenda.loni](https://www.instagram.com/tenda.loni/)), a maker of bioclimatic pergolas, glass roofs, guillotine and sliding glass, ZIP screens and awnings in Davidovc, Shtime, Kosovo. +20 years, certified ISO 9001, 14001, 45001 (TÜV AUSTRIA), factory production control 2+ (Inspecco) and CE.

A fast, single-page site with no build step and no dependencies. It is in **Albanian** by default, with an **English** toggle (the choice is remembered). All photos, renders and technical data come from Loni's 2026 catalogue.

**Live:** https://ariongj.github.io/LoniKS/

## What makes it different

- **Photos that open like louvres.** The hero shows Loni's own installations. Each new photo is sliced into horizontal slats that turn open, the way a bioclimatic roof does. It plays on its own, can be swiped on phones, and pauses while you use it. The loader opens the same way.
- **The pergola in six configurations.** Standard, double, modular and the three wall-mounted versions, using the catalogue's product renders, next to the real specs.
- **Product viewer.** Every product card opens a gallery with its installation photos, the technical render, and the specs from the catalogue (sizes, glass, motors, fabric, warranties), plus a button that loads that product into the quote builder.
- **Side closures, certificates, 20 years.** A photo grid of ZIP screens, guillotine and sliding glass and aluminium panels. Certificate cards styled after Loni's TÜV documents. A giant "20" filled with photos of their projects, as in their anniversary post.
- **Quote builder with a spec sheet.** Pick the product, width and depth (or height), RAL colour, fabric, motor (SOMFY / BECKER / manual) and extras. A scaled plan or front view draws itself with dimension lines, and a spec sheet with a reference number fills in as you go, then gets stamped when sent. The request opens in the visitor's email app addressed to `tenda@loni-ks.com`, fully written out (or in WhatsApp, if a number is set). It can also be copied.
- In Loni's brand: black, white and Loni red, the badge logo, and the "When it comes to quality" line from their own posts.

## Quality checks

- Accessibility: 0 violations in an axe-core audit (WCAG 2.1 A/AA and best practices), in both languages, on desktop and mobile. Keyboard friendly, and motion switches off for people who ask their device for reduced motion.
- Lighthouse (local server): desktop 99 performance / 100 accessibility / 100 best practices / 100 SEO; mobile 75 / 100 / 100 / 100. On GitHub Pages mobile scores higher, since files are served compressed.
- Photos are WebP in two sizes (960 px and full) with `srcset`, and load lazily. Background photos load only when they come near the screen.
- `HomeAndConstructionBusiness` structured data with certificates and social profiles, Open Graph image `assets/og.jpg`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, app icons and a branded `404.html`.

## Editing the details

Everything is in **`js/config.js`**:

| Field | What it does |
| --- | --- |
| `phones`, `email` | Call and email links, the header phone, the mobile call button, and where quote requests go |
| `whatsapp`, `viber` | Digits only, e.g. `38349206030`. With `whatsapp` set, quote requests open in WhatsApp |
| `address`, `city`, `mapsQuery` | The address, the directions link and the embedded Google Map |
| `social` | Instagram, Facebook, YouTube and LinkedIn links (hidden while empty) |
| `hours` | Opening hours per day (`null` = closed). Leave `hours: null` to hide them |
| `hero` | The hero slides: photo and caption |
| `featured` | The featured product and its configuration renders |
| `products` | The catalogue and the quote builder. With `photos` a product gets a photo card and a gallery; without, it's listed under "Edhe tenda & çadra". `specs` are the rows in the viewer |
| `closures` | The side-closure photo grid |
| `certificates` | The certificate cards |
| `story` | The collage inside the big "20", and optional `factory` and `team` photos |
| `colors`, `fabrics`, `drives`, `extras` | The options offered in the quote builder |

Page text lives in `index.html` (Albanian) and `js/i18n.js` (English).

### Adding photos

Put the photo in `assets/img/` as WebP, plus a 960 px wide copy named `name-960.webp`, then reference `assets/img/name.webp` in `js/config.js`. Any image editor can export WebP; or, with Python and Pillow:

```sh
python3 -c "
from PIL import Image; import sys
for f in sys.argv[1:]:
    im = Image.open(f).convert('RGB'); n = f.rsplit('.', 1)[0]
    im.thumbnail((1800, 1800)); im.save(n + '.webp', quality=80)
    im.thumbnail((960, 960)); im.save(n + '-960.webp', quality=78)
" assets/img/*.jpg
```

## Before going live

- **Factory and team photos.** The site has a place for them (`story.factory`, `story.team`). Add the photos from the "20 vite me ju" post.
- **Photos for the remaining awnings** (cassette, classic, window, double, parasols): add `photos` to those products and they get their own cards.
- **WhatsApp.** No messaging number is set, so quotes go by email. If one of the phones is on WhatsApp, put it in `whatsapp`.
- **Logo.** The badge in `index.html` (`#badge`) and `assets/favicon.svg` is a vector redraw of the LONI tenda logo. Swap in the official file if you have it.
- **Size ranges** in the quote builder follow the catalogue's maximums where it gives them; the minimums are sensible defaults.
- **YouTube / LinkedIn:** the posts mention them under `tenda.loni`. Add the exact URLs in `social`.

## Files

```
index.html        page structure (Albanian text)
css/styles.css    all styling
js/config.js      company details, photos, products, quote options
js/i18n.js        English text + runtime strings
js/draw.js        the quote builder's technical plan
js/main.js        everything else
assets/img/       photos and renders (WebP, full + 960 px)
```

## Running and publishing

Open the site through any static server, e.g. `python3 -m http.server`, then visit http://localhost:8000.

It's published with GitHub Pages from the `gh-pages` branch: https://ariongj.github.io/LoniKS/. `.nojekyll` is included so files are served as-is. If the site moves to another address (for example loni-ks.com), update the `canonical`, `og:` and structured-data URLs at the top of `index.html`, `robots.txt`, `sitemap.xml`, and the `/LoniKS/` links in `404.html`.
