export interface KpForecast {
    time_tag: string;
    kp: number;
}

// NOAA 3-Day Forecast
// Endpoint: https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json
// Format: [ [time, kp, observed, noaa_scale], ... ] 
// actually the format usually includes observed. Let's verify standard output.
// Standard Kp Forecast JSON: [["time_tag", "kp", "observed", "noaa_scale"], ["2024-01-01 00:00:00", "3.00", "observed", null], ...]

const URL_FORECAST = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json";

export async function fetchKpForecast(): Promise<KpForecast[]> {
    try {
        const res = await fetch(URL_FORECAST, { next: { revalidate: 3600 } }); // 1 hour cache
        const data = await res.json() as string[][];

        // Skip header
        const rows = data.slice(1);

        return rows.map(row => ({
            time_tag: row[0],
            kp: parseFloat(row[1])
        })).filter(item => !isNaN(item.kp));

    } catch (e) {
        console.error("Failed to fetch Kp Forecast", e);
        return [];
    }
}
