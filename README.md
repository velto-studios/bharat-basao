# Bharat Basao

**Akhand Bharat. Ghar ghar se.** An illustrated map of the undivided subcontinent that followers settle together, one named house at a time. A Velto Studios project.

Live: https://bharat-basao.vercel.app

![Bharat Basao](public/og.png)

## What it does

- **Interactive naksha.** A hand-styled, paper-cut map (no stock 3D) with mountains, rivers, 98 cities, pan, zoom and city search. Day 1 starts at Zero Mile, Nagpur.
- **Gali view.** Tap any city to open its illustrated street: every house carries its owner's name, a sparrow sits on every roof, and a day/night toggle lights the windows and street lamps. Empty plots invite the first resident.
- **Ghar basao builder.** Pick a name, city, house style (Chhat wala, Khaprail, Chhatri), wall colour, door and decorations. The house appears in that city's gali at once, and you can download a 1080×1350 share card.
- **Nirmaan voting.** Choose which landmark should be built next. The public decision comes from Reel comments.
- **Chiku Mistri.** An original sparrow-builder mascot with blinking eyes that follow the pointer, moods, poses and lines in Hinglish.
- **Honest data model.** Public houses live in `src/data/episode.ts` and are updated each episode from Instagram comments. A visitor's own house is stored only in their browser (`localStorage`) until it is added publicly. Nothing is sent to a server.

## Stack

Next.js 16 (App Router, static output) · React 19 · TypeScript (strict) · plain CSS · self-hosted fonts (`@fontsource/baloo-2`, `@fontsource/mukta`). No animation or UI library: all art is SVG generated from `src/lib/art.ts`, which the Reel renderer also uses.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run verify     # typecheck + lint + production build
```

Node 20 or newer. No environment variables are required. `NEXT_PUBLIC_SITE_URL` (see `.env.example`) only sets the Open Graph base URL.

## Add an episode

1. Read the comments on the latest Reel (followers only, one comment per person).
2. Add each house to `PUBLIC_HOUSES` in `src/data/episode.ts` (`city` must match a name in `src/data/map.ts`).
3. Move the winning landmark from `WISHLIST` to `BUILT` in `src/lib/landmarks.ts`.
4. Bump `EPISODE.day`, push to `main`. Vercel deploys automatically.

## Project structure

```
src/
  app/            layout, page, global styles
  components/     Experience (state), BharatMap, Gali, Builder, Chiku
  data/           map.ts (generated outline, cities, rivers), episode.ts (public houses)
  lib/            art.ts (all illustrations), landmarks.ts, geo.ts, store.ts, card.ts
scripts/          build-map.cjs + cities.json (regenerates src/data/map.ts)
public/           og.png, icon.svg
```

## Credits and licences

- Illustrations, mascot (Chiku Mistri), copy and code: original work by Velto Studios, 2026.
- Coastline data: [Natural Earth](https://www.naturalearthdata.com/) 1:50m, public domain, via the `world-atlas` package.
- Fonts: Baloo 2 and Mukta, SIL Open Font License 1.1.

The map is a creative, imagined depiction for a community game. It is not a political or official boundary map.
