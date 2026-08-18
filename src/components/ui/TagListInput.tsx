import { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagListInputProps {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagListInput({ items, onChange, placeholder }: TagListInputProps) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (items.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium hover:bg-brand-100"
        >
          <Plus size={16} /> 추가
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                className="p-0.5 rounded-full hover:bg-gray-200 text-gray-500"
                aria-label={`${item} 삭제`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
