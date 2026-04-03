import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../libs/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref
  ) => {
    const baseClass =
      "inline-flex items-center justify-center font-bold transition-colors disabled:opacity-50";
    const variants = {
      primary: "bg-[#f0f0f0] border border-[#333333] hover:bg-[#e0e0e0] text-black",
      secondary: "bg-transparent border border-gray-300 hover:bg-gray-50 text-black",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      ghost: "bg-transparent hover:bg-gray-100 text-black border-none",
    };
    const sizes = { sm: "py-1 px-3 text-xs", md: "py-2 px-6 text-sm", lg: "py-3 px-8 text-lg" };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <span className="mr-2 animate-spin">⟳</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
