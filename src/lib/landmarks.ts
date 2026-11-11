import { palette } from "./art";

/**
 * Landmark icons are deliberately simplified, original drawings of building *types*.
 * They are not reproductions of any photograph, model or another creator's art.
 */
export type LandmarkKind = "chaupal" | "mandir" | "gurudwara" | "kila" | "darwaza" | "stupa" | "mahal" | "pul" | "maidan";

/** Icon in a 60x60 box, base at y=56. */
export function landmarkSVG(kind: LandmarkKind): string {
  const ink = palette.ink;
  const base = `<ellipse cx="30" cy="57" rx="24" ry="3.5" fill="${ink}" opacity=".15"/>`;
  switch (kind) {
    case "chaupal":
      // a sandstone pillar on a plinth under a banyan tree
      return (
        base +
        `<path d="M8 56 C8 30 14 22 22 20" stroke="#7A4A2C" stroke-width="3" fill="none"/>` +
        `<circle cx="16" cy="16" r="13" fill="${palette.leaf}"/><circle cx="8" cy="22" r="8" fill="${palette.leafDark}"/>` +
        `<rect x="18" y="48" width="30" height="8" rx="2" fill="#D9A766"/>` +
        `<rect x="27" y="22" width="12" height="27" rx="2" fill="#E8BC7E"/>` +
        `<rect x="25" y="19" width="16" height="5" rx="2" fill="#D9A766"/>` +
        `<path d="M33 19 V6" stroke="${ink}" stroke-width="1.6"/><path d="M33 6 L44 9 L33 12Z" fill="${palette.marigold}"/>`
      );
    case "mandir":
      return (
        base +
        `<rect x="8" y="44" width="44" height="12" rx="2" fill="#E9C99A"/>` +
        `<path d="M14 44 V34 H46 V44" fill="#F1D7AE"/>` +
        `<path d="M20 34 C20 20 26 12 30 6 C34 12 40 20 40 34Z" fill="#E9B97A"/>` +
        `<path d="M24 34 C24 24 27 18 30 12 M36 34 C36 24 33 18 30 12" stroke="#C98F4E" stroke-width="1.5" fill="none"/>` +
        `<path d="M30 6 V0" stroke="${ink}" stroke-width="1.4"/><path d="M30 0 L38 2.5 L30 5Z" fill="${palette.marigold}"/>` +
        `<path d="M26 56 V47 a4 4 0 0 1 8 0 V56Z" fill="#7A3E2E"/>`
      );
    case "gurudwara":
      return (
        base +
        `<rect x="8" y="34" width="44" height="22" rx="2" fill="#FBF3E4"/>` +
        `<path d="M18 34 C18 22 42 22 42 34Z" fill="#F4C04A"/>` +
        `<path d="M30 23 V15" stroke="#E08A12" stroke-width="2"/><circle cx="30" cy="14" r="2.2" fill="#E08A12"/>` +
        `<path d="M8 34 C8 29 13 29 13 34Z M47 34 C47 29 52 29 52 34Z" fill="#F4C04A"/>` +
        `<path d="M26 56 V46 a4 4 0 0 1 8 0 V56Z" fill="#4C6FA8"/>` +
        `<rect x="2" y="56" width="56" height="3" rx="1.5" fill="#8FD3E8"/>`
      );
    case "kila":
      return (
        base +
        `<rect x="6" y="26" width="48" height="30" fill="#D78E62"/>` +
        Array.from({ length: 6 }, (_, i) => `<rect x="${6 + i * 8.6}" y="20" width="5" height="7" fill="#D78E62"/>`).join("") +
        `<rect x="4" y="16" width="12" height="40" fill="#C97D52"/><rect x="44" y="16" width="12" height="40" fill="#C97D52"/>` +
        `<path d="M4 16 L10 8 L16 16Z M44 16 L50 8 L56 16Z" fill="${palette.roof}"/>` +
        `<path d="M24 56 V44 a6 6 0 0 1 12 0 V56Z" fill="#5A3324"/>`
      );
    case "darwaza":
      return (
        base +
        `<rect x="6" y="18" width="48" height="38" fill="#E8C994"/>` +
        `<path d="M20 56 V36 a10 10 0 0 1 20 0 V56Z" fill="${palette.paper}" opacity=".9"/>` +
        `<rect x="4" y="14" width="10" height="42" fill="#DDB97F"/><rect x="46" y="14" width="10" height="42" fill="#DDB97F"/>` +
        `<path d="M4 14 C4 6 14 6 14 14Z M46 14 C46 6 56 6 56 14Z" fill="#DDB97F"/>` +
        `<rect x="6" y="18" width="48" height="4" fill="#C9A46A"/>`
      );
    case "stupa":
      return (
        base +
        `<rect x="10" y="48" width="40" height="8" rx="2" fill="#E9C99A"/>` +
        `<path d="M14 48 C14 30 46 30 46 48Z" fill="#F4C04A"/>` +
        `<path d="M24 34 C26 24 28 16 30 4 C32 16 34 24 36 34Z" fill="#F0B43A"/>` +
        Array.from({ length: 4 }, (_, i) => `<rect x="${25 + i * 0.8}" y="${30 - i * 6}" width="${10 - i * 1.6}" height="2" rx="1" fill="#D49520"/>`).join("") +
        `<circle cx="30" cy="4" r="2" fill="#fff"/>`
      );
    case "mahal":
      return (
        base +
        `<rect x="6" y="28" width="48" height="28" fill="#F2B8A6"/>` +
        Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => `<path d="M${10 + c * 9} ${50 - r * 8} v-4 a2.5 2.5 0 0 1 5 0 v4Z" fill="#C25E4A"/>`).join(""),
        ).join("") +
        `<path d="M14 28 C14 18 26 18 26 28Z M34 28 C34 18 46 18 46 28Z" fill="#E99A85"/>` +
        `<path d="M22 20 C22 8 38 8 38 20Z" fill="#E99A85"/><path d="M30 10 V4" stroke="${ink}" stroke-width="1.4"/>`
      );
    case "pul":
      return (
        `<rect x="0" y="48" width="60" height="9" fill="#8FD3E8"/>` +
        `<rect x="10" y="10" width="7" height="40" fill="#6F7E95"/><rect x="43" y="10" width="7" height="40" fill="#6F7E95"/>` +
        `<path d="M0 44 H60" stroke="#6F7E95" stroke-width="4"/>` +
        `<path d="M13 12 Q30 40 47 12 M0 30 Q6 40 13 12 M47 12 Q54 40 60 30" stroke="#6F7E95" stroke-width="2" fill="none"/>` +
        Array.from({ length: 7 }, (_, i) => `<path d="M${18 + i * 4} ${18 + Math.abs(3 - i) * -2 + 10} V44" stroke="#6F7E95" stroke-width="1"/>`).join("")
      );
    case "maidan":
      return (
        base +
        `<ellipse cx="30" cy="40" rx="27" ry="15" fill="#E2603F"/>` +
        `<ellipse cx="30" cy="40" rx="21" ry="10" fill="${palette.leaf}"/>` +
        `<rect x="28" y="34" width="4" height="12" rx="1" fill="#E8C994"/>` +
        `<path d="M6 34 V20 M54 34 V20" stroke="#5B6478" stroke-width="2"/><rect x="2" y="16" width="8" height="5" fill="${palette.glow}"/><rect x="50" y="16" width="8" height="5" fill="${palette.glow}"/>`
      );
  }
}

