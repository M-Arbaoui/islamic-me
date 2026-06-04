import { type DailyHabits, EMPTY_HABITS } from "./nafs-stages";

const KEY = "nafs-state-v1";

export type AppState = {
  startDate: string; // ISO date when streak started
  lastDate: string; // last date a habit was logged (YYYY-MM-DD)
  todayHabits: DailyHabits;
  totalRelapses: number;
  bestStreak: number;
  history: { date: string; score: number }[];
  shield: {
    available: boolean;
    lastGrantedAt: string; // ISO
    lastUsedAt?: string; // ISO
    totalUsed: number;
  };
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadState(): AppState {
  if (typeof window === "undefined") return freshState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.shield) {
      parsed.shield = {
        available: true,
        lastGrantedAt: new Date().toISOString(),
        totalUsed: 0,
      };
    } else {
      // Regrant every 30 days
      const last = new Date(parsed.shield.lastGrantedAt).getTime();
      const days = Math.floor((Date.now() - last) / 86_400_000);
      if (!parsed.shield.available && days >= 30) {
        parsed.shield.available = true;
        parsed.shield.lastGrantedAt = new Date().toISOString();
      }
    }
    // Rollover: new day → push previous to history, reset habits
    if (parsed.lastDate !== today()) {
      parsed.lastDate = today();
      parsed.todayHabits = { ...EMPTY_HABITS };
    }
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function freshState(): AppState {
  return {
    startDate: new Date().toISOString(),
    lastDate: today(),
    todayHabits: { ...EMPTY_HABITS },
    totalRelapses: 0,
    bestStreak: 0,
    history: [],
    shield: {
      available: true,
      lastGrantedAt: new Date().toISOString(),
      totalUsed: 0,
    },
  };
}

export function daysSince(iso: string): number {
  const start = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 86_400_000));
}

export function recordRelapse(state: AppState): AppState {
  const current = daysSince(state.startDate);
  // If shield is available, absorb the relapse — keep streak, consume shield.
  if (state.shield?.available) {
    return {
      ...state,
      shield: {
        ...state.shield,
        available: false,
        lastUsedAt: new Date().toISOString(),
        totalUsed: state.shield.totalUsed + 1,
      },
    };
  }
  return {
    ...state,
    bestStreak: Math.max(state.bestStreak, current),
    totalRelapses: state.totalRelapses + 1,
    startDate: new Date().toISOString(),
    todayHabits: { ...EMPTY_HABITS },
  };
}