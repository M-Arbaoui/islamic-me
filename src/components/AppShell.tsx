import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListChecks, Sparkles, Map as MapIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useNafsState } from "@/hooks/useNafsState";

const TABS = [
  { to: "/", label: "البيت", icon: Home, exact: true },
  { to: "/habits", label: "العبادات", icon: ListChecks, exact: false },
  { to: "/guide", label: "المرشد", icon: Sparkles, exact: false },
  { to: "/journey", label: "الرحلة", icon: MapIcon, exact: false },
] as const;

type Props = {
  title: string;
  subtitle?: string;
  toneId: ReturnType<typeof useNafsState>["stage"]["toneId"];
  rightSlot?: ReactNode;
  children: ReactNode;
};

export function AppShell({ title, subtitle, toneId, rightSlot, children }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={`relative min-h-screen tone-${toneId} overflow-hidden`}>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <div className="max-w-md mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--tone)] to-[var(--violet)] flex items-center justify-center shadow-lg shadow-[var(--tone-glow)] text-white font-black">
              ⚔
            </div>
            <div className="text-right">
              <h1 className="text-sm font-black leading-none text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {rightSlot}
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 pt-5 pb-28">{children}</main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] pointer-events-none">
          <div className="max-w-md mx-auto px-3 pb-3 pointer-events-auto">
            <div className="glass rounded-2xl border border-border/60 grid grid-cols-4 p-1.5">
              {TABS.map((t) => {
                const active = t.exact ? path === t.to : path.startsWith(t.to);
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all active:scale-95 ${
                      active
                        ? "bg-[var(--tone-soft)] text-[var(--tone)]"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-wider">{t.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}