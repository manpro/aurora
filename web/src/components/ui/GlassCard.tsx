"use client";

import React from "react";
import clsx from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "alert" | "active";
    children?: React.ReactNode;
    className?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={clsx(
                    "relative backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500",
                    // Base Glass Style
                    "bg-white/5 border-white/10 shadow-2xl",

                    // Variants
                    variant === "default" && "hover:border-white/20 hover:bg-white/10",

                    // Alert (Red Mode / Storm) - Deep Red Pulse
                    variant === "alert" && [
                        "bg-red-500/10 border-red-500/30",
                        "shadow-[0_0_50px_rgba(255,0,0,0.2)]",
                        "animate-pulse-slow" // Custom animation defined in globals
                    ],

                    // Active (Green / Go) - Aurora Borealis Glow
                    variant === "active" && [
                        "bg-emerald-500/10 border-emerald-500/30",
                        "shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                    ],

                    className
                )}
                {...props}
            >
                {/* Noise Texture Overlay for "Film Grain" feel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" />

                {/* Content */}
                <div className="relative z-10 p-6">
                    {children}
                </div>
            </motion.div>
        );
    }
);

GlassCard.displayName = "GlassCard";
