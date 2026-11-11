/**
 * Chirpur art system. Every illustration is generated here as an SVG string,
 * so the website and the Reel renderer draw from exactly the same source.
 * No external images.
 */

export const palette = {
  paper: "#FFF6E9",
  ink: "#1F2A44",
  inkSoft: "#46506B",
  roof: "#E2603F",
  roofDark: "#C24B2E",
  marigold: "#F4A62A",
  marigoldDark: "#E08A12",
  leaf: "#4E9F6E",
  leafDark: "#3E8A5C",
  sparrow: "#A86B44",
  sparrowDark: "#7A4A2C",
  belly: "#F3E3C8",
  face: "#EFE8DC",
  blush: "#F29C8B",
  street: "#E8C9A0",
  glow: "#FFD87A",
} as const;

export const WALLS = [
  { id: "gulabi", label: "Gulabi", hex: "#F6B8A4" },
  { id: "firozi", label: "Firozi", hex: "#8FD3C9" },
  { id: "haldi", label: "Haldi", hex: "#F7D26B" },
  { id: "neela", label: "Neela", hex: "#AFC0F2" },
  { id: "kesariya", label: "Kesariya", hex: "#F5A65B" },
  { id: "mehendi", label: "Mehendi", hex: "#C6E29C" },
  { id: "lavender", label: "Lavender", hex: "#D6C1F0" },
] as const;

export const STYLES = [
  { id: "chhat", label: "Chhat wala", note: "Flat roof, do manzil" },
  { id: "khaprail", label: "Khaprail", note: "Mitti ki tiles, ek manzil" },
  { id: "chhatri", label: "Chhatri", note: "Chhat par chhatri" },
] as const;

export const EXTRAS = [
  { id: "paudhe", label: "Paudhe" },
  { id: "toran", label: "Toran" },
  { id: "diya", label: "Lamp" },
] as const;

export type WallId = (typeof WALLS)[number]["id"];
export type StyleId = (typeof STYLES)[number]["id"];
export type ExtraId = (typeof EXTRAS)[number]["id"];

export interface HouseSpec {
  style: StyleId;
  wall: WallId;
  door: number;
  extras: ExtraId[];
  name: string;
}

const GLOW_DEF = `<defs><radialGradient id="cpGlow"><stop offset="0" stop-color="#FFD87A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD87A" stop-opacity="0"/></radialGradient></defs>`;

export const DOORS = ["#2F6F73", "#7A3E2E", "#3C4F8A", "#B5473A"];

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const wallHex = (id: WallId) => WALLS.find((w) => w.id === id)?.hex ?? WALLS[0].hex;

/** Darken (f<0) or lighten (f>0) a hex colour. */
export function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f),
  );
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/* ------------------------------------------------------------------ */
/* Chiku, the sparrow builder                                          */
/* ------------------------------------------------------------------ */

export type Mood = "happy" | "joy" | "surprised" | "wink" | "sleepy";
export type WingPose = "rest" | "wave" | "up";

export interface ChikuOpts {
  mood?: Mood;
  wing?: WingPose;
  look?: [number, number];
  blink?: boolean;
  hat?: boolean;
}

