import { WeatherState } from "../engine/types";
import SunCalc from "suncalc";

// Met.no Locationforecast 2.0
// User-Agent is REQUIRED by their Terms of Service.
const URL_MET = "https://api.met.no/weatherapi/locationforecast/2.0/compact";
const USER_AGENT = "AuroraApp/1.0 (contact@aurora.app)";

export async function fetchMetNoWeather(lat: number, lng: number): Promise<WeatherState | null> {
    const url = `${URL_MET}?lat=${lat}&lon=${lng}`;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT
            },
            next: { revalidate: 1800 } // 30 min cache
        });

        if (!res.ok) throw new Error(`Met.no status: ${res.status}`);

        const data = await res.json();

        // Parse "Now"
        const currentSeries = data.properties.timeseries[0];
        const cloudCover = currentSeries.data.instant.details.cloud_area_fraction;

        // Parse "Hourly"
        const hourlyForecast = data.properties.timeseries.slice(0, 24).map((ts: any) => ({
            time: ts.time,
            cloudCover: ts.data.instant.details.cloud_area_fraction
        }));

        // Astro (Same as OpenMeteo)
        const now = new Date();
        const moonIllum = SunCalc.getMoonIllumination(now);
        const moonPos = SunCalc.getMoonPosition(now, lat, lng);
        const sunPos = SunCalc.getPosition(now, lat, lng);

        return {
            cloudCover,
            moonIllumination: Math.round(moonIllum.fraction * 100),
            moonAltitude: Math.round(moonPos.altitude * (180 / Math.PI)),
            solarElevation: Math.round(sunPos.altitude * (180 / Math.PI)),
            hourlyForecast
        };

    } catch (e) {
        console.warn("Met.no fetch failed, falling back...", e);
        return null; // Null return signals Repository to use Fallback (OpenMeteo)
    }
}
