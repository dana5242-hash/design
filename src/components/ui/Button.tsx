import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/20 disabled:bg-brand-300",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400",
  outline:
    "bg-transparent text-brand-600 border border-brand-300 hover:bg-brand-50 disabled:text-brand-300 disabled:border-brand-100",
  ghost: "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-300",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 active:bg-red-100 disabled:text-red-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5 rounded-md",
  md: "text-sm px-4 py-2 gap-2 rounded-lg",
  lg: "text-base px-5 py-2.5 gap-2 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed whitespace-nowrap ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
