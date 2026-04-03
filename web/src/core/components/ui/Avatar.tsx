import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../libs/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  fallback: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-8 h-8 border border-[#333333] bg-[#f0f0f0] flex items-center justify-center font-bold text-black text-xs shrink-0",
          className
        )}
        {...props}
      >
        {fallback ? fallback.charAt(0).toUpperCase() : "?"}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
