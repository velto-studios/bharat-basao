"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { backdropSVG, chikuSVG, groundSVG, houseSVG, polesSVG, treeSVG, HOUSE_W, HOUSE_H, palette, esc, type HouseSpec } from "@/lib/art";

export interface GaliHouse extends HouseSpec {
  id: string;
  mine?: boolean;
  handle?: string;
}

interface Props {
  city: string;
  houses: GaliHouse[];
  onBuild: () => void;
}

const SLOT = 196;
const GROUND = 344;
const H = 410;

export default function Gali({ city, houses, onBuild }: Props) {
  const [night, setNight] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const slots = Math.max(5, houses.length + 2);
  const width = 80 + slots * SLOT + 240;

  const svg = useMemo(() => {
    const p: string[] = [];
    p.push(backdropSVG(width, H, GROUND, night, "g"));
    p.push(polesSVG(width, GROUND, 520, night));
    p.push(treeSVG(36, GROUND, 0.9));
    p.push(groundSVG(width, H, GROUND, night));
    for (let i = 0; i < slots; i++) {
      const x = 80 + i * SLOT;
      const h = houses[i];
      if (h) {
        p.push(`<g transform="translate(${x} ${GROUND - HOUSE_H})">${houseSVG(h, { lit: night, highlight: h.mine })}</g>`);
      } else {
        // empty plot
        const cx = x + HOUSE_W / 2;
        p.push(
          `<g class="plot"><rect x="${x + 14}" y="${GROUND - 120}" width="${HOUSE_W - 28}" height="112" rx="12" fill="${night ? "#ffffff10" : "#ffffff55"}" stroke="${night ? "#9E93C0" : "#C9A46A"}" stroke-width="2.5" stroke-dasharray="9 8"/>` +
            `<path d="M${cx} ${GROUND - 8} V${GROUND - 70}" stroke="#7A4A2C" stroke-width="4"/>` +
            `<rect x="${cx - 46}" y="${GROUND - 98}" width="92" height="34" rx="6" fill="${palette.paper}" stroke="#7A4A2C" stroke-width="2.5"/>` +
            `<text x="${cx}" y="${GROUND - 76}" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="14" fill="${palette.ink}">Khaali plot</text></g>`,
        );
      }
    }
    // Chiku waits at the first empty plot
    const free = houses.length;
    const cx = 80 + free * SLOT + HOUSE_W / 2 + 38;
    p.push(`<g transform="translate(${cx} ${GROUND - 96}) scale(.52)"><g class="gali-chiku">${chikuSVG({ mood: night ? "sleepy" : "joy", wing: "wave" })}</g></g>`);
    // city board
    p.push(
      `<g transform="translate(${width - 120} ${GROUND - 76})"><rect x="-4" y="0" width="8" height="76" fill="#5B6478"/>` +
        `<rect x="-66" y="-30" width="132" height="40" rx="6" fill="#2F7D4F"/><rect x="-62" y="-26" width="124" height="32" rx="4" fill="none" stroke="#fff" stroke-width="2"/>` +
        `<text x="0" y="-4" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="16" fill="#fff">${esc(city.slice(0, 14))}</text></g>`,
    );
    return p.join("");
  }, [houses, night, slots, width, city]);

  // scroll to my house when it appears
  const mineIndex = houses.findIndex((h) => h.mine);
  useEffect(() => {
    const el = scroller.current;
    if (!el || mineIndex < 0) return;
    const ratio = el.scrollHeight / H;
    el.scrollTo({ left: Math.max(0, (80 + mineIndex * SLOT) * ratio - el.clientWidth / 3), behavior: "smooth" });
  }, [mineIndex, city]);

  return (
    <div className={`gali ${night ? "is-night" : ""}`}>
      <div className="gali-head">
        <div>
          <p className="eyebrow">Gali</p>
          <h3>
            {city} <span className="muted">· {houses.length ? `${houses.length} ghar` : "abhi khaali"}</span>
          </h3>
        </div>
        <div className="gali-actions">
          <button type="button" className="toggle" aria-pressed={night} onClick={() => setNight((n) => !n)}>
            <span aria-hidden="true">{night ? "☀" : "☾"}</span> {night ? "Subah karo" : "Shaam karo"}
          </button>
          <button type="button" className="btn btn-small" onClick={onBuild}>
            Yahan ghar basao
          </button>
        </div>
      </div>
      <div className="gali-scroll" ref={scroller} tabIndex={0} aria-label={`${city} ki gali, side mein scroll karein`}>
        <svg viewBox={`0 0 ${width} ${H}`} style={{ aspectRatio: `${width} / ${H}` }} role="img" aria-label={`${city} ki gali: ${houses.map((h) => h.name).join(", ") || "khaali plot"}`} dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  );
}
