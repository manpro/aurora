import React from "react";
import clsx from "clsx";

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "outline";
    fullWidth?: boolean;
}

export const BigButton = React.forwardRef<HTMLButtonElement, BigButtonProps>(
    ({ className, variant = "primary", fullWidth = false, children, ...props }, ref) => {
        const baseStyles = "min-h-[64px] min-w-[64px] rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center border-2";

        // In Red Mode, primary is Red text on Black, with Red Border
        const variants = {
            primary: "bg-aurora-red text-black border-aurora-red hover:bg-red-600 focus:ring-red-500 red-mode:bg-transparent red-mode:text-aurora-red red-mode:border-aurora-red",
            secondary: "bg-gray-800 text-white border-gray-700 hover:bg-gray-700 red-mode:bg-transparent red-mode:text-aurora-red-dim red-mode:border-aurora-red-dim",
            danger: "bg-red-900 text-white border-red-900 red-mode:bg-transparent red-mode:text-red-500 red-mode:border-red-500",
            outline: "bg-transparent text-white border-white red-mode:text-aurora-red red-mode:border-aurora-red"
        };

        return (
            <button
                ref={ref}
                className={clsx(
                    baseStyles,
                    variants[variant],
                    fullWidth ? "w-full" : "w-auto",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

BigButton.displayName = "BigButton";
