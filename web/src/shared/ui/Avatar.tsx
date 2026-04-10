import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../shared/libs/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  fallback?: string;
  src?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, fallback, src, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-8 h-8 border border-[#333333] bg-[#f0f0f0] flex items-center justify-center font-bold text-black text-xs shrink-0 overflow-hidden",
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={fallback} className="w-full h-full object-cover" />
        ) : (
          fallback ? fallback.charAt(0).toUpperCase() : "?"
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
