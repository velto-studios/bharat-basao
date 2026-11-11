"use client";

import { useMemo, useState } from "react";
import { EXTRAS, HOUSE_BOX_H, HOUSE_W, STYLES, WALLS, houseSVG, palette, type ExtraId, type HouseSpec, type StyleId, type WallId } from "@/lib/art";
import { findCity, searchCities } from "@/lib/geo";
import { useMyHouse } from "@/lib/store";
import { downloadCard } from "@/lib/card";

interface Props {
  preset: { city: string; n: number } | null;
  onBuilt: (city: string) => void;
}

const NAME_RE = /^[\p{L}\p{M}0-9 ._'-]{2,16}$/u;

export default function Builder({ preset, onBuilt }: Props) {
  const [mine, setMine] = useMyHouse();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [style, setStyle] = useState<StyleId>("chhat");
  const [wall, setWall] = useState<WallId>("gulabi");
  const [extras, setExtras] = useState<ExtraId[]>(["paudhe", "toran"]);
  const [door, setDoor] = useState(0);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityFocus, setCityFocus] = useState(false);

  // a "Yahan ghar basao" click elsewhere pre-fills the city (state adjusted during render, no effect)
  const [seenPreset, setSeenPreset] = useState(preset);
  if (preset !== seenPreset) {
    setSeenPreset(preset);
    if (preset) {
      setCity(preset.city);
      setEditing(true);
    }
  }

  const startEdit = () => {
    if (mine) {
      setName(mine.name);
      setCity(mine.city);
      setStyle(mine.style);
      setWall(mine.wall);
      setExtras(mine.extras);
      setDoor(mine.door);
    }
    setEditing(true);
  };

  const spec: HouseSpec = { name: name.trim() || "Aapka naam", style, wall, extras, door };
  const preview = useMemo(() => houseSVG(spec, {}), [spec.name, style, wall, extras, door]); // eslint-disable-line react-hooks/exhaustive-deps
  const suggestions = cityFocus ? searchCities(city, 6) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const c = findCity(city);
    if (!NAME_RE.test(n)) return setError("Naam 2 se 16 akshar ka ho (letters, numbers, space, . _ - ').");
    if (!c) return setError("List mein se shehar chuno. Aapka shehar nahi hai? Reel par comment karo, hum jod denge.");
    setError(null);
    setMine({ name: n, city: c.name, style, wall, extras, door, createdAt: new Date().toISOString() });
    setEditing(false);
    onBuilt(c.name);
  };

  if (mine && !editing) {
    return (
      <div className="builder done">
        <div className="builder-preview">
          <svg viewBox={`0 0 ${HOUSE_W} ${HOUSE_BOX_H}`} role="img" aria-label={`${mine.name} ka ghar, ${mine.city}`} dangerouslySetInnerHTML={{ __html: houseSVG(mine, {}) }} />
        </div>
        <div className="builder-form">
          <p className="eyebrow">Ghar bas gaya</p>
          <h3>
            {mine.name} ka ghar, {mine.city}
          </h3>
          <p>Chhat par ek gauraiya bhi aa gayi. Ab is ghar ko sabke naqshe par pakka karo:</p>
          <ol className="steps-mini">
            <li>
              Instagram par <strong>@velto_studios</strong> follow karo.
            </li>
            <li>
              Latest Reel par ek comment: <code>{`${mine.city} · ${mine.name}`}</code>
            </li>
            <li>Agle episode mein Chiku aapka ghar public naqshe par bana dega.</li>
          </ol>
          <p className="note">Abhi yeh ghar sirf is phone ya laptop par dikh raha hai. Public naqsha har episode mein comments se update hota hai.</p>
          <div className="row">
            <button type="button" className="btn" onClick={() => downloadCard(mine)}>
              Ghar ka card download karo
            </button>
            <button type="button" className="btn btn-ghost" onClick={startEdit}>
              Badlo
            </button>
            <button
              type="button"
              className="btn btn-text"
              onClick={() => {
                if (window.confirm("Yeh ghar is device se hata dein?")) setMine(null);
              }}
            >
              Hatao
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="builder" onSubmit={submit} noValidate>
      <div className="builder-preview" aria-live="polite">
        <svg viewBox={`0 0 ${HOUSE_W} ${HOUSE_BOX_H}`} role="img" aria-label="Aapke ghar ka preview" dangerouslySetInnerHTML={{ __html: preview }} />
        <button type="button" className="btn btn-text" onClick={() => setDoor((d) => (d + 1) % 4)}>
          Darwaze ka rang badlo
        </button>
      </div>
      <div className="builder-form">
        <div className="field">
          <label htmlFor="b-name">Ghar par naam</label>
          <input id="b-name" value={name} maxLength={16} placeholder="Jaise: Riya ya @riya.k" onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field city-field">
          <label htmlFor="b-city">Shehar</label>
          <input
            id="b-city"
            value={city}
            placeholder="Shehar likho aur list se chuno"
            autoComplete="off"
            onFocus={() => setCityFocus(true)}
            onBlur={() => setTimeout(() => setCityFocus(false), 150)}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          {suggestions.length > 0 && !findCity(city) && (
            <ul className="search-results" role="listbox" aria-label="Shehar">
              {suggestions.map((c) => (
                <li key={c.name}>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setCity(c.name)}>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <fieldset className="field">
          <legend>Ghar ka style</legend>
          <div className="choice-row">
            {STYLES.map((s) => (
              <label key={s.id} className={`choice ${style === s.id ? "on" : ""}`}>
                <input type="radio" name="style" value={s.id} checked={style === s.id} onChange={() => setStyle(s.id)} />
                <strong>{s.label}</strong>
                <small>{s.note}</small>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>Deewar ka rang</legend>
          <div className="swatches">
            {WALLS.map((w) => (
              <label key={w.id} className={`swatch ${wall === w.id ? "on" : ""}`} style={{ background: w.hex }} title={w.label}>
                <input type="radio" name="wall" value={w.id} checked={wall === w.id} onChange={() => setWall(w.id)} />
                <span className="sr-only">{w.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>Sajavat</legend>
          <div className="choice-row">
            {EXTRAS.map((x) => {
              const on = extras.includes(x.id);
              return (
                <label key={x.id} className={`chip ${on ? "on" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => setExtras((xs) => (on ? xs.filter((i) => i !== x.id) : [...xs, x.id]))} />
                  {x.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="row">
          <button type="submit" className="btn">
            Ghar basao
          </button>
          {mine && (
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
              Rehne do
            </button>
          )}
        </div>
        <p className="note" style={{ color: palette.inkSoft }}>
          Naam aur shehar sirf aapke device par save hote hain. Hum koi data server par nahi bhejte.
        </p>
      </div>
    </form>
  );
}
