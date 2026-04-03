import { type LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "../../libs/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, text, id, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={id}
        className={cn("block text-sm font-bold text-black mb-1", className)}
        {...props}
      >
        {text}
      </label>
    );
  }
);

Label.displayName = "Label";
