"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LAND_PATH, MAP_W, MAP_H, CITIES, RIVERS } from "@/data/map";
import { chikuSVG, palette } from "@/lib/art";
import { BUILT, landmarkSVG } from "@/lib/landmarks";
import { findCity, searchCities, smoothPath, type City } from "@/lib/geo";

type VB = { x: number; y: number; w: number };
const FULL: VB = { x: 0, y: 0, w: MAP_W };
const MIN_W = 220;

interface Props {
  counts: Record<string, number>;
  selected: string | null;
  mine: string | null;
  onSelect: (city: string) => void;
  onOpenGali: (city: string) => void;
  onBuildHere: (city: string) => void;
}

/* ---------- static decoration, computed once ---------- */

function at(name: string) {
  const c = findCity(name);
  return c ? [c.x, c.y] : [0, 0];
}

const MOUNTAINS: [number, number, number][] = (() => {
  const ridge = ["Srinagar", "Leh", "Shimla", "Dehradun", "Pokhara", "Kathmandu", "Gangtok", "Thimphu", "Dibrugarh"].map(at);
  const out: [number, number, number][] = [];
  for (let i = 0; i < ridge.length - 1; i++) {
    const [x1, y1] = ridge[i];
    const [x2, y2] = ridge[i + 1];
    const steps = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / 26));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t - 26 - ((i + s) % 2) * 10, 1 + ((i * 3 + s) % 3) * 0.18]);
    }
  }
  return out;
})();

const TREES: [number, number][] = [
  ...["Raipur", "Jabalpur", "Ranchi", "Bhubaneswar", "Mandalay", "Naypyidaw", "Shillong", "Imphal", "Kozhikode", "Mysuru", "Kandy"].map((n, i) => {
    const [x, y] = at(n);
    return [x + ((i % 3) - 1) * 16, y + 18] as [number, number];
  }),
  ...["Jabalpur", "Raipur", "Mandalay"].map((n) => {
    const [x, y] = at(n);
    return [x + 22, y - 6] as [number, number];
  }),
];

const DUNES: [number, number][] = ["Jaisalmer", "Bikaner", "Jodhpur", "Multan"].map((n, i) => {
  const [x, y] = at(n);
  return [x - 14 + i * 3, y + 12];
});

/* ---------- component ---------- */

