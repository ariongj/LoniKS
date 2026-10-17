/*
 * Loni Tenda: all company details live here.
 * Edit this file to change contact info, products and the quote builder.
 * Fields left empty ("") are hidden on the site automatically.
 */
window.LONI = {
  name: "Loni Tenda",
  legalName: "LONI Pergola SH.P.K.",
  since: 2016,              // year shown in the "about" section; set to null to hide

  // Contact. Leave empty to hide. WhatsApp/Viber: digits only with country code, e.g. "38349206030".
  phones: ["+383 49 20 60 30", "+383 44 20 60 30"],
  email: "tenda@loni-ks.com",
  whatsapp: "",             // e.g. "38349206030"; with it set, quote requests can go to WhatsApp
  viber: "",                // e.g. "38349206030"
  address: "Davidovc",
  city: "Shtime",
  country: "Kosovë",
  mapsQuery: "Davidovc, Shtime, Kosovo",
  instagram: "",            // username only, e.g. "lonitenda"
  facebook: "",             // full URL

  // Opening hours in local time. null = closed that day. Set `hours: null` to hide them.
  timezone: "Europe/Belgrade",
  hours: null,
  // hours: { mon: ["08:00", "17:00"], tue: ["08:00", "17:00"], wed: ["08:00", "17:00"],
  //          thu: ["08:00", "17:00"], fri: ["08:00", "17:00"], sat: ["08:00", "14:00"], sun: null },

  // The terrace in the hero. The sun is calculated for this spot, today, in real time.
  scene: {
    lat: 42.433,
    lon: 21.040,
    facing: 180             // which way the terrace faces, in degrees (180 = south)
  },

  categories: {
    pergola:  { sq: "Pergola & çati", en: "Pergolas & roofs" },
    glass:    { sq: "Xhama",          en: "Glass" },
    awning:   { sq: "Tenda",          en: "Awnings" },
    parasol:  { sq: "Çadra",          en: "Parasols" }
  },

  // Products. `fig` picks the drawing (js/draw.js), `plan` how the quote builder draws it.
  // dims: [min, max, default] in metres. `h: true` means the second size is a height.
  // Add `photo: "assets/img/pergola.jpg"` to show a real photo on the card instead of the drawing.
  products: [
    { id: "pergola", cat: "pergola", fig: "pergola", plan: "louvres", featured: true,
      sq: "Pergola bioklimatike", en: "Bioclimatic pergola",
      d: { sq: "Strukturë tërësisht prej alumini me ngjyrosje elektrostatike. Lamelat rrotullohen me telekomandë: hapi për ajër e dritë, mbylli për hije dhe shi.",
           en: "A fully aluminium structure with electrostatic powder coating. The louvres turn by remote: open them for air and light, close them for shade and rain." },
      tags: ["Alumin", "SOMFY", "BECKER", "LED"],
      w: [2, 7, 4], dpt: [2, 6, 3], drives: ["somfy", "becker"], extras: ["led", "rain", "wind", "side", "glass", "heater"] },

    { id: "mbuloja", cat: "pergola", fig: "glassroof", plan: "glassroof",
      sq: "Mbulojë me xham", en: "Glass roof",
      d: { sq: "Çati e lehtë alumini me xham, që e mban shiun larg terasës pa ia marrë dritën.",
           en: "A light aluminium roof with glass that keeps the rain off the terrace without taking away the light." },
      tags: ["Alumin", "Xham"],
      w: [2, 8, 4], dpt: [2, 5, 3], drives: [], extras: ["led", "side", "glass", "heater"] },

    { id: "slide", cat: "glass", fig: "slide", plan: "slide",
      sq: "Xhama rrëshqitës", en: "Sliding glass",
      d: { sq: "Panele xhami që rrëshqasin anash: e mbyllin terasën ndaj erës dhe të ftohtit, pa ia prishur pamjen. Xham laminat sigurie 4+4 ose 5+5.",
           en: "Glass panels that slide sideways: they close the terrace against wind and cold without spoiling the view. 4+4 or 5+5 laminated safety glass." },
      tags: ["4+4", "5+5", "Laminat"],
      w: [2, 10, 4], dpt: [1.8, 2.8, 2.2], h: true, drives: [], extras: [] },

    { id: "gijot", cat: "glass", fig: "gijot", plan: "gijot",
      sq: "Xhama gijotinë", en: "Guillotine glass",
      d: { sq: "Sistem i motorizuar xhamash që lëvizin lart e poshtë me telekomandë. Moduli i parë mbetet gjithmonë fiks dhe shërben si parmak kur xhamat janë të hapur.",
           en: "Motorised glass that moves up and down by remote. The first module always stays fixed and works as a railing when the glass is open." },
      tags: ["Motor", "Telekomandë"],
      w: [2, 6, 4], dpt: [2, 3, 2.4], h: true, drives: ["somfy", "becker"], extras: ["led"] },

    { id: "kaseta", cat: "awning", fig: "cassette", plan: "awning", fabric: true,
      sq: "Tenda me kasetë", en: "Cassette awning",
      d: { sq: "Pëlhura dhe krahët mbyllen plotësisht brenda një kasete alumini, të mbrojtura nga shiu dhe pluhuri kur tenda nuk përdoret.",
           en: "The fabric and arms fold fully into an aluminium cassette, protected from rain and dust when the awning is closed." },
      tags: ["Kasetë", "Motor"],
      w: [2, 7, 4], dpt: [1.5, 4, 3], drives: ["manual", "somfy", "becker"], extras: ["led", "wind", "sun"] },

    { id: "klasike", cat: "awning", fig: "classic", plan: "awning", fabric: true,
      sq: "Tenda klasike", en: "Classic awning",
      d: { sq: "Hapet me krahë të fuqishëm alumini me tension, me komandim manual ose automatik.",
           en: "Opens on strong tensioned aluminium arms, with manual or automatic control." },
      tags: ["Krahë alumini", "Manual / motor"],
      w: [2, 6, 3.5], dpt: [1.5, 3.5, 2.5], drives: ["manual", "somfy", "becker"], extras: ["wind", "sun"] },

    { id: "dritaresh", cat: "awning", fig: "window", plan: "window", fabric: true,
      sq: "Tenda dritaresh", en: "Window awning",
      d: { sq: "Hije për dritare dhe ballkone, që e mban diellin jashtë dhomës pa e errësuar atë.",
           en: "Shade for windows and balconies that keeps the sun out of the room without making it dark." },
      tags: ["Dritare", "Ballkon"],
      w: [0.8, 4, 1.6], dpt: [0.6, 1.5, 1], drives: ["manual", "somfy"], extras: ["sun"] },

    { id: "perde", cat: "awning", fig: "screen", plan: "screen", fabric: true,
      sq: "Tenda perde", en: "Vertical screen",
      d: { sq: "Tendë vertikale që zbret si perde në anët e pergolës ose të terasës, për hije dhe privatësi.",
           en: "A vertical awning that lowers like a curtain at the sides of a pergola or terrace, for shade and privacy." },
      tags: ["Vertikale", "Privatësi"],
      w: [1, 6, 3], dpt: [1.5, 3.5, 2.5], h: true, drives: ["manual", "somfy", "becker"], extras: ["wind"] },

    { id: "mbixham", cat: "awning", fig: "overglass", plan: "glassroof", fabric: true,
      sq: "Tenda mbi xham", en: "Over-glass awning",
      d: { sq: "Montohet mbi çatinë e xhamit dhe e ndal nxehtësinë e diellit para se të arrijë xhamin, duke i dhënë hapësirës atmosferë.",
           en: "Mounted on top of a glass roof, it stops the sun's heat before it reaches the glass and gives the space atmosphere." },
      tags: ["Mbi xham", "Motor"],
      w: [2, 7, 4], dpt: [2, 6, 3.5], drives: ["somfy", "becker"], extras: ["wind", "sun"] },

    { id: "nenxham", cat: "awning", fig: "underglass", plan: "glassroof", fabric: true,
      sq: "Tenda nën xham", en: "Under-glass awning",
      d: { sq: "Montohet nën çatinë e xhamit, e mbrojtur nga moti, për dritë të butë dhe hije brenda.",
           en: "Mounted under the glass roof, sheltered from the weather, for soft light and shade inside." },
      tags: ["Nën xham", "Motor"],
      w: [2, 7, 4], dpt: [2, 6, 3.5], drives: ["somfy", "becker"], extras: ["sun"] },

    { id: "dyshe", cat: "awning", fig: "double", plan: "double", fabric: true,
      sq: "Tenda e dyfishtë", en: "Double awning",
      d: { sq: "Dy tenda nga një strukturë qendrore, që hapen në të dyja anët: për oborre, kafene dhe hapësira të mëdha.",
           en: "Two awnings from one central structure, opening to both sides: for gardens, cafés and large spaces." },
      tags: ["Dy anë", "Kafene"],
      w: [3, 8, 5], dpt: [3, 8, 5], drives: ["manual", "somfy", "becker"], extras: ["led", "wind"] },

    { id: "cadra", cat: "parasol", fig: "parasol", plan: "parasol", fabric: true,
      sq: "Çadra", en: "Parasols",
      d: { sq: "Çadra të mëdha për oborre, restorante dhe kafene, me strukturë të qëndrueshme dhe pëlhurë rezistente.",
           en: "Large parasols for gardens, restaurants and cafés, with a sturdy frame and durable fabric." },
      tags: ["Oborr", "Restorant"],
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
    { id: "stripe", hex: "#f2a43a", sq: "Me vija",  en: "Striped", stripe: true }
  ]
};
