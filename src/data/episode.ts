import type { HouseSpec } from "@/lib/art";

/**
 * Public, permanent state of the map. Updated once per episode from the
 * comments on @velto_studios Reels (followers only, one comment per person).
 */
export const EPISODE = {
  day: 1,
  title: "Din 1: Khaali naksha",
  date: "2026-11-11",
  summary: "Naksha khaali hai. Chiku Mistri ne Zero Mile, Nagpur se shuruaat ki hai. Pehla ghar aapka ho sakta hai.",
};

export interface PublicHouse extends HouseSpec {
  id: string;
  city: string;
  handle?: string; // Instagram handle, only with the person's own comment as consent
  day: number;
}

/** Day 1: nobody lives here yet. Houses are added from Reel comments each episode. */
export const PUBLIC_HOUSES: PublicHouse[] = [];
