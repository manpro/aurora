import { SpaceWeatherState, AuroraActivity } from "../engine/types";

// NOAA Endpoints
const URL_KP = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
const URL_WIND = "https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind-1-hour.json";

// Types matching NOAA JSON structure
// Kp: [time_tag, kp, a_running, station_count]
type KpResponse = [string, string, string, string][];

// Wind: [time_tag, speed, density, temperature, bz, theta, phi]
type WindResponse = [string, string, string, string, string, string, string][];

export async function fetchSpaceWeather(): Promise<SpaceWeatherState> {
    try {
        const [kpRes, windRes] = await Promise.all([
            fetch(URL_KP, { next: { revalidate: 60 } }).then(r => r.json()),
            fetch(URL_WIND, { next: { revalidate: 60 } }).then(r => r.json()),
        ]);

        const kpData = kpRes as KpResponse;
        const windData = windRes as WindResponse;

        // Last entry is newest
        const latestKp = kpData[kpData.length - 1];
        const latestWind = windData[windData.length - 1];

        // Parse Values (NOAA sends strings usually, excluding headers)
        // Check if the first row is header using explicit check
        // Actually NOAA JSONs often include headers. We should pop the last element.
        // Ideally we filter valid rows.

        // Robust parsing:
        const kpVal = parseFloat(latestKp[1]);
        const speedVal = parseFloat(latestWind[1]);
        const bzVal = parseFloat(latestWind[4]);

        // Determine Activity Label
        let activity: AuroraActivity = "NONE";
        if (kpVal >= 7) activity = "EXTREME";
        else if (kpVal >= 5) activity = "HIGH";
        else if (kpVal >= 4) activity = "MODERATE";
        else if (kpVal >= 3) activity = "LOW";

        return {
            kp: isNaN(kpVal) ? 0 : kpVal,
            speed: isNaN(speedVal) ? 0 : speedVal,
            bz: isNaN(bzVal) ? 0 : bzVal,
            activity
        };

    } catch (e) {
        console.error("Failed to fetch Space Weather:", e);
        // Return fallback/offline data or throw? 
        // For now returning a safe "Quiet" state to avoid crashing
        return {
            kp: 0,
            speed: 300,
            bz: 0,
            activity: "NONE"
        };
    }
}
