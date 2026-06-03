import { useEffect, useState } from "react";

const KEY = "nafs-profile-v1";

export type Profile = {
  name: string;
  struggle: string;
  goal: string;
  createdAt: string;
};

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("nafs-profile-change"));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
    function refresh() {
      setProfile(loadProfile());
    }
    window.addEventListener("nafs-profile-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("nafs-profile-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function update(p: Profile) {
    saveProfile(p);
    setProfile(p);
  }

  return { profile, ready, update };
}