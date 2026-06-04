import { useEffect, useState } from "react";

type Times = Record<"Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>;
const LABELS: Record<keyof Times, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};
const KEY = "nafs-adhan-enabled";
const FIRED_KEY = "nafs-adhan-fired-v1";

function loadFired(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveFired(f: Record<string, boolean>) {
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(f));
  } catch {
    /* ignore */
  }
}

export function useAdhanNotifications(times: Times | null) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);
    setEnabled(localStorage.getItem(KEY) === "1");
  }, []);

  async function toggle() {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (enabled) {
      localStorage.setItem(KEY, "0");
      setEnabled(false);
      return;
    }
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;
    localStorage.setItem(KEY, "1");
    setEnabled(true);
  }

  useEffect(() => {
    if (!enabled || !times || permission !== "granted") return;
    const id = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const fired = loadFired();
      // prune old days
      Object.keys(fired).forEach((k) => {
        if (!k.startsWith(today)) delete fired[k];
      });
      const nowMin = now.getHours() * 60 + now.getMinutes();
      (Object.keys(times) as (keyof Times)[]).forEach((name) => {
        const [h, m] = times[name].split(":").map(Number);
        const min = h * 60 + m;
        const key = `${today}:${name}`;
        if (Math.abs(min - nowMin) <= 1 && !fired[key]) {
          try {
            new Notification(`حيّ على الفلاح — ${LABELS[name]}`, {
              body: `حان الآن وقت صلاة ${LABELS[name]}. قُم يا فارس ⚔`,
              icon: "/app-icon.png",
              badge: "/favicon.png",
              tag: key,
            });
          } catch {
            /* ignore */
          }
          fired[key] = true;
          saveFired(fired);
        }
      });
    }, 30_000);
    return () => clearInterval(id);
  }, [enabled, times, permission]);

  return { enabled, permission, toggle };
}