# Loni Tenda

Website for [Loni Tenda](https://loni-ks.com/) ([@tenda.loni](https://www.instagram.com/tenda.loni/)), a maker of bioclimatic pergolas, glass roofs, guillotine and sliding glass, ZIP screens and awnings in Davidovc, Shtime, Kosovo. +20 years, certified ISO 9001, 14001, 45001 (TÜV AUSTRIA), factory production control 2+ (Inspecco) and CE.

A fast, single-page site with no build step and no dependencies. It is in **Albanian** by default, with an **English** toggle (the choice is remembered). All photos, renders and technical data come from Loni's 2026 catalogue.

**Live:** https://ariongj.github.io/LoniKS/

## What makes it different

- **Photos that open like louvres.** The hero shows images from Loni's catalogue (the two sharp enough for full screen; add more in `hero` once there are photos at least 1600 px wide). Each new photo is sliced into horizontal slats that turn open, the way a bioclimatic roof does. It plays on its own and can be swiped on phones. The loader opens the same way.
- **The pergola in six configurations.** Standard, double, modular and the three wall-mounted versions, using the catalogue's product renders on a studio backdrop, next to the real specs. Browse with the tabs, the arrows or a swipe.
- **Product viewer.** Every product with photos opens a gallery with its installation photos and technical renders, and the specs from the catalogue (sizes, glass, motors, fabric, warranties), plus a button that loads that product into the quote builder. Photos can be swiped on phones.
- **What it's made of.** Under the intro: aluminium, glass, fabric, and motors & LED, each with the facts from the catalogue.
- **Side closures, certificates, 20 years.** A photo grid of ZIP screens, guillotine and sliding glass and aluminium panels. Certificate cards styled after Loni's TÜV documents. A giant "20" filled with photos of their projects, as in their anniversary post.
- **Quote builder with a spec sheet.** Pick the product, width and depth (or height), RAL colour, fabric, motor (SOMFY / BECKER / manual) and extras. A scaled plan or front view draws itself with dimension lines, and a spec sheet with a reference number fills in as you go, then gets stamped when sent. The request opens in the visitor's email app addressed to `tenda@loni-ks.com`, fully written out (or in WhatsApp, if a number is set). It can also be copied.
- In Loni's brand: black, white and Loni red, the badge logo, and the "When it comes to quality" line from their own posts.

## Quality checks

- Accessibility: 0 violations in an axe-core audit (WCAG 2.1 A/AA and best practices), in both languages, on desktop and mobile. Keyboard friendly, and motion switches off for people who ask their device for reduced motion.
- Lighthouse, median of three runs on a local server set up like GitHub Pages (HTTP/2, compressed): mobile 96 performance / 100 accessibility / 100 best practices / 100 SEO, desktop 99 / 100 / 100 / 100. Mobile Core Web Vitals in the lab: LCP 2.4 s, CLS 0, TBT 96 ms; the slowest tap (switching language) answers in about 150 ms on a phone slowed 4×.
- The page paints the hero first and builds the sections below it one frame later, so the headline shows sooner on slow phones; switching language works the same way.
- Fonts (Archivo, Manrope, Instrument Serif, IBM Plex Mono; all SIL Open Font License) are served with the site from `assets/fonts/`, so nothing loads from another server except the Google Map.
- Checked at 1920, 1440, 1280, 1024, 768, 390, 360 and 320 px in both languages: no sideways scrolling, no clipped or overlapping text, no console errors. HTML validated with html-validate.
- Photos are WebP in two sizes (960 px and full) with `srcset`, and load lazily. Background photos load only when they come near the screen.
- `HomeAndConstructionBusiness` structured data with certificates and social profiles, Open Graph image `assets/og.jpg`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, app icons and a branded `404.html`.

## SEO

Built to the developer's technical SEO checklist (20 points):

- **Indexing:** no `noindex` on the page, `robots.txt` allows everything and points to `sitemap.xml`; the sitemap lists the page with its date and eight main photos for Google Images. One `canonical` URL. Only the 404 page is `noindex`.
- **Title and description:** "Pergola bioklimatike, xhama dhe tenda · Loni Tenda, Shtime" (58 characters) and a 151-character description with the products, the place and a call to action. Both switch to English with the language toggle.
- **Headings:** one H1 that says what Loni makes and where ("Pergola, xhama dhe tenda – Shtime, Kosovë. E bërë për jetën jashtë."), then H2 per section and H3 per item, with no skipped levels.
- **Sharing:** Open Graph and Twitter tags with a 1200 × 630 image and its alt text.
- **Structured data:** a JSON-LD `@graph` with the business (address, phones, email, opening hours, ISO certificates, Instagram and Facebook, the six main products) and the website.
- **Photos:** every photo has alt text (or is marked decorative), `width` and `height` from `js/image-sizes.js` so nothing jumps while loading, WebP in two sizes, lazy loading except the hero photo, which is preloaded.
- **Old addresses:** the old site's pages (`/pergola/`, `/gijot/`, `/na-kontakto/`, ...) each have a small page in a folder of the same name that sends visitors and Google straight to the matching product or section. Each product can be linked directly, e.g. `#p-pergola`.

| Old address | Goes to |
| --- | --- |
| `/pergola/` | `#p-pergola` Pergola bioklimatike |
| `/produktet/`, `/tenda/`, `/mbuloja-pishine/` | `#products` |
| `/gijot/` | `#p-gijot` Xhama gijotinë |
| `/slide/`, `/xhama-levizes/` | `#p-slide` Xhama slide |
| `/tenda-perde/` | `#p-zip` ZIP perde |
| `/tenda-mbixham/` | `#p-mbixham` Tenda mbi xham |
| `/tenda-kasete/` | `#p-kaseta` Tenda me kasetë |
| `/tenda-klasike/` | `#p-klasike` Tenda klasike |
| `/tenda-dritare/` | `#p-dritaresh` Tenda dritaresh |
| `/cadra/` | `#p-cadra` Çadra |
| `/certifikimet/` | `#quality` |
| `/na-kontakto/`, `/footer/` | `#contact` |

GitHub Pages can't send real 301 redirects, so these pages use an instant refresh with a `canonical` link, which Google treats the same way. If the site later moves to a host that supports redirects, replace them with 301s from the same table.

Left for the owner once the site is on loni-ks.com: verify the domain in **Google Search Console**, submit `sitemap.xml`, check the pages with the URL Inspection and Rich Results tests, and turn on **Enforce HTTPS** in the repository's Pages settings.

## Editing the details

Everything is in **`js/config.js`**:

| Field | What it does |
| --- | --- |
| `phones`, `email` | Call and email links, the header phone, the mobile call button, and where quote requests go |
| `whatsapp`, `viber` | Digits only, e.g. `38349206030`. With `whatsapp` set, quote requests open in WhatsApp |
| `address`, `city`, `mapsQuery` | The address, the directions link and the embedded Google Map |
| `social` | Instagram, Facebook, YouTube and LinkedIn links (hidden while empty) |
| `hours` | Opening hours per day (`null` = closed), shown in the contact section. Set to Monday–Friday 08:00–17:00 from the old site. Leave `hours: null` to hide them. If you change them, change `openingHoursSpecification` in `index.html` too |
| `hero` | The hero slides: photo and caption |
| `materials` | The four "what it's made of" items under the intro |
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

Then run `python3 tools/image-sizes.py`, which records each photo's width and height in `js/image-sizes.js` so the page keeps its space while it loads.

## Before going live

Please confirm with Loni:

- **"E bërë për jetën jashtë"** is our Albanian take on their "Made for outdoor living". Approve it or give their preferred line.
- **Aluminium 6065**: the catalogue says 6065; architectural profiles are usually 6063. Check for a typo.
- **Brand names** (SOMFY, BECKER, Sattler, Samsung LED) appear in the materials row and the specs as brands used; check they're happy to show them.
- **"Ofertë pa detyrim"** (no-obligation quote) and on-site measuring: is measuring free?
- **"Our own team"** for installation: no subcontractors?
- Frame colours (RAL 8019, wood effect) and the four fabric colours offered in the quote builder.
- **Opening hours** Monday–Friday 08:00–17:00, taken from the old site. Saturday too?

Still to add:

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
js/image-sizes.js width and height of each photo (made by tools/image-sizes.py)
js/main.js        everything else
assets/img/       photos and renders (WebP, full + 960 px)
assets/fonts/     the four typefaces (WOFF2, Latin subset)
tools/            image-sizes.py and set-domain.py
pergola/, gijot/, na-kontakto/, ...   forwarding pages for the old site's addresses
```

## Running and publishing

Open the site through any static server, e.g. `python3 -m http.server`, then visit http://localhost:8000.

It's published with GitHub Pages from the `gh-pages` branch: https://ariongj.github.io/LoniKS/. `.nojekyll` is included so files are served as-is. ### Moving to loni-ks.com

```sh
python3 tools/set-domain.py https://loni-ks.com/
```

This changes the address in the `canonical`, `og:` and structured-data tags, `robots.txt`, `sitemap.xml`, the forwarding pages and this README, makes the 404 page's links work from the domain root, and writes the `CNAME` file. Commit and push it, point the domain's DNS at GitHub Pages (four `A` records for the apex, a `CNAME` for `www` to `ariongj.github.io`), then turn on **Enforce HTTPS** in the repository's Pages settings. `robots.txt` only takes effect at the root of a domain, so it starts working at this point.
