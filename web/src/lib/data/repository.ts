import { fetchSpaceWeather } from "../api/swpc";
import { fetchLocalWeather } from "../api/open-meteo";
import { fetchKpForecast, KpForecast } from "../api/swpc-forecast";
import { fetchMagnetometerData, MagnetometerData } from "../api/tgo";
import { fetchMetNoWeather } from "../api/met-no";
import { SpaceWeatherState, WeatherState } from "../engine/types";
import { DataStatus } from "../engine/data-status";

export interface AuroraData {
    space: SpaceWeatherState;
    weather: WeatherState;
    ground: MagnetometerData | null; // NEW: Ground Truth
    forecast: {
        kp: KpForecast[];
    };
    lastUpdated: Date;
    status: DataStatus;
    dataSource: "GLOBAL" | "NORDIC"; // NEW: Track which source we used
}

// Simple in-memory cache
let cache: AuroraData | null = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function getAuroraData(lat: number, lng: number): Promise<AuroraData> {
    const now = Date.now();

    // Serve cache if fresh
    if (cache && (now - lastFetch < CACHE_TTL)) {
        return cache;
    }

    try {
        console.log("Fetching fresh Aurora data (+ Ground Truth)...");

        // 1. Determine Region (Nordic Box: Lat > 55, 5 < Lng < 35)
        const isNordic = lat > 55 && lng > 5 && lng < 35;
        let weather: WeatherState | null = null;
        let dataSource: "GLOBAL" | "NORDIC" = "GLOBAL";

        // 2. Fetch Space & Magnetometer Parallel
        const [space, tgoData, kpForecast] = await Promise.all([
            fetchSpaceWeather(),
            fetchMagnetometerData(),
            fetchKpForecast()
        ]);

        // 3. Fetch Weather (Priority: Met.no -> OpenMeteo)
        if (isNordic) {
            weather = await fetchMetNoWeather(lat, lng);
            if (weather) dataSource = "NORDIC";
        }

        // Fallback to OpenMeteo if not Nordic or Met.no failed
        if (!weather) {
            console.log("Using OpenMeteo fallback...");
            weather = await fetchLocalWeather(lat, lng);
        }

        cache = {
            space,
            weather,
            ground: tgoData,
            forecast: {
                kp: kpForecast
            },
            lastUpdated: new Date(),
            status: "LIVE",
            dataSource
        };
        console.log(`[Repository] Data Source: ${dataSource} | TGO dB/dt: ${tgoData?.db_dt.toFixed(2)}`);
        lastFetch = now;

        return cache;

    } catch (e) {
        console.error("Repository Fetch Error:", e);

        if (cache) {
            return { ...cache, status: "STALE" };
        }

        throw e;
    }
}