export interface Landmark {
  id: string;
  name: string;
  city: string; // must match a city in CITIES
  kind: LandmarkKind;
  dx?: number; // offset from the city point, map units
  dy?: number;
}

/** Built so far. Day 1: only the starting point. */
export const BUILT: Landmark[] = [
  { id: "zero-mile", name: "Zero Mile Chaupal", city: "Nagpur", kind: "chaupal", dx: 0, dy: -4 },
];

/** Candidates people can ask for. What gets built next is decided by comments on the Reel. */
export const WISHLIST: Landmark[] = [
  { id: "ram-mandir", name: "Ram Mandir", city: "Ayodhya", kind: "mandir" },
  { id: "harmandir", name: "Harmandir Sahib", city: "Amritsar", kind: "gurudwara" },
  { id: "kashi", name: "Kashi Vishwanath", city: "Varanasi", kind: "mandir" },
  { id: "gateway", name: "Gateway of India", city: "Mumbai", kind: "darwaza" },
  { id: "hawa-mahal", name: "Hawa Mahal", city: "Jaipur", kind: "mahal" },
  { id: "howrah", name: "Howrah Bridge", city: "Kolkata", kind: "pul" },
  { id: "meenakshi", name: "Meenakshi Mandir", city: "Madurai", kind: "mandir" },
  { id: "pashupatinath", name: "Pashupatinath", city: "Kathmandu", kind: "mandir" },
  { id: "dhakeshwari", name: "Dhakeshwari Mandir", city: "Dhaka", kind: "mandir" },
  { id: "shwedagon", name: "Shwedagon Pagoda", city: "Yangon", kind: "stupa" },
  { id: "dalada", name: "Dalada Maligawa", city: "Kandy", kind: "stupa" },
  { id: "katas-raj", name: "Katas Raj", city: "Islamabad", kind: "mandir", dx: 10, dy: 22 },
  { id: "chittorgarh", name: "Chittorgarh Kila", city: "Udaipur", kind: "kila", dx: 14, dy: -6 },
  { id: "eden", name: "Eden Gardens", city: "Kolkata", kind: "maidan", dx: -14 },
];
