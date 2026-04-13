import { calculateVisibilityScore } from "./scoring";
import { WeatherState, SpaceWeatherState } from "./types";

// Simple test runner since we don't have Jest setup yet
// Run with: npx ts-node src/lib/engine/test-runner.ts
// But first we need ts-node. For now, I'll make a simple node script.

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASSED: ${message}`);
    }
}

// Test Case 1: Moon Logic - Penalty should apply
const weatherBadMoon: WeatherState = {
    cloudCover: 0,
    moonIllumination: 80, // > 50%
    moonAltitude: 10,     // > 0 deg
    solarElevation: -20
};
const spaceModerate: SpaceWeatherState = {
    bz: -5,
    speed: 400,
    kp: 4,
    activity: "MODERATE"
};

const result1 = calculateVisibilityScore(weatherBadMoon, spaceModerate);
// usage: base ~60 * 1.0 (clouds) * 0.3 (moon) = 18 -> LOW
assert(result1.label === "LOW", "High Moon + Moderate Aurora should be LOW");
assert(result1.factors.moonPenalty === true, "Moon penalty should be active");

// Test Case 2: Extreme Aurora overrides Moon
const spaceExtreme: SpaceWeatherState = {
    bz: -20,
    speed: 800,
    kp: 8,
    activity: "EXTREME"
};
const result2 = calculateVisibilityScore(weatherBadMoon, spaceExtreme);
// usage: base 100 * 1.0 * 1.0 (no moon penalty) = 100 -> HIGH
assert(result2.label === "HIGH", "Extreme Aurora should override Moon penalty");
assert(result2.factors.moonPenalty === false, "Moon penalty should NOT be active for EXTREME");

// Test Case 3: Cloud Cover
const weatherCloudy: WeatherState = {
    cloudCover: 100,
    moonIllumination: 0,
    moonAltitude: -10,
    solarElevation: -20
};
const result3 = calculateVisibilityScore(weatherCloudy, spaceModerate);
assert(result3.score === 0, "100% Clouds should result in 0 score");

console.log("All manual verification tests passed.");
