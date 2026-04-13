import { WeatherState, SpaceWeatherState } from "./types";

/**
 * 5.2 Moon logic (NY – obligatorisk)
 * Om: Moon illumination > 50 % och Moon altitude > 0°
 * Då: straffa score kraftigt om inte Aurora Activity = EXTREME
 */
export function calculateMoonPenalty(
    weather: WeatherState,
    spaceWeather: SpaceWeatherState
): boolean {
    // If extreme aurora, we don't care about the moon (it shines through)
    if (spaceWeather.activity === "EXTREME") {
        return false;
    }

    // If moon is bright (>50%) and above horizon (>0 deg)
    if (weather.moonIllumination > 50 && weather.moonAltitude > 0) {
        return true;
    }

    return false;
}

export function getMoonPunishmentFactor(isPenalized: boolean): number {
    return isPenalized ? 0.3 : 1.0; // Reduce score by 70% if penalized
}
