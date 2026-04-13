import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "alert";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "p-6 rounded-2xl border transition-colors",
                    // Default: Dark gray bg, gray border
                    // Red Mode: Black bg, Red border (no white surfaces!)
                    "bg-zinc-900 border-zinc-800",
                    "red-mode:bg-black red-mode:border-aurora-red-dim",
                    variant === "alert" && "border-aurora-red bg-red-950/20",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
