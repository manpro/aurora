"use client";

import { Card } from "@/components/ui/Card";

interface ForecastGraphProps {
    kpData: { time_tag: string; kp: number }[];
    cloudData: { time: string; cloudCover: number }[];
}

export function ForecastGraph({ kpData, cloudData }: ForecastGraphProps) {
    if (!kpData.length || !cloudData.length) return null;

    // We want to show next 24h
    // Filter and limit
    const now = new Date();
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Align data by hour is tricky without dates. 
    // Let's assume the data is sorted.
    // We need to normalize time.
    const steps = 24;
    const width = 100; // SVG viewBox units
    const height = 50;

    // Helper to get X position
    const getX = (i: number) => (i / (steps - 1)) * width;

    // Render Bars for Kp (0-9 scale)
    const kpBars = kpData.slice(0, steps).map((d, i) => {
        const h = (d.kp / 9) * height;
        const isHigh = d.kp >= 5;
        return (
            <rect
                key={`kp-${i}`}
                x={getX(i) - 1}
                y={height - h}
                width={2}
                height={h}
                className={isHigh ? "fill-aurora-red" : "fill-white/30"}
                rx={1}
            />
        );
    });

    // Render Line for Clouds (0-100 scale)
    // Scale: 100% cloud = 0 height (top of chart?), or separate axis?
    // Let's make clouds an overlay or background.
    // Line is clearer.
    // Invert Y: 100% clouds = full height (bad). 0% clouds = bottom (good).
    // Actually, we want to see GAPS.
    // Let's plot Cloud Cover as a line chart overlay.
    const cloudPoints = cloudData.slice(0, steps).map((d, i) => {
        const x = getX(i);
        const y = height - ((d.cloudCover / 100) * height);
        return `${x},${y}`;
    }).join(" ");

    return (
        <Card className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold opacity-80">24H FORECAST</h3>
                <div className="flex gap-4 text-[10px] font-mono opacity-50">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-aurora-red" /> Kp Index</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-blue-400" /> Cloud Cover</span>
                </div>
            </div>

            <div className="relative w-full aspect-[2/1] bg-black/20 rounded border border-white/5">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="white" strokeOpacity="0.1" strokeDasharray="2" />

                    {/* KP Bars */}
                    {kpBars}

                    {/* Cloud Line */}
                    <polyline
                        points={cloudPoints}
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth="0.5"
                        strokeOpacity="0.5"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* Time Labels */}
                <div className="flex justify-between mt-2 text-[10px] font-mono opacity-30 px-1">
                    <span>NOW</span>
                    <span>+6H</span>
                    <span>+12H</span>
                    <span>+18H</span>
                    <span>+24H</span>
                </div>
            </div>
        </Card>
    );
}