export default function BharatMap({ counts, selected, mine, onSelect, onOpenGali, onBuildHere }: Props) {
  const [vb, setVb] = useState<VB>(FULL);
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<number | null>(null);
  const drag = useRef<{ px: number; py: number; vb: VB; moved: boolean; id: number } | null>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const clamp = (v: VB): VB => {
    const w = Math.min(MAP_W, Math.max(MIN_W, v.w));
    const h = (w * MAP_H) / MAP_W;
    return { w, x: Math.min(MAP_W - w, Math.max(0, v.x)), y: Math.min(MAP_H - h, Math.max(0, v.y)) };
  };

  const animateTo = useCallback((target: VB) => {
    const to = clamp(target);
    if (anim.current) cancelAnimationFrame(anim.current);
    if (reduce.current) {
      setVb(to);
      return;
    }
    setVb((from) => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 650);
        const e = 1 - Math.pow(1 - t, 3);
        setVb({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e });
        if (t < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
      return from;
    });
  }, []);

  const zoomBy = useCallback(
    (f: number, cx?: number, cy?: number) => {
      setVb((v) => {
        const px = cx ?? v.x + v.w / 2;
        const py = cy ?? v.y + (v.w * MAP_H) / MAP_W / 2;
        const w = v.w * f;
        return clamp({ w, x: px - ((px - v.x) * w) / v.w, y: py - ((py - v.y) * w) / v.w });
      });
    },
    [],
  );

  const focusCity = useCallback(
    (c: City) => {
      onSelect(c.name);
      animateTo({ w: 360, x: c.x - 180, y: c.y - 200 });
    },
    [animateTo, onSelect],
  );

  // wheel zoom (needs a non-passive listener)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setVb((v) => {
        const px = v.x + ((e.clientX - r.left) / r.width) * v.w;
        const py = v.y + ((e.clientY - r.top) / r.height) * ((v.w * MAP_H) / MAP_W);
        const w = v.w * (e.deltaY > 0 ? 1.12 : 0.89);
        return clamp({ w, x: px - ((px - v.x) * w) / v.w, y: py - ((py - v.y) * w) / v.w });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { px: e.clientX, py: e.clientY, vb, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = svgRef.current;
    if (!d || !el || d.id !== e.pointerId) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    if (!d.moved) {
      d.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    const k = d.vb.w / el.getBoundingClientRect().width;
    setVb(clamp({ w: d.vb.w, x: d.vb.x - dx * k, y: d.vb.y - dy * k }));
  };
  const onPointerUp = () => {
    setTimeout(() => (drag.current = null), 0);
  };

  const zoomed = vb.w < 620;
  const s = vb.w / MAP_W; // keep pins a constant screen size
  const sel = selected ? findCity(selected) : null;
  const results = useMemo(() => searchCities(query), [query]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const rivers = useMemo(() => Object.entries(RIVERS).map(([k, pts]) => ({ k, d: smoothPath(pts as [number, number][]) })), []);
  const nagpur = findCity("Nagpur")!;

  return (
    <div className="map-shell">
      <div className="map-tools">
        <div className="search">
          <label htmlFor="city-search" className="sr-only">
            Shehar dhundo
          </label>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
            <path d="M15.5 15.5 L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <input
            id="city-search"
            type="search"
            placeholder="Apna shehar dhundo: Kanpur, Dhaka, Lahore..."
            value={query}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                focusCity(results[0]);
                setQuery("");
              }
            }}
          />
          {results.length > 0 && (
            <ul className="search-results" role="listbox" aria-label="Shehar">
              {results.map((c) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => {
                      focusCity(c);
                      setQuery("");
                    }}
                  >
                    <span>{c.name}</span>
                    <small>{counts[c.name] ? `${counts[c.name]} ghar` : "khaali"}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.trim().length > 1 && results.length === 0 && (
            <p className="search-empty">Yeh shehar abhi naqshe par nahi hai. Reel par comment karo, Chiku jod dega.</p>
          )}
        </div>
        <div className="zoom" role="group" aria-label="Naksha zoom">
          <button type="button" onClick={() => zoomBy(0.75)} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomBy(1.33)} aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={() => animateTo(FULL)} aria-label="Poora naksha" className="zoom-reset">
            ⤢
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        className={`map ${vb.w < MAP_W - 1 ? "is-zoomed" : ""}`}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${(vb.w * MAP_H) / MAP_W}`}
        role="application"
        aria-label={`Akhand Bharat ka naksha. ${total} ghar. Shehar chunne ke liye search karein ya pin dabayein.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="waves" width="46" height="22" patternUnits="userSpaceOnUse">
            <path d="M2 12 Q8 6 14 12 T26 12" stroke="#BFE6EF" strokeWidth="2" fill="none" strokeLinecap="round" />
          </pattern>
          <radialGradient id="seaG" cx="50%" cy="45%" r="75%">
            <stop offset="0" stopColor="#A8DCE8" />
            <stop offset="1" stopColor="#7FC2D6" />
          </radialGradient>
          <linearGradient id="landG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F7E7C4" />
            <stop offset="1" stopColor="#F1D9A8" />
          </linearGradient>
        </defs>
        <rect x="-50" y="-50" width={MAP_W + 100} height={MAP_H + 100} fill="url(#seaG)" />
        <rect x="-50" y="-50" width={MAP_W + 100} height={MAP_H + 100} fill="url(#waves)" opacity=".7" />
        <g className="sea-labels" fontFamily="'Baloo 2', sans-serif" fontWeight="700" fill="#4E8FA6" opacity=".75">
          <text x="130" y="700" fontSize="26">Arab Sagar</text>
          <text x="640" y="760" fontSize="24">Bangal ki Khadi</text>
          <text x="330" y="960" fontSize="28">Hind Mahasagar</text>
        </g>
        {/* paper-cut land with offset shadow */}
        <path d={LAND_PATH} fill="#C99A5B" opacity=".45" transform="translate(5 8)" />
        <path d={LAND_PATH} fill="#FFF6E9" stroke="#FFF6E9" strokeWidth="10" strokeLinejoin="round" />
        <path d={LAND_PATH} fill="url(#landG)" stroke="#D9B27A" strokeWidth="2" strokeLinejoin="round" />

        {/* terrain */}
        <g aria-hidden="true">
          {DUNES.map(([x, y], i) => (
            <path key={`d${i}`} d={`M${x} ${y} q10 -9 20 0 q10 -9 20 0`} stroke="#E0B36A" strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}
          {MOUNTAINS.map(([x, y, k], i) => (
            <g key={`m${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k})`}>
              <path d="M-16 10 L0 -14 L16 10Z" fill="#B8A58C" />
              <path d="M0 -14 L16 10 H4Z" fill="#9C8A73" />
              <path d="M-6 -5 L0 -14 L6 -5 L2 -7 L0 -4 L-2 -7Z" fill="#FFFFFF" />
            </g>
          ))}
          {TREES.map(([x, y], i) => (
            <g key={`t${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <rect x="-1.5" y="0" width="3" height="7" fill="#7A4A2C" />
              <circle cx="0" cy="-3" r="7" fill={i % 2 ? palette.leaf : palette.leafDark} />
            </g>
          ))}
          {rivers.map((r) => (
            <path key={r.k} d={r.d} stroke="#7CC3DB" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>

        {/* built landmarks */}
        {BUILT.map((l) => {
          const c = findCity(l.city);
          if (!c) return null;
          const k = Math.max(0.55, s * 1.1);
          return (
            <g key={l.id} transform={`translate(${c.x + (l.dx ?? 0) - 30 * k} ${c.y + (l.dy ?? 0) - 56 * k}) scale(${k})`} aria-hidden="true">
              <g dangerouslySetInnerHTML={{ __html: landmarkSVG(l.kind) }} />
            </g>
          );
        })}

        {/* Chiku at Zero Mile */}
        <g transform={`translate(${nagpur.x + 18 * Math.max(0.6, s)} ${nagpur.y - 52 * Math.max(0.6, s)}) scale(${0.3 * Math.max(0.6, s)})`} aria-hidden="true">
          <g className="map-chiku" dangerouslySetInnerHTML={{ __html: chikuSVG({ mood: "happy", wing: "wave" }) }} />
        </g>

        {/* cities */}
        {CITIES.map((c) => {
          const n = counts[c.name] ?? 0;
          const isSel = selected === c.name;
          const isMine = mine === c.name;
          const showLabel = zoomed || n > 0 || isSel || isMine || hover === c.name;
          const r = (n > 0 || isMine ? 7 : 4) * Math.max(0.55, s);
          return (
            <g
              key={c.name}
              className={`city ${isSel ? "is-selected" : ""}`}
              transform={`translate(${c.x} ${c.y})`}
              tabIndex={0}
              role="button"
              aria-label={`${c.name}: ${n ? `${n} ghar` : "abhi khaali"}${isMine ? ", aapka ghar yahan hai" : ""}`}
              onPointerEnter={() => setHover(c.name)}
              onPointerLeave={() => setHover((h) => (h === c.name ? null : h))}
              onClick={() => {
                if (drag.current?.moved) return;
                focusCity(c);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  focusCity(c);
                }
              }}
            >
              <circle r={r * 2.6} fill="transparent" />
              {(isSel || isMine) && <circle r={r * 2.2} fill={palette.marigold} opacity=".25" className="pulse" />}
              <circle r={r} fill={isMine ? palette.roof : n > 0 ? palette.marigold : "#C49A62"} stroke="#FFF6E9" strokeWidth={1.6 * Math.max(0.55, s)} />
              {showLabel && (
                <g transform={`scale(${Math.max(0.55, s)})`} pointerEvents="none">
                  <rect x="9" y="-11" width={c.name.length * 7.4 + (n || isMine ? 30 : 12)} height="21" rx="10.5" fill={isSel ? palette.ink : "rgba(31,42,68,.82)"} />
                  <text x="15" y="4" fill="#FFF6E9" fontSize="12.5" fontWeight="700" fontFamily="'Baloo 2', sans-serif">
                    {c.name}
                    {n || isMine ? <tspan fill={palette.glow}>{`  ${n + (isMine ? 1 : 0)}`}</tspan> : null}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {sel && (
        <div className="city-card" role="dialog" aria-label={`${sel.name} ki jaankari`}>
          <div>
            <p className="eyebrow">Shehar</p>
            <h3>{sel.name}</h3>
            <p className="muted">
              {(counts[sel.name] ?? 0) === 0 && mine !== sel.name
                ? "Abhi yahan koi ghar nahi. Pehla ghar aapka ho sakta hai."
                : `${(counts[sel.name] ?? 0) + (mine === sel.name ? 1 : 0)} ghar${mine === sel.name ? ", aapka bhi" : ""}`}
            </p>
          </div>
          <div className="city-card-actions">
            <button type="button" className="btn btn-small" onClick={() => onOpenGali(sel.name)}>
              Gali dekho
            </button>
            <button type="button" className="btn btn-small btn-ghost" onClick={() => onBuildHere(sel.name)}>
              Yahan ghar basao
            </button>
          </div>
          <button type="button" className="city-card-close" aria-label="Band karo" onClick={() => onSelect("")}>
            ×
          </button>
        </div>
      )}
      <p className="map-hint">Pin dabao · zoom ke baad khinch ke ghoomo · + / − se zoom</p>
    </div>
  );
}
