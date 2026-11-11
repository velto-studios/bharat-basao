"use client";

import { useCallback, useMemo, useState } from "react";
import BharatMap from "./BharatMap";
import Gali, { type GaliHouse } from "./Gali";
import Builder from "./Builder";
import Chiku from "./Chiku";
import { EPISODE, PUBLIC_HOUSES } from "@/data/episode";
import { BUILT, WISHLIST, landmarkSVG } from "@/lib/landmarks";
import { markSVG } from "@/lib/art";
import { useMyHouse, useVote } from "@/lib/store";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Experience() {
  const [mine] = useMyHouse();
  const [vote, setVote] = useVote();
  const [selected, setSelected] = useState<string | null>(null);
  const [galiCity, setGaliCity] = useState("Nagpur");
  const [preset, setPreset] = useState<{ city: string; n: number } | null>(null);
  const [menu, setMenu] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const h of PUBLIC_HOUSES) c[h.city] = (c[h.city] ?? 0) + 1;
    return c;
  }, []);

  const galiHouses: GaliHouse[] = useMemo(() => {
    const list: GaliHouse[] = PUBLIC_HOUSES.filter((h) => h.city === galiCity);
    if (mine && mine.city === galiCity) list.push({ ...mine, id: "mine", mine: true });
    return list;
  }, [galiCity, mine]);

  const population = PUBLIC_HOUSES.length;

  const openGali = useCallback((city: string) => {
    setGaliCity(city);
    scrollToId("gali");
  }, []);
  const buildHere = useCallback((city: string) => {
    setPreset((p) => ({ city, n: (p?.n ?? 0) + 1 }));
    scrollToId("basao");
  }, []);
  const onBuilt = useCallback((city: string) => {
    setGaliCity(city);
    setSelected(city);
    setTimeout(() => scrollToId("gali"), 60);
  }, []);

  const voted = WISHLIST.find((w) => w.id === vote);

  return (
    <>
      <a href="#naksha" className="skip">
        Seedha naqshe par jao
      </a>
      <header className="topbar">
        <a href="#top" className="brand" aria-label="Bharat Basao, upar jao">
          <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markSVG() }} />
          <span>Bharat Basao</span>
        </a>
        <div className="stats" aria-label="Aaj ka status">
          <span className="pill pill-day">Din {EPISODE.day}</span>
          <span className="pill">
            Jansankhya <strong>{population.toLocaleString("en-IN")}</strong>
            {mine && <em title="Aapka ghar abhi sirf is device par hai"> +1 aap</em>}
          </span>
        </div>
        <button type="button" className="menu-btn" aria-expanded={menu} aria-controls="nav" onClick={() => setMenu((m) => !m)}>
          <span className="sr-only">Menu</span>
          <span aria-hidden="true">{menu ? "×" : "☰"}</span>
        </button>
        <nav id="nav" className={menu ? "open" : ""} onClick={() => setMenu(false)}>
          <a href="#naksha">Naksha</a>
          <a href="#gali">Gali</a>
          <a href="#nirmaan">Nirmaan</a>
          <a href="#kaise">Kaise khele</a>
          <a href="#basao" className="btn btn-small">
            Ghar basao
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Velto Studios · {EPISODE.title}</p>
            <h1>
              Akhand Bharat.
              <br />
              <span className="accent">Ghar ghar se.</span>
            </h1>
            <p className="lead">Ek khaali naksha. Har follower ka ek ghar, uske naam ke saath. Aap jo maango, Chiku Mistri wahi banata hai. Chalo, milke basate hain.</p>
            <div className="row">
              <a href="#basao" className="btn btn-big">
                Apna ghar basao
              </a>
              <a href="#naksha" className="btn btn-ghost btn-big">
                Naksha dekho
              </a>
            </div>
            <ul className="hero-facts">
              <li>
                <strong>{population}</strong> ghar
              </li>
              <li>
                <strong>{BUILT.length}</strong> nirmaan
              </li>
              <li>
                <strong>{WISHLIST.length}</strong> jagah line mein
              </li>
            </ul>
          </div>
          <div className="hero-chiku">
            <Chiku size={300} talk mood="happy" wing="wave" />
            <p className="hero-chiku-hint">Chiku ko dabao</p>
          </div>
        </section>

        <section id="naksha" className="section">
          <div className="section-head">
            <p className="eyebrow">Naksha</p>
            <h2>Zero Mile se shuruaat</h2>
            <p className="muted">Nagpur ka Zero Mile is naqshe ka beech ka point hai. Wahin se Chiku ne pehli eent rakhi. Har pin ek shehar hai: dabao aur uski gali dekho.</p>
          </div>
          <BharatMap counts={counts} selected={selected} mine={mine?.city ?? null} onSelect={(c) => setSelected(c || null)} onOpenGali={openGali} onBuildHere={buildHere} />
        </section>

        <section id="gali" className="section">
          <Gali city={galiCity} houses={galiHouses} onBuild={() => buildHere(galiCity)} />
        </section>

        <section id="basao" className="section">
          <div className="section-head">
            <p className="eyebrow">Ghar basao</p>
            <h2>Apna ghar, apne naam se</h2>
            <p className="muted">Style chuno, rang chuno, thodi sajavat. Ghar turant aapke shehar ki gali mein khada ho jayega.</p>
          </div>
          <Builder preset={preset} onBuilt={onBuilt} />
        </section>

        <section id="nirmaan" className="section">
          <div className="section-head">
            <p className="eyebrow">Nirmaan</p>
            <h2>Agla kya banega? Aap batao.</h2>
            <p className="muted">Har episode mein sabse zyada maangi gayi jagah banti hai. Yahan apni pasand chuno, phir Reel par comment karke vote pakka karo.</p>
          </div>
          <div className="built">
            {BUILT.map((l) => (
              <div key={l.id} className="built-card">
                <svg viewBox="0 0 60 60" width="64" height="64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: landmarkSVG(l.kind) }} />
                <div>
                  <p className="eyebrow">Ban chuka · Din 1</p>
                  <h3>{l.name}</h3>
                  <p className="muted">{l.city}. Akhand Bharat ka pehla nirmaan, naqshe ka beech.</p>
                </div>
              </div>
            ))}
          </div>
          <ul className="wishlist" aria-label="Agle nirmaan ke liye pasand">
            {WISHLIST.map((w) => (
              <li key={w.id}>
                <button type="button" className={`wish ${vote === w.id ? "on" : ""}`} aria-pressed={vote === w.id} onClick={() => setVote(vote === w.id ? null : w.id)}>
                  <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true" dangerouslySetInnerHTML={{ __html: landmarkSVG(w.kind) }} />
                  <span>
                    <strong>{w.name}</strong>
                    <small>{w.city}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="vote-note" aria-live="polite">
            {voted ? (
              <>
                Aapki pasand: <strong>{voted.name}</strong>. Ab Reel par comment karo: <code>{`${voted.name} banao`}</code>
              </>
            ) : (
              "Koi jagah list mein nahi? Reel par comment karo, line mein jod denge."
            )}
          </p>
        </section>
      </main>
    </>
  );
}
