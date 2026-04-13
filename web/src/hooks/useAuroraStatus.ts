import { useState, useEffect } from "react";
import { WeatherState, SpaceWeatherState, VisibilityScore } from "@/lib/engine/types";
import { calculateVisibilityScore } from "@/lib/engine/scoring";
import { calculateConfidenceScore, ConfidenceLevel, shouldRecommendGoingOut } from "@/lib/engine/confidence";
import { getDataStatus, DataStatus } from "@/lib/engine/data-status";
import { getAuroraData } from "@/lib/data/repository";
import { MagnetometerData } from "@/lib/api/tgo";

export type CurrentStatus = {
    recommendation: {
        goOut: boolean;
        text: "GO" | "STAY" | "SLEEP";
        description: string;
    };
    metrics: {
        visibility: VisibilityScore;
        confidence: ConfidenceLevel;
        dataStatus: DataStatus;
    };
    weather: WeatherState;
    space: SpaceWeatherState;
    ground: MagnetometerData | null; // NEW: Ground Truth exposed to UI
    forecast: {
        kp: { time_tag: string; kp: number }[];
        clouds: { time: string; cloudCover: number }[];
    };
};

export function useAuroraStatus() {
    const [status, setStatus] = useState<CurrentStatus | null>(null);

    useEffect(() => {
        async function loadData() {
            // Mock Location (Abisko) - In future pass real user location here
            const lat = 68.35;
            const lng = 18.78;

            try {
                const realData = await getAuroraData(lat, lng);

                const { space, weather, status: dataStatus, ground } = realData;

                // 1. Calculate Visibility
                const visibility = calculateVisibilityScore(weather, space);

                // 2. Calculate Confidence
                const confidence = calculateConfidenceScore(space, 0, 10);

                // 3. Formulate Recommendation
                let shouldGo = shouldRecommendGoingOut(visibility.label, confidence);
                let text: "GO" | "STAY" | "SLEEP" = "STAY";
                let description = shouldGo
                    ? "Conditions are optimal. Grab your gear."
                    : visibility.factors.moonPenalty
                        ? "Moon is too bright."
                        : visibility.factors.cloudPenalty > 50
                            ? "Cloud cover is too high."
                            : "Activity is low.";

                // [PHASE 1.5] SLEDGEHAMMER LOGIC (Ground Truth Override)
                // If local magnetometer shows intense variations (dB/dt > 40), we ignore clouds/moon.
                if (ground && ground.db_dt > 40) {
                    shouldGo = true;
                    text = "GO";
                    description = "MAGNETIC SUBSTORM DETECTED! Ground sensors are spiking. Ignore forecast.";
                    // Boost confidence to MAX
                    visibility.score = 100;
                    visibility.label = "EXTREME";
                }

                // Normal Logic if no sledgehammer
                if (!shouldGo && visibility.label === "LOW") text = "SLEEP";
                if (shouldGo && text !== "GO") text = "GO";

                const newStatus: CurrentStatus = {
                    recommendation: { goOut: shouldGo, text, description },
                    metrics: { visibility, confidence, dataStatus },
                    weather,
                    space,
                    ground,
                    forecast: {
                        kp: realData.forecast.kp,
                        clouds: weather.hourlyForecast || []
                    }
                };

                setStatus(newStatus);

                // Persist for Native Widget Bridge
                import('@capacitor/preferences').then(({ Preferences }) => {
                    Preferences.set({
                        key: 'latest_status',
                        value: JSON.stringify(newStatus),
                    }).catch(err => console.warn('Failed to save status for widget', err));
                });

            } catch (e) {
                console.error("Failed to load aurora data", e);
            }
        }

        loadData();
        // Poll every 5 minutes
        const interval = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(interval);

    }, []);

    return status;
}
