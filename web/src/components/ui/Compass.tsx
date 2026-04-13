"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "lucide-react";
import clsx from "clsx";

export const Compass = () => {
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        // Basic implementation - requires secure context (HTTPS) and user interaction usually
        const handleOrientation = (event: DeviceOrientationEvent) => {
            // webkitCompassHeading for iOS, alpha for Android (rough approx)
            const compass = (event as any).webkitCompassHeading || Math.abs(event.alpha! - 360);
            setHeading(compass);
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation, true);
        }

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div
                className="transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${-heading}deg)` }}
            >
                <Navigation
                    className={clsx(
                        "w-12 h-12 text-white fill-current",
                        "red-mode:text-aurora-red"
                    )}
                />
            </div>
            <div className="absolute top-0 text-xs font-mono opacity-50">N</div>
        </div>
    );
};
