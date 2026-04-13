export type AuroraActivity = "NONE" | "LOW" | "MODERATE" | "HIGH" | "EXTREME";

export type WeatherState = {
    cloudCover: number; // 0-100
    moonIllumination: number; // 0-100
    moonAltitude: number; // degrees
    solarElevation: number;
    hourlyForecast?: { time: string; cloudCover: number }[];
};

export type SpaceWeatherState = {
    bz: number; // nT
    speed: number; // km/s
    kp: number;
    activity: AuroraActivity;
};

export type VisibilityScore = {
    score: number; // 0-100
    label: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
    factors: {
        moonPenalty: boolean;
        cloudPenalty: number;
        activityBonus: number;
    };
};

export const THRESHOLDS = {
    LOW: 35,
    MEDIUM: 65,
};
