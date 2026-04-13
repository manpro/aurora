import { latLngToCell, gridDisk, cellToLatLng, greatCircleDistance } from "h3-js";
import { WeatherState } from "./types";

/**
 * 9. Better Spot (TEKNISKT KORRIGERAD)
 * 9.1 Teknik: H3 grid. Precomputed Dark sky & Horizon. Dynamic filter: clouds.
 */

export interface Spot {
    h3Index: string;
    lat: number;
    lng: number;
    distanceKm: number;
    score: number;
    reason: string;
    factors: {
        lightPollution: number; // 0 (dark) - 10 (bright)
        cloudCover: number; // 0-100
        horizonNorth: number; // 0 (blocked) - 100 (open)
    };
}

// Mock database of local spots (In real app, this is a geospatial query)
// We simulate that we know about the "Dark Sky" potential of nearby hexes
const MOCK_GRID_DATA: Record<string, { light: number; horizon: number }> = {};

/**
 * Find better spots within radius
 * @param currentLat 
 * @param currentLng 
 * @param currentClouds Current location cloud cover (we assume it varies spatially)
 */
export function findBetterSpots(
    currentLat: number,
    currentLng: number,
    currentClouds: number
): Spot[] {
    // 1. Get current H3 index (Resolution 7 is ~1.2km edge length, good for spots)
    const currentRes = 7;
    const originIndex = latLngToCell(currentLat, currentLng, currentRes);

    // 2. Get Ring of neighbors (k=3 rings ~ 5-10km)
    const nearbyIndices = gridDisk(originIndex, 5);

    const spots: Spot[] = [];

    nearbyIndices.forEach((index: string) => {
        if (index === originIndex) return;

        const [lat, lng] = cellToLatLng(index);
        const distanceKm = greatCircleDistance(
            [currentLat, currentLng],
            [lat, lng],
            'km'
        );

        // Mock predictions for this cell
        // Simulate that clouds move/vary: simpler model -> noise based on index
        // Simulate light pollution: further from origin (city?) is darker?
        // Let's just generate determinstic pseudo-randomness from the index string
        const pseudoRandom = index.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

        // Light pollution (0-10)
        const lightPollution = (pseudoRandom % 10); // Random 0-9

        // Horizon openness North (0-100)
        const horizonNorth = ((pseudoRandom * 13) % 100);

        // Cloud cover variation (simulated)
        // Maybe some spots have 20% less clouds than current?
        const cloudVariation = ((pseudoRandom * 7) % 40) - 20; // -20 to +20
        const cellClouds = Math.max(0, Math.min(100, currentClouds + cloudVariation));

        // Scoring Algorithm
        // We want: Dark sky (Low Light), Open Horizon (High Horizon), Clear Sky (Low Clouds)

        // Score 0-100
        // Weight: Clouds 50%, Light 30%, Horizon 20%
        const cloudScore = (100 - cellClouds);
        const lightScore = (10 - lightPollution) * 10;
        const horizonScore = horizonNorth;

        const totalScore = (cloudScore * 0.5) + (lightScore * 0.3) + (horizonScore * 0.2);

        // Filter: Must be better than "decent"
        if (totalScore > 60) {
            let reason = "Better view";
            if (cellClouds < currentClouds - 10) reason = "Less clouds";
            else if (lightPollution < 2) reason = "Darker sky";
            else if (horizonNorth > 80) reason = "Open horizon";

            spots.push({
                h3Index: index,
                lat,
                lng,
                distanceKm,
                score: totalScore,
                reason,
                factors: {
                    lightPollution,
                    cloudCover: cellClouds,
                    horizonNorth
                }
            });
        }
    });

    // Sort by score desc, take top 3
    return spots.sort((a, b) => b.score - a.score).slice(0, 3);
}
