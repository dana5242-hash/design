import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { generateId } from "../../lib/id";

type ToastTone = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const toneStyles: Record<ToastTone, { icon: ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  error: {
    icon: <AlertTriangle size={18} className="text-red-600 shrink-0" />,
    className: "border-red-200 bg-red-50 text-red-800",
  },
  info: {
    icon: <Info size={18} className="text-brand-600 shrink-0" />,
    className: "border-brand-200 bg-brand-50 text-brand-800",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = "info") => {
      const id = generateId("toast");
      setToasts((prev) => [...prev, { id, message, tone }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 items-end no-print">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`w-full sm:w-auto sm:max-w-sm flex items-start gap-2 border rounded-lg px-4 py-3 shadow-lg text-sm ${toneStyles[t.tone].className}`}
          >
            {toneStyles[t.tone].icon}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100" aria-label="닫기">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