/** Chiku in a 200x200 box, feet at y≈186. */
export function chikuSVG(o: ChikuOpts = {}): string {
  const mood = o.mood ?? "happy";
  const wing = o.wing ?? "rest";
  const [lx, ly] = o.look ?? [0, 0];
  const hat = o.hat ?? true;
  const closed = o.blink || mood === "joy" || mood === "sleepy";

  const eye = (cx: number, cy: number, r: number, winkThis = false) => {
    if (closed || winkThis) {
      const d =
        mood === "sleepy"
          ? `M${cx - r} ${cy} Q${cx} ${cy + r * 0.7} ${cx + r} ${cy}`
          : `M${cx - r} ${cy + 2} Q${cx} ${cy - r} ${cx + r} ${cy + 2}`;
      return `<path d="${d}" stroke="${palette.ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    }
    const R = r * (mood === "surprised" ? 1.22 : 1);
    return (
      `<circle cx="${cx + lx}" cy="${cy + ly}" r="${R}" fill="${palette.ink}"/>` +
      `<circle cx="${cx + lx - R * 0.32}" cy="${cy + ly - R * 0.38}" r="${R * 0.34}" fill="#fff"/>` +
      `<circle cx="${cx + lx + R * 0.36}" cy="${cy + ly + R * 0.3}" r="${R * 0.14}" fill="#fff"/>`
    );
  };

  const wings: Record<WingPose, string> = {
    rest:
      `<path d="M50 116 C60 100 92 102 100 122 C98 134 88 144 76 148 L70 141 L64 148 L58 139 L49 141 C46 132 46 124 50 116Z" fill="${palette.sparrowDark}"/>` +
      `<path d="M58 118 C70 110 86 112 94 124" stroke="#C99B6B" stroke-width="4.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M56 130 C66 126 80 128 88 134" stroke="${palette.belly}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    wave:
      `<path d="M140 120 C162 98 174 82 180 60 C184 66 186 70 183 76 C189 79 189 84 184 88 C188 92 186 98 180 100 C172 116 162 128 150 140 Z" fill="${palette.sparrowDark}"/>` +
      `<path d="M168 80 C166 98 158 112 148 124" stroke="#C99B6B" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    up:
      `<path d="M80 118 C64 88 44 66 16 50 C20 58 20 62 28 67 C24 70 25 75 33 79 C30 83 32 88 42 91 C40 98 48 106 64 126 Z" fill="${palette.sparrowDark}"/>` +
      `<path d="M30 60 C48 70 62 86 72 106" stroke="#C99B6B" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
  };

  const mouth: Partial<Record<Mood, string>> = {
    joy: `<path d="M119 104 Q125 114 131 104 Z" fill="#B5473A"/>`,
    surprised: `<ellipse cx="125" cy="107" rx="3.5" ry="4.5" fill="#B5473A"/>`,
  };

  const hatSvg = hat
    ? `<g transform="rotate(-7 118 58)">` +
      `<path d="M80 62 C80 30 156 28 158 60 Z" fill="${palette.marigold}"/>` +
      `<path d="M118 36 L118 58" stroke="#FFC75A" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M92 50 C96 40 104 35 110 34" stroke="#FFD98A" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>` +
      `<rect x="70" y="56" width="98" height="11" rx="5.5" fill="${palette.marigoldDark}"/>` +
      `</g>`
    : `<path d="M88 66 C96 46 140 44 152 66 C150 74 92 76 88 66Z" fill="#8F939B"/>`;

  return (
    `<g class="chiku">` +
    `<ellipse cx="100" cy="190" rx="44" ry="6" fill="${palette.ink}" opacity=".12"/>` +
    `<path d="M54 122 L16 100 L24 116 L12 126 L22 132 L56 140 Z" fill="#6B4226"/>` +
    `<path d="M90 170 L88 186 M84 186 L94 186 M110 170 L112 186 M106 186 L117 186" stroke="#D9895E" stroke-width="4" stroke-linecap="round"/>` +
    `<ellipse cx="100" cy="130" rx="56" ry="48" fill="${palette.sparrow}"/>` +
    (wing === "rest" ? `<g class="ck-wing ck-wing-rest">${wings.rest}</g>` : "") +
    `<ellipse cx="110" cy="142" rx="38" ry="31" fill="${palette.belly}"/>` +
    (wing === "wave" ? `<g class="ck-wing ck-wing-wave">${wings.wave}</g>` : "") +
    `<g class="ck-head">` +
    `<circle cx="116" cy="80" r="41" fill="${palette.sparrow}"/>` +
    `<path d="M150 70 C160 78 158 96 150 104" stroke="#6B4226" stroke-width="6" fill="none" stroke-linecap="round" opacity=".55"/>` +
    `<ellipse cx="120" cy="90" rx="31" ry="23" fill="${palette.face}"/>` +
    `<g class="ck-eyes">${eye(106, 84, 10.5)}${eye(136, 84, 9.5, mood === "wink")}</g>` +
    `<ellipse cx="97" cy="99" rx="6.5" ry="3.6" fill="${palette.blush}" opacity=".75"/>` +
    `<ellipse cx="146" cy="98" rx="5.5" ry="3.4" fill="${palette.blush}" opacity=".75"/>` +
    `<path d="M114 106 Q125 124 136 106 Q130 112 125 112 Q119 112 114 106Z" fill="#2B2320"/>` +
    `<path d="M118 94 L134 98 L118 103 Z" fill="#D88A35"/>` +
    (mouth[mood] ?? "") +
    hatSvg +
    `</g>` +
    (wing === "up" ? `<g class="ck-wing ck-wing-up">${wings.up}</g>` : "") +
    `</g>`
  );
}

/* ------------------------------------------------------------------ */
/* Small sparrows                                                      */
/* ------------------------------------------------------------------ */

/** A small perched sparrow (~40 wide), feet at (x,y). */
export function miniSparrowSVG(x: number, y: number, flip = false, scale = 1, cls = "mini-sparrow"): string {
  const f = flip ? -1 : 1;
  return (
    `<g transform="translate(${x} ${y}) scale(${f * scale} ${scale})"><g class="${cls}">` +
    `<path d="M-10 -10 L-21 -15 L-18 -9 L-22 -5 L-9 -6 Z" fill="#6B4226"/>` +
    `<ellipse cx="0" cy="-10" rx="11" ry="8.5" fill="${palette.sparrow}"/>` +
    `<ellipse cx="2" cy="-7" rx="7" ry="5" fill="${palette.belly}"/>` +
    `<path d="M-8 -12 C-4 -16 3 -15 5 -10 C2 -6 -4 -5 -9 -7Z" fill="${palette.sparrowDark}"/>` +
    `<circle cx="8" cy="-19" r="7" fill="${palette.sparrow}"/>` +
    `<ellipse cx="9.5" cy="-17.5" rx="4.8" ry="4" fill="${palette.face}"/>` +
    `<path d="M7 -14 Q10 -10 13 -14" fill="#2B2320"/>` +
    `<circle cx="10" cy="-19" r="1.8" fill="${palette.ink}"/>` +
    `<path d="M14 -18 L18.5 -17 L14 -15.5Z" fill="#D88A35"/>` +
    `<path d="M-2 -2 V1 M3 -2 V1" stroke="#D9895E" stroke-width="1.4" stroke-linecap="round"/>` +
    `</g></g>`
  );
}

/* ------------------------------------------------------------------ */
/* Houses                                                              */
/* ------------------------------------------------------------------ */

export const HOUSE_W = 168;
export const HOUSE_H = 280; // ground at y = HOUSE_H
export const HOUSE_BOX_H = HOUSE_H + 44; // includes the name sign on the pavement

export interface HouseOpts {
  lit?: boolean;
  sparrow?: boolean;
  highlight?: boolean;
  showName?: boolean;
}

/** One house in a HOUSE_W x HOUSE_H box, ground at y = HOUSE_H. */
export function houseSVG(spec: HouseSpec, o: HouseOpts = {}): string {
  const lit = !!o.lit;
  const wall = wallHex(spec.wall);
  const wallShade = shade(wall, -0.14);
  const trim = shade(wall, 0.5);
  const door = DOORS[((spec.door % DOORS.length) + DOORS.length) % DOORS.length];
  const win = lit ? palette.glow : "#2B3A55";
  const G = HOUSE_H;
  const W = 140;
  const X = (HOUSE_W - W) / 2;
  const twoFloor = spec.style !== "khaprail";
  const bodyH = twoFloor ? 190 : 122;
  const top = G - bodyH;
  const p: string[] = [];

  if (o.highlight)
    p.push(`<rect x="${X - 14}" y="${top - 60}" width="${W + 28}" height="${bodyH + 70}" rx="20" fill="${palette.marigold}" opacity=".28"/>`);
  if (lit) {
    p.push(GLOW_DEF);
    p.push(`<ellipse cx="${HOUSE_W / 2}" cy="${G - 80}" rx="110" ry="110" fill="url(#cpGlow)" opacity=".35"/>`);
  }

  // body
  p.push(`<rect x="${X}" y="${top}" width="${W}" height="${bodyH}" fill="${wall}"/>`);
  p.push(`<rect x="${X + W - 16}" y="${top}" width="16" height="${bodyH}" fill="${palette.ink}" opacity=".08"/>`);
  p.push(`<rect x="${X}" y="${G - 14}" width="${W}" height="14" fill="${wallShade}"/>`);

  // roof
  if (spec.style === "khaprail") {
    p.push(`<path d="M${X - 14} ${top + 4} L${X + W / 2} ${top - 58} L${X + W + 14} ${top + 4} Z" fill="${palette.roof}"/>`);
    for (let i = 1; i < 5; i++) {
      const yy = top + 4 - i * 12;
      const half = (W / 2 + 14) * (1 - (i * 12) / 62);
      p.push(`<path d="M${X + W / 2 - half + 6} ${yy} H${X + W / 2 + half - 6}" stroke="${palette.roofDark}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`);
    }
    p.push(`<rect x="${X - 16}" y="${top}" width="${W + 32}" height="8" rx="4" fill="${palette.roofDark}"/>`);
    p.push(`<circle cx="${X + W / 2}" cy="${top - 20}" r="9" fill="${trim}"/><circle cx="${X + W / 2}" cy="${top - 20}" r="6" fill="${win}"/>`);
  } else {
    p.push(`<rect x="${X - 6}" y="${top - 10}" width="${W + 12}" height="12" rx="3" fill="${palette.roof}"/>`);
    for (let i = 0; i < 8; i++) {
      p.push(`<rect x="${X - 2 + i * 18.6}" y="${top - 19}" width="10" height="10" rx="2.5" fill="${palette.roof}"/>`);
    }
    if (spec.style === "chhatri") {
      const cx = X + 42;
      p.push(`<rect x="${cx - 18}" y="${top - 48}" width="5" height="30" fill="${trim}"/><rect x="${cx + 13}" y="${top - 48}" width="5" height="30" fill="${trim}"/>`);
      p.push(`<path d="M${cx - 24} ${top - 46} Q${cx} ${top - 84} ${cx + 24} ${top - 46} Z" fill="${palette.marigold}"/>`);
      p.push(`<circle cx="${cx}" cy="${top - 74}" r="4" fill="${palette.marigoldDark}"/>`);
      p.push(`<rect x="${cx - 27}" y="${top - 50}" width="54" height="7" rx="3.5" fill="${palette.marigoldDark}"/>`);
    } else {
      const tx = X + 22;
      p.push(`<rect x="${tx}" y="${top - 52}" width="34" height="34" rx="6" fill="#33475B"/><rect x="${tx + 5}" y="${top - 57}" width="24" height="8" rx="3" fill="#33475B"/><path d="M${tx + 4} ${top - 40} H${tx + 30}" stroke="#4C6580" stroke-width="2"/>`);
    }
  }

  // upper floor
  if (twoFloor) {
    const fy = top + 14;
    for (const wx of [X + 18, X + W - 52]) {
      p.push(`<path d="M${wx - 4} ${fy + 50} V${fy + 18} a20 20 0 0 1 42 0 V${fy + 50} Z" fill="${trim}"/>`);
      p.push(`<path d="M${wx} ${fy + 48} V${fy + 18} a17 17 0 0 1 34 0 V${fy + 48} Z" fill="${win}"/>`);
      p.push(`<path d="M${wx + 17} ${fy + 2} V${fy + 48} M${wx} ${fy + 26} H${wx + 34}" stroke="${trim}" stroke-width="3"/>`);
    }
    const by = top + 72;
    p.push(`<rect x="${X + 8}" y="${by + 16}" width="${W - 16}" height="5" rx="2" fill="${palette.ink}" opacity=".32"/>`);
    p.push(`<rect x="${X + 8}" y="${by - 2}" width="${W - 16}" height="3.5" rx="1.5" fill="${palette.ink}" opacity=".28"/>`);
    for (let bx = X + 12; bx < X + W - 10; bx += 9) {
      p.push(`<rect x="${bx}" y="${by}" width="2.6" height="16" fill="${palette.ink}" opacity=".24"/>`);
    }
  }

  // ground floor
  const dw = 36;
  const dx = twoFloor ? X + 18 : X + W / 2 - dw / 2;
  p.push(`<path d="M${dx - 4} ${G - 14} V${G - 60} a${dw / 2 + 4} ${dw / 2 + 4} 0 0 1 ${dw + 8} 0 V${G - 14} Z" fill="${trim}"/>`);
  p.push(`<path d="M${dx} ${G - 14} V${G - 58} a${dw / 2} ${dw / 2} 0 0 1 ${dw} 0 V${G - 14} Z" fill="${door}"/>`);
  p.push(`<path d="M${dx + dw / 2} ${G - 76} V${G - 14}" stroke="${shade(door, -0.3)}" stroke-width="2"/>`);
  p.push(`<circle cx="${dx + dw / 2 - 5}" cy="${G - 36}" r="2.2" fill="${palette.marigold}"/><circle cx="${dx + dw / 2 + 5}" cy="${G - 36}" r="2.2" fill="${palette.marigold}"/>`);
  p.push(`<rect x="${dx - 8}" y="${G - 14}" width="${dw + 16}" height="6" rx="2" fill="${shade(wall, -0.28)}"/>`);
  const ay = G - 90;
  p.push(`<path d="M${dx - 12} ${ay} H${dx + dw + 12} L${dx + dw + 6} ${ay + 12} H${dx - 6} Z" fill="${palette.roof}"/>`);
  for (let i = 0; i < 4; i++) p.push(`<rect x="${dx - 5 + i * 13}" y="${ay}" width="6" height="12" fill="#FFF6E9" opacity=".5"/>`);

  if (twoFloor) {
    const gx = X + W - 60;
    p.push(`<rect x="${gx - 4}" y="${G - 72}" width="50" height="42" rx="5" fill="${trim}"/>`);
    p.push(`<rect x="${gx}" y="${G - 68}" width="42" height="34" rx="3" fill="${win}"/>`);
    p.push(`<path d="M${gx + 21} ${G - 68} V${G - 34}" stroke="${trim}" stroke-width="3"/>`);
  } else {
    for (const wx of [X + 10, X + W - 34]) {
      p.push(`<rect x="${wx - 3}" y="${G - 74}" width="30" height="36" rx="5" fill="${trim}"/><rect x="${wx}" y="${G - 71}" width="24" height="30" rx="4" fill="${win}"/>`);
    }
  }

  // extras
  if (spec.extras.includes("toran")) {
    const ty = twoFloor ? top + 4 : top + 12;
    const n = 10;
    p.push(`<path d="M${X + 4} ${ty} Q${X + W / 2} ${ty + 18} ${X + W - 4} ${ty}" stroke="${palette.leafDark}" stroke-width="1.6" fill="none"/>`);
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const xx = X + 4 + (W - 8) * t;
      const yy = ty + 18 * 2 * t * (1 - t);
      p.push(`<path d="M${xx - 4} ${yy} L${xx + 4} ${yy} L${xx} ${yy + 9}Z" fill="${i % 2 ? palette.marigold : palette.leaf}"/>`);
    }
  }
  if (spec.extras.includes("paudhe")) {
    const px = twoFloor ? X + W - 18 : X + W - 16;
    p.push(`<path d="M${px - 11} ${G - 14} l-3 -18 h28 l-3 18z" fill="#C2562F"/>`);
    p.push(`<circle cx="${px}" cy="${G - 42}" r="12" fill="${palette.leaf}"/><circle cx="${px - 9}" cy="${G - 35}" r="7" fill="${palette.leafDark}"/><circle cx="${px + 7}" cy="${G - 49}" r="4.5" fill="#F07A8E"/><circle cx="${px - 4}" cy="${G - 50}" r="3.5" fill="#F07A8E"/>`);
    if (twoFloor) {
      p.push(`<path d="M${X + W - 30} ${top - 10} l-2 -11 h18 l-2 11z" fill="#C2562F"/><circle cx="${X + W - 23}" cy="${top - 27}" r="8" fill="${palette.leaf}"/>`);
    }
  }
  if (spec.extras.includes("diya")) {
    const lx = dx + dw + 16;
    if (lit) p.push(`<circle cx="${lx}" cy="${G - 74}" r="34" fill="url(#cpGlow)"/>`);
    p.push(`<path d="M${lx} ${G - 88} v6" stroke="${palette.ink}" stroke-width="2"/>`);
    p.push(`<path d="M${lx - 7} ${G - 82} h14 l-2 14 h-10z" fill="${palette.ink}" opacity=".85"/>`);
    p.push(`<rect x="${lx - 4}" y="${G - 79}" width="8" height="9" rx="1.5" fill="${lit ? palette.glow : "#C9B48A"}"/>`);
  }

  // name sign on the pavement
  if (o.showName !== false && spec.name) {
    const label = esc(spec.name.slice(0, 16));
    const sw = Math.max(74, Math.min(138, spec.name.slice(0, 16).length * 8.2 + 28));
    const sy = G + 14;
    const sx = HOUSE_W / 2 - sw / 2;
    p.push(`<rect x="${sx}" y="${sy + 3}" width="${sw}" height="24" rx="12" fill="${palette.ink}" opacity=".2"/>`);
    p.push(`<rect x="${sx}" y="${sy}" width="${sw}" height="24" rx="12" fill="${palette.paper}"/>`);
    p.push(`<text x="${HOUSE_W / 2}" y="${sy + 16.5}" text-anchor="middle" font-family="'Baloo 2', 'Mukta', sans-serif" font-weight="700" font-size="13" fill="${palette.ink}">${label}</text>`);
  }

  // the sparrow that came back
  if (o.sparrow !== false) {
    const nx = spec.style === "khaprail" ? X + W - 18 : X + W - 2;
    const ny = spec.style === "khaprail" ? top - 4 : top - 19;
    p.push(miniSparrowSVG(nx, ny, true, 1.05, "mini-sparrow roof-sparrow"));
  }

  return `<g class="house">${p.join("")}</g>`;
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

export function treeSVG(x: number, ground: number, s = 1): string {
  return (
    `<g transform="translate(${x} ${ground}) scale(${s})">` +
    `<path d="M-7 0 L-4 -64 H4 L7 0Z" fill="#7A4A2C"/>` +
    `<circle cx="0" cy="-84" r="34" fill="${palette.leaf}"/><circle cx="-27" cy="-66" r="22" fill="${palette.leafDark}"/>` +
    `<circle cx="25" cy="-64" r="24" fill="${palette.leafDark}"/><circle cx="8" cy="-104" r="20" fill="#5DB07C"/>` +
    `</g>`
  );
}

/** Electricity poles with sagging wires, a very Indian street signature. */
export function polesSVG(width: number, ground: number, step: number, lit: boolean): string {
  const p: string[] = [];
  const poleTop = ground - 300;
  const xs: number[] = [];
  for (let x = step / 2; x < width + step / 2; x += step) xs.push(x);
  xs.forEach((x, i) => {
    const x2 = xs[i + 1];
    if (x2 !== undefined) {
      p.push(`<path d="M${x + 14} ${poleTop + 10} Q${(x + x2) / 2} ${poleTop + 46} ${x2 - 14} ${poleTop + 10}" stroke="#3B4357" stroke-width="1.8" fill="none" opacity=".8"/>`);
      p.push(`<path d="M${x - 14} ${poleTop + 10} Q${(x + x2) / 2} ${poleTop + 58} ${x2 + 14} ${poleTop + 10}" stroke="#3B4357" stroke-width="1.6" fill="none" opacity=".6"/>`);
    }
    p.push(`<rect x="${x - 3.5}" y="${poleTop}" width="7" height="${ground - poleTop}" fill="#5B6478"/>`);
    p.push(`<rect x="${x - 18}" y="${poleTop + 7}" width="36" height="5" rx="2.5" fill="#5B6478"/>`);
    p.push(`<path d="M${x} ${poleTop + 34} h16 v10" stroke="#5B6478" stroke-width="3" fill="none"/>`);
    p.push(`<circle cx="${x + 16}" cy="${poleTop + 48}" r="${lit ? 6 : 4.5}" fill="${lit ? palette.glow : "#C9B48A"}"/>`);
    if (lit) p.push(`<circle cx="${x + 16}" cy="${poleTop + 48}" r="56" fill="url(#cpGlow)"/>`);
  });
  return p.join("");
}

/** Sky, sun or moon, clouds or stars, distant rooftops. */
export function backdropSVG(width: number, height: number, ground: number, lit: boolean, idSuffix = ""): string {
  const p: string[] = [];
  const gid = (lit ? "skyN" : "skyD") + idSuffix;
  p.push(
    `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">` +
      (lit
        ? `<stop offset="0" stop-color="#1B2448"/><stop offset=".72" stop-color="#3B3F78"/><stop offset="1" stop-color="#835E8E"/>`
        : `<stop offset="0" stop-color="#A9DCEF"/><stop offset=".72" stop-color="#D9F1F4"/><stop offset="1" stop-color="#FFE9C9"/>`) +
      `</linearGradient></defs>`,
  );
  p.push(GLOW_DEF);
  p.push(`<rect width="${width}" height="${height}" fill="url(#${gid})"/>`);
  if (lit) {
    for (let i = 0; i < Math.floor(width / 28); i++) {
      const x = (i * 97.3) % width;
      const y = 16 + ((i * 53.7) % (ground * 0.5));
      p.push(`<circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(i % 3) * 0.6 + 1}" fill="#FFF6E9" opacity="${(0.45 + (i % 4) * 0.13).toFixed(2)}"/>`);
    }
    p.push(`<circle cx="${width - 150}" cy="80" r="30" fill="#FFF1C9"/><circle cx="${width - 137}" cy="71" r="27" fill="#232C58"/>`);
  } else {
    p.push(`<circle cx="${width - 160}" cy="86" r="64" fill="#FFE3A3" opacity=".35"/><circle cx="${width - 160}" cy="86" r="40" fill="#FFE3A3"/>`);
    for (let i = 0; i < Math.ceil(width / 380); i++) {
      const cx = 110 + i * 380 + (i % 2) * 70;
      const cy = 64 + (i % 3) * 26;
      p.push(`<g class="cloud"><ellipse cx="${cx}" cy="${cy}" rx="48" ry="16" fill="#fff"/><circle cx="${cx - 14}" cy="${cy - 10}" r="18" fill="#fff"/><circle cx="${cx + 15}" cy="${cy - 14}" r="22" fill="#fff"/></g>`);
    }
  }
  const far2 = lit ? "#353E72" : "#CFE6DE";
  const far = lit ? "#2B335F" : "#B4D6D0";
  const skyline = (seed: number, minH: number, varH: number, fill: string, domes: boolean) => {
    let x = -10;
    let k = seed;
    const d: string[] = [`M0 ${ground}`];
    while (x < width + 80) {
      const h = minH + ((k * 37) % varH);
      const w = 52 + ((k * 23) % 46);
      d.push(`L${x} ${ground - h} L${x + w} ${ground - h}`);
      if (domes && k % 5 === 0) {
        d.push(`L${x + w} ${ground - h - 10} Q${x + w + 18} ${ground - h - 44} ${x + w + 36} ${ground - h - 10} L${x + w + 36} ${ground - h}`);
        x += 36;
      }
      x += w;
      k++;
    }
    d.push(`L${width} ${ground} Z`);
    return `<path d="${d.join(" ")}" fill="${fill}"/>`;
  };
  p.push(skyline(1, 110, 70, far2, false));
  p.push(skyline(4, 60, 50, far, true));
  return p.join("");
}

export function groundSVG(width: number, height: number, ground: number, lit: boolean): string {
  const road = lit ? "#4F4766" : palette.street;
  const curb = lit ? "#665B80" : "#D9B184";
  const p = [`<rect y="${ground}" width="${width}" height="${height - ground}" fill="${road}"/>`, `<rect y="${ground}" width="${width}" height="10" fill="${curb}"/>`];
  for (let x = 24; x < width; x += 96) {
    p.push(`<rect x="${x}" y="${ground + 40}" width="46" height="6" rx="3" fill="${lit ? "#6C6386" : "#F3DDBB"}"/>`);
  }
  return p.join("");
}

/** Brand mark: Chiku's face in a marigold circle (64x64). */
export function markSVG(): string {
  return (
    `<circle cx="32" cy="32" r="31" fill="${palette.marigold}"/>` +
    `<circle cx="33" cy="38" r="21" fill="${palette.sparrow}"/>` +
    `<ellipse cx="35" cy="42" rx="15" ry="11" fill="${palette.face}"/>` +
    `<circle cx="29.5" cy="40" r="3.8" fill="${palette.ink}"/><circle cx="28.4" cy="38.6" r="1.3" fill="#fff"/>` +
    `<circle cx="41.5" cy="40" r="3.4" fill="${palette.ink}"/><circle cx="40.5" cy="38.8" r="1.1" fill="#fff"/>` +
    `<path d="M34.5 44 L41 46 L34.5 48Z" fill="#D88A35"/>` +
    `<path d="M13 26 C14 9 52 8 54 25 Z" fill="${palette.ink}"/>` +
    `<rect x="9" y="23" width="49" height="6" rx="3" fill="${palette.ink}"/>`
  );
}
