import { useState, useEffect } from "react";

export interface Sighting {
    id: string;
    lat: number;
    lng: number;
    timestamp: Date;
    intensity: "WEAK" | "STRONG";
}

export function useSightings() {
    const [sightings, setSightings] = useState<Sighting[]>([]);

    useEffect(() => {
        // Simulate fetching from Backend
        const mockSightings: Sighting[] = [
            { id: "1", lat: 68.35, lng: 18.78, timestamp: new Date(), intensity: "STRONG" }, // Abisko
            { id: "2", lat: 69.64, lng: 18.95, timestamp: new Date(), intensity: "WEAK" },   // Tromso
            { id: "3", lat: 64.14, lng: -21.94, timestamp: new Date(), intensity: "STRONG" }, // Reykjavik
            { id: "4", lat: 65.61, lng: 22.11, timestamp: new Date(), intensity: "WEAK" },   // Lulea
        ];

        setSightings(mockSightings);
    }, []);

    return sightings;
}
