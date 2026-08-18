import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FieldWrapProps {
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldWrap({ label, required, error, hint, children }: FieldWrapProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

const baseInputClass =
  "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 disabled:bg-gray-50 disabled:text-gray-400";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...rest }: InputProps) {
  return (
    <input
      className={`${baseInputClass} ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300"} ${className}`}
      {...rest}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`${baseInputClass} resize-y min-h-[90px] ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300"} ${className}`}
      {...rest}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`${baseInputClass} bg-white ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300"} ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
