import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../libs/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white border border-[#333333]", className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
