"use client";

import { useEffect, useRef, useState } from "react";
import { chikuSVG, type Mood, type WingPose } from "@/lib/art";

const LINES: { text: string; mood: Mood; wing: WingPose }[] = [
  { text: "Namaste! Main Chiku Mistri. Aaj kya banayein?", mood: "happy", wing: "wave" },
  { text: "Naksha khaali hai... pehla ghar aapka?", mood: "surprised", wing: "rest" },
  { text: "Eent, cement, aur thoda sa pyaar. Bas!", mood: "joy", wing: "up" },
  { text: "Apna shehar batao, gali main bana dunga.", mood: "wink", wing: "wave" },
  { text: "Zero Mile se shuru, poore naqshe tak!", mood: "joy", wing: "wave" },
];

interface Props {
  size?: number;
  mood?: Mood;
  wing?: WingPose;
  talk?: boolean; // clicking cycles through lines
  say?: string | null;
  className?: string;
  label?: string;
}

/** Chiku with blinking eyes that follow the pointer. Respects reduced motion. */
export default function Chiku({ size = 200, mood, wing, talk = false, say, className, label = "Chiku Mistri, ek chhoti gauraiya" }: Props) {
  const ref = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState<[number, number]>([0, 0]);
  const [line, setLine] = useState(-1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        loop();
      }, 2200 + Math.random() * 2600);
    };
    loop();
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.6);
      const dy = e.clientY - (r.top + r.height * 0.42);
      const d = Math.hypot(dx, dy) || 1;
      setLook([+((dx / d) * 3.2).toFixed(1), +((dy / d) * 2.6).toFixed(1)]);
    };
    window.addEventListener("pointermove", move);
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const current = line >= 0 ? LINES[line] : null;
  const svg = chikuSVG({ mood: current?.mood ?? mood ?? "happy", wing: current?.wing ?? wing ?? "rest", look, blink });
  const bubble = say ?? current?.text ?? null;

  const art = (
    <>
      {bubble && (
        <span className="bubble" role="status">
          {bubble}
        </span>
      )}
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden="true" className="chiku-svg" dangerouslySetInnerHTML={{ __html: svg }} />
    </>
  );

  if (!talk) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={`chiku-wrap ${className ?? ""}`} role="img" aria-label={label}>
        {art}
      </div>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={`chiku-wrap chiku-btn ${className ?? ""}`}
      aria-label={`${label}. Baat karne ke liye dabao.`}
      onClick={() => setLine((l) => (l + 1) % LINES.length)}
    >
      {art}
    </button>
  );
}
