import { VisibilityScore, WeatherState, SpaceWeatherState, THRESHOLDS } from "./types";
import { calculateMoonPenalty, getMoonPunishmentFactor } from "./moon";

/**
 * 5. Local Visibility Score (UPPDATERAD – “Secret Sauce”)
 */
export function calculateVisibilityScore(
    weather: WeatherState,
    spaceWeather: SpaceWeatherState
): VisibilityScore {
    // 1. Base potential from Space Weather (0-100)
    // Simplified model for now: higher Kp/Speed/Bz = higher base
    let baseScore = 0;

    switch (spaceWeather.activity) {
        case "NONE": baseScore = 10; break;
        case "LOW": baseScore = 30; break;
        case "MODERATE": baseScore = 60; break;
        case "HIGH": baseScore = 85; break;
        case "EXTREME": baseScore = 100; break;
    }

    // 2. Apply Cloud Penalty (Linear reduction)
    // 100% clouds = 0 score
    const cloudFactor = Math.max(0, 1 - (weather.cloudCover / 100));

    // 3. Apply Moon Penalty (Hard cutoff logic)
    const isMoonPenalized = calculateMoonPenalty(weather, spaceWeather);
    const moonFactor = getMoonPunishmentFactor(isMoonPenalized);

    // 4. Calculate Final Score
    let finalScore = baseScore * cloudFactor * moonFactor;

    // Round to integer
    finalScore = Math.round(finalScore);

    // 5. Determine Label
    let label: "LOW" | "MEDIUM" | "HIGH";
    if (finalScore < THRESHOLDS.LOW) label = "LOW";
    else if (finalScore < THRESHOLDS.MEDIUM) label = "MEDIUM";
    else label = "HIGH";

    return {
        score: finalScore,
        label,
        factors: {
            moonPenalty: isMoonPenalized,
            cloudPenalty: weather.cloudCover,
            activityBonus: baseScore
        }
    };
}
