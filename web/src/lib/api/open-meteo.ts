import { WeatherState } from "../engine/types";
import SunCalc from "suncalc";

export async function fetchLocalWeather(lat: number, lng: number): Promise<WeatherState> {
    // Free tier: non-commercial use is fine.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=cloud_cover,is_day&hourly=cloud_cover&timezone=auto&forecast_days=3`;

    try {
        const res = await fetch(url, { next: { revalidate: 900 } }); // 15 min cache
        const data = await res.json();

        // Cloud cover is current
        const cloudCover = data.current.cloud_cover || 0;

        // Hourly Forecast
        const hourlyForecast = data.hourly.time.map((time: string, i: number) => ({
            time,
            cloudCover: data.hourly.cloud_cover[i] || 0
        }));

        // Astro Data from SunCalc
        const now = new Date();
        const moonIllum = SunCalc.getMoonIllumination(now);
        const moonPos = SunCalc.getMoonPosition(now, lat, lng);
        const sunPos = SunCalc.getPosition(now, lat, lng);

        return {
            cloudCover,
            moonIllumination: Math.round(moonIllum.fraction * 100), // 0-1
            moonAltitude: Math.round(moonPos.altitude * (180 / Math.PI)), // radians to degrees
            solarElevation: Math.round(sunPos.altitude * (180 / Math.PI)),
            hourlyForecast
        };
    } catch (e) {
        console.error("Failed to fetch Weather:", e);
        // Return safe default
        return {
            cloudCover: 100, // Assume worst case on error? Or 0? 
            moonIllumination: 0,
            moonAltitude: 0,
            solarElevation: 0
        };
    }
}
