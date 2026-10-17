/*
 * Where the sun is: elevation and azimuth for a place and moment, plus
 * helpers to turn a local wall-clock time in a time zone into a real instant.
 * Accurate to well under a degree, which is plenty for drawing shadows.
 */
window.SUN = (() => {
  "use strict";

  const RAD = Math.PI / 180;

  // Elevation above the horizon and azimuth (0 = north, 90 = east), in degrees.
  function position(date, lat, lon) {
    const d = date.getTime() / 864e5 + 2440587.5 - 2451545.0;
    const g = (357.529 + 0.98560028 * d) * RAD;
    const q = 280.459 + 0.98564736 * d;
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * RAD;
    const e = (23.439 - 0.00000036 * d) * RAD;
    const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
    const dec = Math.asin(Math.sin(e) * Math.sin(L));
    const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
    const H = ((gmst * 15 + lon) * RAD) - ra;
    const phi = lat * RAD;

    const elevation = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    const azimuth = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)) + Math.PI;
    return { elevation: elevation / RAD, azimuth: ((azimuth / RAD) % 360 + 360) % 360 };
  }

  // Wall-clock parts (year, month, day, minutes) for `date` in `tz`.
  function partsIn(date, tz) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(date).map((x) => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day, min: +p.hour * 60 + +p.minute };
  }

  // The real instant at which the clock in `tz` shows `min` minutes past midnight on y-m-d.
  function instant(y, m, d, min, tz) {
    const guess = Date.UTC(y, m - 1, d, 0, min);
    const p = partsIn(new Date(guess), tz);
    const shown = Date.UTC(p.y, p.m - 1, p.d, 0, p.min);
    return new Date(guess - (shown - guess));
  }

  return { position, partsIn, instant };
})();
