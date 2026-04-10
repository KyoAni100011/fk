import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../shared/libs/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // You can add custom props here if needed later
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full border border-[#333333] px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-[#333333] disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
