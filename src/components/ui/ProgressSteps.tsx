import { Check } from "lucide-react";

interface Step {
  label: string;
}

export function ProgressSteps({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <ol className="flex items-center min-w-max sm:min-w-0 sm:w-full gap-1 sm:gap-0">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const done = stepNum < current;
          const active = stepNum === current;
          return (
            <li key={step.label} className="flex items-center flex-1 min-w-[92px] sm:min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border-2 shrink-0 ${
                    done
                      ? "bg-brand-600 border-brand-600 text-white"
                      : active
                        ? "border-brand-600 text-brand-600 bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                  }`}
                >
                  {done ? <Check size={16} /> : stepNum}
                </div>
                <span
                  className={`text-[11px] sm:text-xs text-center whitespace-nowrap ${
                    active ? "text-brand-700 font-semibold" : done ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {stepNum !== steps.length && (
                <div className={`h-0.5 flex-1 -mt-5 ${done ? "bg-brand-600" : "bg-gray-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
