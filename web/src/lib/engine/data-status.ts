/**
 * 3.3 Data Freshness State (NY)
 * State	Betydelse
 * LIVE	Data < 5 min
 * DEGRADED	5–15 min
 * STALE	>15 min
 * OFFLINE	Ingen uppkoppling
 * 
 * Regel: LOW + STALE = får inte presenteras som giltig prognos.
 */

export type DataStatus = "LIVE" | "DEGRADED" | "STALE" | "OFFLINE";

export function getDataStatus(lastUpdated: Date, isOnline: boolean = true): DataStatus {
    if (!isOnline) return "OFFLINE";

    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / 1000 / 60;

    if (diffMinutes < 5) return "LIVE";
    if (diffMinutes < 15) return "DEGRADED";
    return "STALE";
}

export function isPrognosisValid(
    dataStatus: DataStatus,
    visibilityLabel: "LOW" | "MEDIUM" | "HIGH"
): boolean {
    // Regel: LOW + STALE = får inte presenteras som giltig prognos.
    // Interpreted as: If data is STALE, and visibility is LOW, we shouldn't trust it (it might actually be HIGH but we missed it, or LOW is just old news).
    // Actually the spec says "LOW + STALE = får inte presenteras som giltig prognos".
    // This likely means don't show "LOW" if data is stale, show "UNKNOWN" or similar.
    if (dataStatus === "STALE" && visibilityLabel === "LOW") {
        return false;
    }
    return true;
}
