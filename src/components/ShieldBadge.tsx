import { Shield, ShieldOff } from "lucide-react";

type Props = {
  available: boolean;
  totalUsed: number;
  lastGrantedAt: string;
};

export function ShieldBadge({ available, totalUsed, lastGrantedAt }: Props) {
  const last = new Date(lastGrantedAt).getTime();
  const days = Math.floor((Date.now() - last) / 86_400_000);
  const daysLeft = Math.max(0, 30 - days);

  return (
    <section
      className={`paper rounded-2xl p-4 flex items-center gap-3 ${
        available ? "ring-1 ring-[var(--emerald)]/40" : ""
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
          available
            ? "bg-[var(--emerald)]/15 text-[var(--emerald)]"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {available ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
      </div>
      <div className="flex-1 text-right">
        <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
          سُترة الصمود
        </div>
        <div className="text-sm font-black text-[var(--ink)]">
          {available ? "جاهزة — تمتص انتكاسة واحدة" : `تستعيدها بعد ${daysLeft} يوماً`}
        </div>
        <div className="text-[10px] text-muted-foreground">
          استُخدمت {totalUsed} مرّة · تتجدّد كل ٣٠ يوماً
        </div>
      </div>
    </section>
  );
}