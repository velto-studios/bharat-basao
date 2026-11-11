"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { HouseSpec } from "./art";

export interface MyHouse extends HouseSpec {
  city: string;
  createdAt: string;
}

const HOUSE_KEY = "bb.myHouse.v1";
const VOTE_KEY = "bb.vote.v1";
const EVT = "bb-store";

const memory = new Map<string, string | null>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function snapshot<T>(key: string): T | null {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T | null;
  let value: T | null = null;
  try {
    value = raw ? (JSON.parse(raw) as T) : null;
  } catch {
    value = null;
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: unknown) {
  const raw = value === null ? null : JSON.stringify(value);
  memory.set(key, raw);
  try {
    if (raw === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, raw);
  } catch {
    /* storage blocked (private mode): the in-memory copy keeps this visit working */
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Shared hook: every component using a key re-renders when it changes anywhere on the page. */
function useStored<T>(key: string): [T | null, (v: T | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => snapshot<T>(key),
    () => null,
  );
  const set = useCallback((v: T | null) => write(key, v), [key]);
  return [value, set];
}

export const useMyHouse = () => useStored<MyHouse>(HOUSE_KEY);
export const useVote = () => useStored<string>(VOTE_KEY);
