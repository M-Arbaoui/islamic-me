import { useEffect, useState } from "react";

import {
  type AppState,
  daysSince,
  freshState,
  loadState,
  recordRelapse,
  saveState,
} from "@/lib/nafs-storage";
import {
  EMPTY_HABITS,
  type DailyHabits,
  getNextStage,
  getStageFromScore,
  habitScore,
  totalScore,
} from "@/lib/nafs-stages";

export function useNafsState() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
    function onStorage(e: StorageEvent) {
      if (e.key === "nafs-state-v1") setState(loadState());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const streakDays = state ? daysSince(state.startDate) : 0;
  const today = state?.todayHabits ?? EMPTY_HABITS;
  const todayPts = habitScore(today);
  const score = totalScore(streakDays, today);
  const stage = getStageFromScore(score);
  const next = getNextStage(score);
  const progressPct = next
    ? Math.min(
        100,
        Math.round(((score - stage.minScore) / (next.minScore - stage.minScore)) * 100),
      )
    : 100;

  function updateHabits(h: DailyHabits) {
    setState((prev) => (prev ? { ...prev, todayHabits: h } : prev));
  }
  function onRelapse() {
    setState((prev) => (prev ? recordRelapse(prev) : prev));
  }
  function onResetAll() {
    setState(freshState());
  }

  return {
    ready: !!state,
    state,
    stage,
    next,
    streakDays,
    today,
    todayPts,
    score,
    progressPct,
    updateHabits,
    onRelapse,
    onResetAll,
  };
}