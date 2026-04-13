export interface OvationOnePoint {
    long: number;
    lat: number;
    value: number;
}

const URL_OVATION = "https://services.swpc.noaa.gov/json/ovation_aurora_latest.json";

interface NoaaOvationResponse {
    "coordinates": [number, number, number][]; // [lon, lat, intensity]
    "observation_time": string;
    "forecast_time": string;
}

export async function fetchAuroraOval() {
    try {
        const res = await fetch(URL_OVATION, { next: { revalidate: 300 } }); // 5 min cache
        const data = await res.json() as NoaaOvationResponse;

        // Filter for visible aurora (e.g., intensity > 4) to reduce points
        const points = data.coordinates
            .filter((p) => p[2] > 5) // Filter out weak points
            .map((p) => ({
                long: p[0],
                lat: p[1],
                value: p[2]
            }));

        return points;
    } catch (e) {
        console.error("Failed to fetch Ovation model", e);
        return [];
    }
}
