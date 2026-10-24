// The living sky: a phase (dawn / day / dusk / night) for Alberta, derived
// from approximate sunrise and sunset in Edmonton. Pure and deterministic for
// a given instant, so the server can render it and the client can re-check it.
// The colours live in app/styles/sky.css, keyed by [data-sky="<phase>"].

export const SKY_PHASES = ["dawn", "day", "dusk", "night"] as const;
export type SkyPhase = (typeof SKY_PHASES)[number];

export function isSkyPhase(value: unknown): value is SkyPhase {
  return typeof value === "string" && (SKY_PHASES as readonly string[]).includes(value);
}

const TIME_ZONE = "America/Edmonton";
const LAT = 53.5461;
const LON = -113.4938;
const RAD = Math.PI / 180;

const PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

/** Local Edmonton wall-clock parts and UTC offset (minutes) for an instant. */
function edmontonClock(now: Date) {
  const get: Record<string, number> = {};
  for (const part of PARTS.formatToParts(now)) {
    if (part.type !== "literal") get[part.type] = Number(part.value);
  }
  const asUtc = Date.UTC(get.year, get.month - 1, get.day, get.hour, get.minute);
  const offsetMin = Math.round((asUtc - Math.floor(now.getTime() / 60000) * 60000) / 60000);
  const dayOfYear =
    Math.round((Date.UTC(get.year, get.month - 1, get.day) - Date.UTC(get.year, 0, 0)) / 86400000);
  return { minutes: get.hour * 60 + get.minute, offsetMin, dayOfYear };
}

/** Sunrise and sunset as Edmonton local minutes after midnight (NOAA approximation). */
export function sunTimes(dayOfYear: number, offsetMin: number) {
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const declination = 23.44 * Math.sin(b) * RAD;
  const cosH =
    (Math.sin(-0.833 * RAD) - Math.sin(LAT * RAD) * Math.sin(declination)) /
    (Math.cos(LAT * RAD) * Math.cos(declination));
  const halfDay = 4 * (Math.acos(Math.max(-1, Math.min(1, cosH))) / RAD); // minutes
  const solarNoon = 720 - 4 * LON - equationOfTime + offsetMin;
  return { sunrise: solarNoon - halfDay, sunset: solarNoon + halfDay };
}

/** The phase of the sky over Edmonton at `now`. */
export function getSkyPhase(now: Date = new Date()): SkyPhase {
  const { minutes, offsetMin, dayOfYear } = edmontonClock(now);
  const { sunrise, sunset } = sunTimes(dayOfYear, offsetMin);
  if (minutes >= sunrise - 50 && minutes < sunrise + 40) return "dawn";
  if (minutes >= sunrise + 40 && minutes < sunset - 60) return "day";
  if (minutes >= sunset - 60 && minutes < sunset + 50) return "dusk";
  return "night";
}
