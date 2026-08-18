import type { ReactNode } from "react";

type Tone = "gray" | "brand" | "green" | "amber" | "red";

const toneClasses: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-700",
  brand: "bg-brand-50 text-brand-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
