/*
 * Loni Tenda: all company details live here.
 * Edit this file to change contact info, photos, products and the quote builder.
 * Fields left empty ("" or []) are hidden on the site automatically.
 *
 * Photos: put files in assets/img/ and reference them here. Landscape photos
 * of about 2000 px wide work best for the hero; 1400 px is plenty elsewhere.
 */
window.LONI = {
  name: "Loni Tenda",
  legalName: "N.T.SH. \"LONI\"",
  years: 20,                // shown as "+20 vite"
  partners: ["SOMFY", "BECKER", "SATTLER", "SAMSUNG LED"],

  // Contact. Leave empty to hide. WhatsApp/Viber: digits only with country code, e.g. "38349206030".
  phones: ["+383 49 20 60 30", "+383 44 20 60 30"],
  email: "tenda@loni-ks.com",
  whatsapp: "",             // e.g. "38349206030"; with it set, quote requests can go to WhatsApp
  viber: "",
  address: "Rr. Ibrahim Rugova Nr. 962, Davidovc",
  city: "Shtime",
  mapsQuery: "Loni Tenda, Davidovc, Shtime, Kosovo",
  social: {
    instagram: "https://www.instagram.com/tenda.loni/",
    facebook: "https://www.facebook.com/tenda.loni",
    youtube: "",            // e.g. "https://www.youtube.com/@tenda.loni"
    linkedin: ""
  },

  // Opening hours in local time. null = closed that day. Set `hours: null` to hide them.
  timezone: "Europe/Belgrade",
  hours: null,
  // hours: { mon: ["08:00", "17:00"], tue: ["08:00", "17:00"], wed: ["08:00", "17:00"],
  //          thu: ["08:00", "17:00"], fri: ["08:00", "17:00"], sat: ["08:00", "14:00"], sun: null },

  // Hero slides: each photo opens through louvres. Wide photos of 1600 px or more look best.
  hero: [
    { src: "assets/img/bioklimatike.webp",  sq: "Pergola bioklimatike", en: "Bioclimatic pergola" },
    { src: "assets/img/mbuloje-xhami.webp", sq: "Mbulojë xhami",        en: "Glass roof" },
    { src: "assets/img/gijotine-1.webp",    sq: "Xhama gijotinë",       en: "Guillotine glass" },
    { src: "assets/img/slide-3.webp",       sq: "Xhama slide",          en: "Sliding glass" }
  ],

  // The featured product: its configurations, each with a render.
  featured: {
    product: "pergola",
    name: "Skylux Dual",
    configs: [
      { img: "assets/img/pergola-standard.webp",         sq: "Standard",           en: "Standard" },
      { img: "assets/img/pergola-dyshe.webp",            sq: "Dyshe",              en: "Double" },
      { img: "assets/img/pergola-modulare.webp",         sq: "Modulare",           en: "Modular" },
      { img: "assets/img/pergola-e-varur.webp",          sq: "E varur",            en: "Wall-mounted" },
      { img: "assets/img/pergola-dyshe-e-varur.webp",    sq: "Dyshe e varur",      en: "Double, wall-mounted" },
      { img: "assets/img/pergola-modulare-e-varur.webp", sq: "Modulare e varur",   en: "Modular, wall-mounted" }
    ]
  },

  // Side closures (the catalogue's "Format e mbylljeve anësore").
  closures: [
    { img: "assets/img/mbyllje-zip.webp",      sq: "ZIP perde",      en: "ZIP screens",      product: "zip" },
    { img: "assets/img/mbyllje-gijotine.webp", sq: "Xhama gijotinë", en: "Guillotine glass", product: "gijot" },
    { img: "assets/img/mbyllje-slide.webp",    sq: "Xhama slide",    en: "Sliding glass",    product: "slide" },
    { img: "assets/img/mbyllje-alumin.webp",   sq: "Fleta alumini",  en: "Aluminium panels", product: "" }
  ],

  // "20 years with you": the photo shown inside the big number, plus optional factory and team photos.
  story: {
    collage: "assets/img/collage.webp",
    factory: "",            // e.g. "assets/img/fabrika.webp"
    team: ""                // e.g. "assets/img/ekipi.webp"
  },

  // Certificates (from Loni's TÜV AUSTRIA, Inspecco and CE documents).
  certificates: [
    { code: "ISO 9001:2015",  issuer: "TÜV AUSTRIA", sq: "Sistemi i menaxhimit të cilësisë",             en: "Quality management system" },
    { code: "ISO 14001:2015", issuer: "TÜV AUSTRIA", sq: "Sistemi i menaxhimit mjedisor",                en: "Environmental management system" },
    { code: "ISO 45001:2018", issuer: "TÜV AUSTRIA", sq: "Shëndeti dhe siguria në punë",                 en: "Occupational health and safety" },
    { code: "FPC 2+",         issuer: "Inspecco",    sq: "Kontrolli i prodhimit në fabrikë, sistemi 2+", en: "Factory production control, system 2+" },
    { code: "CE",             issuer: "EU",          sq: "Deklarata konformiteti për pergolat dhe sistemet e xhamit", en: "Declarations of conformity for pergolas and glazing" }
  ],

  categories: {
    pergola:  { sq: "Pergola & çati", en: "Pergolas & roofs" },
    glass:    { sq: "Xhama",          en: "Glass" },
    awning:   { sq: "Tenda",          en: "Awnings" },
    parasol:  { sq: "Çadra",          en: "Parasols" }
  },

  // Products. With `photos` a product gets a photo card and a gallery; without, it's listed below them.
  // `specs` come from Loni's 2026 catalogue. `plan` picks how the quote builder draws it.
  // w / dpt: [min, max, default] in metres for the quote builder. `h: true` means the second size is a height.
  products: [
    { id: "pergola", cat: "pergola", plan: "louvres",
      photos: ["assets/img/bioklimatike.webp", "assets/img/pergola-dyshe.webp", "assets/img/pergola-modulare-e-varur.webp"],
      sq: "Pergola bioklimatike", en: "Bioclimatic pergola",
      d: { sq: "Strukturë tërësisht prej alumini me ngjyrosje elektrostatike. Lamelat rrotullohen me telekomandë: hapi për ajër e dritë, mbylli për hije dhe shi.",
           en: "A fully aluminium structure with electrostatic powder coating. The louvres turn by remote: open them for air and light, close them for shade and rain." },
      specs: [
        [{ sq: "Struktura", en: "Structure" }, { sq: "Alumin 6065, ngjyrosje me pluhur", en: "6065 aluminium, powder-coated" }],
        [{ sq: "Lamelat", en: "Louvres" }, { sq: "Rrotullohen me telekomandë", en: "Turn by remote" }],
        [{ sq: "Motori", en: "Motor" }, "SOMFY / BECKER"],
        [{ sq: "Ndriçimi", en: "Lighting" }, "LED"],
        [{ sq: "Konfigurime", en: "Configurations" }, { sq: "Standard, dyshe, modulare, e varur", en: "Standard, double, modular, wall-mounted" }]
      ],
      w: [2, 7, 4], dpt: [2, 6, 3], drives: ["somfy", "becker"], extras: ["led", "rain", "wind", "side", "glass", "heater"] },

    { id: "mbuloja", cat: "pergola", plan: "glassroof",
      photos: ["assets/img/mbuloje-xhami.webp", "assets/img/mbuloje-xhami-render.webp", "assets/img/xham-standard-mur.webp", "assets/img/xham-dyshe.webp", "assets/img/xham-veteqendrim.webp", "assets/img/xham-forma-l.webp", "assets/img/xham-standard.webp"],
      sq: "Mbulojë xhami", en: "Glass roof",
      d: { sq: "Strukturë elegante për çdo stinë, me konstruksion alumini të klasit të parë dhe xham sigurie që mbron nga moti. Drenazhi është i integruar, për komoditet dhe dritë natyrale gjatë gjithë vitit.",
           en: "An elegant structure for every season, with first-class aluminium and safety glass that keeps the weather out. Drainage is built in, for comfort and natural light all year round." },
      specs: [
        [{ sq: "Xhami", en: "Glass" }, { sq: "Laminat sigurie 4+4 ose 5+5", en: "Laminated safety glass, 4+4 or 5+5" }],
        [{ sq: "Gjerësia", en: "Width" }, { sq: "Pa limit", en: "No limit" }],
        [{ sq: "Shtrirja", en: "Projection" }, "max 400 cm"],
        [{ sq: "Ndriçimi", en: "Lighting" }, "LED Samsung"],
        [{ sq: "Drenazhi", en: "Drainage" }, { sq: "I fshehur, i integruar", en: "Hidden, built in" }],
        [{ sq: "Garancioni", en: "Warranty" }, { sq: "2 vite", en: "2 years" }]
      ],
      w: [2, 8, 4], dpt: [2, 4, 3], drives: [], extras: ["led", "side", "glass", "heater"] },

    { id: "gijot", cat: "glass", plan: "gijot",
      photos: ["assets/img/gijotine-1.webp", "assets/img/gijotine-2.webp", "assets/img/gijotine-render.webp"],
      sq: "Xhama gijotinë Premium", en: "Guillotine glass Premium",
      d: { sq: "Sistem tërësisht prej alumini, me profile të trasha, që lëviz lart e poshtë me telekomandë. Izolon, i reziston motit dhe i jep ambientit ndjesinë e luksit.",
           en: "An all-aluminium system with heavy profiles that moves up and down by remote. It insulates, stands up to the weather and gives the space a sense of luxury." },
      specs: [
        [{ sq: "Përmasat", en: "Size" }, "max 400 × 400 cm"],
        [{ sq: "Xhami", en: "Glass" }, { sq: "4+4 sigurie / 4+14+4 termopan", en: "4+4 safety / 4+14+4 double glazing" }],
        [{ sq: "Motori", en: "Motor" }, "BECKER, made in Germany"],
        [{ sq: "Operimi", en: "Operation" }, { sq: "Automatik, me telekomandë", en: "Automatic, by remote" }],
        [{ sq: "Struktura", en: "Structure" }, { sq: "Alumin 6065, RAL 7016", en: "6065 aluminium, RAL 7016" }]
      ],
      w: [2, 4, 3.5], dpt: [1.5, 4, 2.4], h: true, drives: ["becker", "somfy"], extras: ["led"] },

    { id: "slide", cat: "glass", plan: "slide",
      photos: ["assets/img/slide-1.webp", "assets/img/slide-2.webp", "assets/img/slide-3.webp", "assets/img/slide-4.webp", "assets/img/slide-render.webp"],
      sq: "Xhama slide Premium", en: "Sliding glass Premium",
      d: { sq: "Xhama rrëshqitës me profile të shumëfishta që izolojnë. Doreza elegante me kyç, lëvizje e qetë mbi rrota alumini: për shtëpi, restorante dhe terasa të nivelit të lartë.",
           en: "Sliding glass with multi-chamber profiles that insulate. Elegant handles with a key lock and smooth travel on aluminium wheels: for homes, restaurants and high-end terraces." },
      specs: [
        [{ sq: "Përmasat", en: "Size" }, "max 400 × 300 cm"],
        [{ sq: "Xhami", en: "Glass" }, { sq: "4+4 sigurie / termopan 22 mm", en: "4+4 safety / 22 mm double glazing" }],
        [{ sq: "Dorezat", en: "Handles" }, { sq: "Me kyçje me çelës", en: "With key lock" }],
        [{ sq: "Shinat", en: "Tracks" }, { sq: "Rrota alumini", en: "Aluminium wheels" }],
        [{ sq: "Struktura", en: "Structure" }, { sq: "Alumin 6065, RAL 7016", en: "6065 aluminium, RAL 7016" }]
      ],
      w: [2, 10, 4], dpt: [1.8, 3, 2.2], h: true, drives: [], extras: [] },

    { id: "zip", cat: "awning", plan: "screen", fabric: true,
      photos: ["assets/img/zip-3.webp", "assets/img/zip-1.webp", "assets/img/zip-2.webp", "assets/img/zip-4.webp", "assets/img/zip-render.webp"],
      sq: "ZIP perde", en: "ZIP screens",
      d: { sq: "Mbrojtje automatike nga dielli dhe era, me pamje moderne. Rrjeta lëviz vertikalisht nëpër profilet anësore, e qetë dhe me telekomandë.",
           en: "Automatic protection from sun and wind with a modern look. The screen runs vertically in side channels, quietly and by remote." },
      specs: [
        [{ sq: "Përmasat", en: "Size" }, "max 500 × 350 cm"],
        [{ sq: "Shtofi", en: "Fabric" }, "Sattler"],
        [{ sq: "Mbron nga", en: "Keeps out" }, { sq: "Dielli, era, insektet; privatësi", en: "Sun, wind, insects; privacy" }],
        [{ sq: "Opsionale", en: "Optional" }, { sq: "Sensor ere", en: "Wind sensor" }],
        [{ sq: "Garancioni", en: "Warranty" }, { sq: "2 vite sistemi, 5 vite shtofi", en: "2 years system, 5 years fabric" }]
      ],
      w: [1, 5, 3], dpt: [1.5, 3.5, 2.5], h: true, drives: ["somfy", "becker"], extras: ["wind"] },

    { id: "mbixham", cat: "awning", plan: "glassroof", fabric: true,
      photos: ["assets/img/tenda-mbi-xham-render.webp"],
      sq: "Tenda mbi xham", en: "Glass-roof awning",
      d: { sq: "Hijezim modern për çati xhami apo tavane të hapura, montuar sipër ose nën xham. Kontrollohet lehtë me telekomandë, zgjat shumë dhe kërkon pak mirëmbajtje.",
           en: "Modern shading for glass roofs or open ceilings, mounted above or below the glass. Easy to run by remote, long-lasting and low-maintenance." },
      specs: [
        [{ sq: "Shtofi", en: "Fabric" }, "Sattler"],
        [{ sq: "Operimi", en: "Operation" }, { sq: "Manual / automatik", en: "Manual / automatic" }],
        [{ sq: "Montimi", en: "Mounting" }, { sq: "Sipër ose nën xham", en: "Above or below the glass" }],
        [{ sq: "Opsionale", en: "Optional" }, { sq: "Motor, sensor ere", en: "Motor, wind sensor" }],
        [{ sq: "Garancioni", en: "Warranty" }, { sq: "2 vite sistemi, 5 vite shtofi", en: "2 years system, 5 years fabric" }]
      ],
      w: [2, 7, 4], dpt: [2, 6, 3.5], drives: ["manual", "somfy", "becker"], extras: ["wind", "sun"] },

    { id: "kaseta", cat: "awning", plan: "awning", fabric: true,
      sq: "Tenda me kasetë", en: "Cassette awning",
      d: { sq: "Pëlhura dhe krahët mbyllen plotësisht brenda një kasete alumini, të mbrojtura nga shiu dhe pluhuri.",
           en: "The fabric and arms fold fully into an aluminium cassette, protected from rain and dust." },
      w: [2, 7, 4], dpt: [1.5, 4, 3], drives: ["manual", "somfy", "becker"], extras: ["led", "wind", "sun"] },

    { id: "klasike", cat: "awning", plan: "awning", fabric: true,
      sq: "Tenda klasike", en: "Classic awning",
      d: { sq: "Hapet me krahë të fuqishëm alumini me tension, me komandim manual ose automatik.",
           en: "Opens on strong tensioned aluminium arms, with manual or automatic control." },
      w: [2, 6, 3.5], dpt: [1.5, 3.5, 2.5], drives: ["manual", "somfy", "becker"], extras: ["wind", "sun"] },

    { id: "dritaresh", cat: "awning", plan: "window", fabric: true,
      sq: "Tenda dritaresh", en: "Window awning",
      d: { sq: "Hije për dritare dhe ballkone, që e mban diellin jashtë dhomës.",
           en: "Shade for windows and balconies that keeps the sun out of the room." },
      w: [0.8, 4, 1.6], dpt: [0.6, 1.5, 1], drives: ["manual", "somfy"], extras: ["sun"] },

    { id: "dyshe", cat: "awning", plan: "double", fabric: true,
      sq: "Tenda e dyfishtë", en: "Double awning",
      d: { sq: "Dy tenda nga një strukturë qendrore, për oborre, kafene dhe hapësira të mëdha.",
           en: "Two awnings from one central structure, for gardens, cafés and large spaces." },
      w: [3, 8, 5], dpt: [3, 8, 5], drives: ["manual", "somfy", "becker"], extras: ["led", "wind"] },

    { id: "cadra", cat: "parasol", plan: "parasol", fabric: true,
      sq: "Çadra", en: "Parasols",
      d: { sq: "Çadra të mëdha për oborre, restorante dhe kafene, me strukturë të qëndrueshme.",
           en: "Large parasols for gardens, restaurants and cafés, with a sturdy frame." },
      w: [2.5, 6, 4], dpt: [2.5, 6, 4], square: true, drives: ["manual"], extras: ["led", "heater"] }
  ],

  drives: {
    manual: { sq: "Manual", en: "Manual" },
    somfy:  { sq: "Motor SOMFY", en: "SOMFY motor" },
    becker: { sq: "Motor BECKER", en: "BECKER motor" }
  },

  extras: {
    led:    { sq: "Ndriçim LED",     en: "LED lighting" },
    rain:   { sq: "Sensor shiu",     en: "Rain sensor" },
    wind:   { sq: "Sensor ere",      en: "Wind sensor" },
    sun:    { sq: "Sensor dielli",   en: "Sun sensor" },
    side:   { sq: "Tenda anësore",   en: "Side screens" },
    glass:  { sq: "Xhama anësorë",   en: "Side glass" },
    heater: { sq: "Ngrohës",         en: "Heater" }
  },

  // Frame colours (RAL) and fabric colours offered in the quote builder.
  colors: [
    { id: "7016", hex: "#383e42", sq: "Antracit",     en: "Anthracite" },
    { id: "9016", hex: "#f1f0ea", sq: "E bardhë",     en: "White" },
    { id: "9005", hex: "#0e0e10", sq: "E zezë",       en: "Black" },
    { id: "8019", hex: "#3d3635", sq: "Kafe",         en: "Brown" },
    { id: "wood", hex: "#8a5a35", sq: "Imitim druri", en: "Wood effect" }
  ],
  fabrics: [
    { id: "ecru",   hex: "#e9e0cc", sq: "Ekru",     en: "Ecru" },
    { id: "grey",   hex: "#8e8e8a", sq: "Gri",      en: "Grey" },
    { id: "anthr",  hex: "#3a3d40", sq: "Antracit", en: "Anthracite" },
    { id: "stripe", hex: "#c9c3b6", sq: "Me vija",  en: "Striped", stripe: true }
  ]
};
