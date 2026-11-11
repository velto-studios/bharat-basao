"use client";

import { backdropSVG, groundSVG, houseSVG, HOUSE_H, HOUSE_W, palette } from "./art";
import type { MyHouse } from "./store";

/** Draws a 1080x1350 share card on a canvas and downloads it as PNG. */
export async function downloadCard(h: MyHouse) {
  const W = 1080;
  const H = 1350;
  const ground = 1000;
  const scale = 2.6;
  const hx = (W - HOUSE_W * scale) / 2;
  const hy = ground - HOUSE_H * scale;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">` +
    backdropSVG(W, H, ground, false, "c") +
    groundSVG(W, H, ground, false) +
    `<g transform="translate(${hx} ${hy}) scale(${scale})">${houseSVG(h, { showName: false })}</g>` +
    `</svg>`;

  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("card image failed"));
      img.src = url;
    });
    try {
      await Promise.all([document.fonts.load('800 64px "Baloo 2"'), document.fonts.load('600 32px "Mukta"')]);
    } catch {
      /* fall back to system fonts */
    }
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    ctx.textAlign = "center";
    ctx.fillStyle = palette.ink;
    ctx.font = '800 76px "Baloo 2", sans-serif';
    ctx.fillText(`${h.name} ka ghar`, W / 2, 150);
    ctx.font = '600 40px "Mukta", sans-serif';
    ctx.fillStyle = palette.inkSoft;
    ctx.fillText(`${h.city} · Akhand Bharat ka naya ghar`, W / 2, 210);
    // bottom band
    ctx.fillStyle = palette.ink;
    ctx.fillRect(0, H - 170, W, 170);
    ctx.fillStyle = palette.paper;
    ctx.font = '800 54px "Baloo 2", sans-serif';
    ctx.fillText("Bharat Basao", W / 2, H - 92);
    ctx.font = '600 32px "Mukta", sans-serif';
    ctx.fillStyle = palette.glow;
    ctx.fillText("@velto_studios par apna shehar comment karo", W / 2, H - 44);
    const a = document.createElement("a");
    a.download = `bharat-basao-${h.name.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
