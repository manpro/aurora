import { SpaceWeatherState, WeatherState } from "./types";

/**
 * 6. Confidence Score (förtydligad)
 * Baseras på: Stabilitet i Bz, Datakällors latency, Avvikelse mellan modeller
 * Regel: HIGH Visibility + LOW Confidence → aldrig “Go out now”.
 */
export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export function calculateConfidenceScore(
    spaceWeather: SpaceWeatherState,
    dataAgePercent: number, // 0-100 where 100 is very stale
    bzVolatility: number // 0-100 relative volatility
): ConfidenceLevel {
    let score = 100;

    // 1. Penalize for stale data
    score -= dataAgePercent;

    // 2. Penalize for volatile space weather (harder to predict)
    // High volatility reduces confidence in the "current" state persisting
    score -= (bzVolatility * 0.5);

    if (score > 80) return "HIGH";
    if (score > 40) return "MEDIUM";
    return "LOW";
}

export function shouldRecommendGoingOut(
    visibilityLabel: "LOW" | "MEDIUM" | "HIGH" | "EXTREME",
    confidence: ConfidenceLevel
): boolean {
    // [PHASE 1.5] Sledgehammer Override
    if (visibilityLabel === "EXTREME") return true;

    // REQUIREMENT: HIGH Visibility + LOW Confidence → aldrig “Go out now”
    if (visibilityLabel === "HIGH" && confidence === "LOW") {
        return false;
    }

    if (visibilityLabel === "HIGH" && confidence !== "LOW") return true;
    if (visibilityLabel === "MEDIUM" && confidence === "HIGH") return true;

    return false;
}
