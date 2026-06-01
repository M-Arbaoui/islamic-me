import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPwaButton() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    function onBIP(e: Event) {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setInstalled(true);
      setEvt(null);
    }
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS-only
      window.navigator.standalone === true;
    if (standalone) setInstalled(true);
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (evt) {
      await evt.prompt();
      await evt.userChoice;
      setEvt(null);
    } else if (isIOS) {
      setShowIOSHelp((v) => !v);
    } else {
      setShowIOSHelp((v) => !v);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={install}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 bg-gradient-to-l from-[var(--sienna)] to-[var(--gold-deep)] text-[oklch(0.97_0.02_82)] font-bold text-sm shadow-md active:scale-[0.98] transition-transform"
      >
        <Download className="w-4 h-4" />
        ثبّت التطبيق على هاتفك
      </button>
      {showIOSHelp && (
        <div className="paper rounded-2xl p-3 text-[11px] text-[var(--ink)] leading-relaxed">
          <div className="flex items-center gap-2 mb-1 font-bold">
            <Smartphone className="w-3.5 h-3.5" /> طريقة التثبيت
          </div>
          {isIOS ? (
            <p>
              في Safari: اضغط زر المشاركة <strong>⎋</strong>، ثم اختر
              <strong> «Add to Home Screen» — أضف إلى الشاشة الرئيسيّة</strong>.
            </p>
          ) : (
            <p>
              من قائمة المتصفّح <strong>⋮</strong>، اختر
              <strong> «Install app» أو «Add to Home screen»</strong>.
              قد يحتاج المتصفّح إلى التحديث.
            </p>
          )}
        </div>
      )}
    </div>
  );
}