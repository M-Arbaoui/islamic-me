import { type DailyHabits, EMPTY_HABITS } from "./nafs-stages";

const KEY = "nafs-state-v1";

export type AppState = {
  startDate: string; // ISO date when streak started
  lastDate: string; // last date a habit was logged (YYYY-MM-DD)
  todayHabits: DailyHabits;
  totalRelapses: number;
  bestStreak: number;
  history: { date: string; score: number }[];
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
  };
}

export function daysSince(iso: string): number {
  const start = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - start) / 86_400_000));
}

export function recordRelapse(state: AppState): AppState {
  const current = daysSince(state.startDate);
  return {
    ...state,
    bestStreak: Math.max(state.bestStreak, current),
    totalRelapses: state.totalRelapses + 1,
    startDate: new Date().toISOString(),
    todayHabits: { ...EMPTY_HABITS },
  };
}