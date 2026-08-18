interface ChipSelectProps {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
}

export function ChipSelect({ options, value, onChange, multiple = true }: ChipSelectProps) {
  const toggle = (opt: string) => {
    if (multiple) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange(value.includes(opt) ? [] : [opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-brand-600 border-brand-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:border-brand-400 hover:text-brand-600"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
