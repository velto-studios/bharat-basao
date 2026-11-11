import { CITIES } from "@/data/map";

export type City = (typeof CITIES)[number];

export const cityByName = new Map(CITIES.map((c) => [c.name.toLowerCase(), c] as const));

export function findCity(name: string): City | undefined {
  return cityByName.get(name.trim().toLowerCase());
}

export function searchCities(q: string, limit = 8): City[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const starts = CITIES.filter((c) => c.name.toLowerCase().startsWith(s));
  const has = CITIES.filter((c) => !c.name.toLowerCase().startsWith(s) && c.name.toLowerCase().includes(s));
  return [...starts, ...has].slice(0, limit);
}

/** Catmull-Rom spline through points, as an SVG path. */
export function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
