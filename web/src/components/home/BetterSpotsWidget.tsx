"use client";

import { useEffect, useState } from "react";
import { findBetterSpots, Spot } from "@/lib/engine/better-spot";
import { Card } from "@/components/ui/Card";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import { BigButton } from "@/components/ui/BigButton";

export function BetterSpotsWidget() {
    const [spots, setSpots] = useState<Spot[]>([]);

    useEffect(() => {
        // Mock current location (Abisko)
        const currentLat = 68.35;
        const currentLng = 18.78;
        const currentClouds = 85; // It's cloudy right now in our mock state

        const findings = findBetterSpots(currentLat, currentLng, currentClouds);
        setSpots(findings);
    }, []);

    if (spots.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold opacity-80 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-aurora-red" />
                    BETTER SPOTS
                </h3>
                <span className="text-xs font-mono opacity-50 space-x-2">
                    <span>NEARBY</span>
                    <span>&bull;</span>
                    <span>&lt;10KM</span>
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {spots.map((spot) => (
                    <Card key={spot.h3Index} className="p-4 flex items-center justify-between group active:scale-[98%] transition-transform">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg flex items-center gap-2">
                                {spot.reason}
                                {spot.score > 80 && <span className="text-[10px] bg-aurora-red text-black px-1 rounded font-black">HOT</span>}
                            </span>
                            <span className="text-xs opacity-50 font-mono">
                                {spot.distanceKm.toFixed(1)} km &bull; Cloud: {Math.round(spot.factors.cloudCover)}%
                            </span>
                        </div>

                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-aurora-red group-hover:text-black transition-colors red-mode:bg-zinc-900 red-mode:border red-mode:border-aurora-red">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
