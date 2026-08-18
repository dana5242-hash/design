interface Props {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}

export function BriefSection({ label, value, editing, onChange }: Props) {
  return (
    <div className="py-3.5 border-b border-gray-100 last:border-b-0">
      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1.5">{label}</p>
      {editing ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.max(2, Math.ceil(value.length / 60))}
          className="w-full resize-y text-sm leading-relaxed text-gray-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        />
      ) : (
        <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{value || "-"}</p>
      )}
    </div>
  );
}
