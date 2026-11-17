import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "secondary" | "destructive";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  ...rest
}) => {
  const sizeClasses = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${className} ${sizeClasses[size]} ${variantClasses[variant]} ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {startIcon && !loading ? <span className="flex items-center">{startIcon}</span> : null}
      {children}
      {endIcon && !loading ? <span className="flex items-center">{endIcon}</span> : null}
    </button>
  );
};

export default Button;
