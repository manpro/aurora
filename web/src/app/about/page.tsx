"use client";

import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen p-4 pb-24 flex flex-col gap-6 max-w-md mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 py-2">
                <Link href="/">
                    <button className="p-2 border border-zinc-800 rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </Link>
                <h1 className="text-xl font-bold tracking-wider opacity-80 decoration-slice">GUIDE</h1>
            </header>

            <div className="prose prose-invert prose-sm">
                <p className="opacity-60">Understanding the data behind the Aurora.</p>

                <h3 className="text-lg font-bold text-aurora-red/80 mt-6 mb-2">Kp Index (Global Activity)</h3>
                <Card className="p-4 bg-zinc-900/50">
                    <ul className="list-disc pl-4 space-y-1 opacity-80">
                        <li><b className="text-white">0-3 (Low)</b>: Only visible in far north (Abisko).</li>
                        <li><b className="text-white">4-5 (Moderate)</b>: Visible in Northern Scandinavia.</li>
                        <li><b className="text-white">6-7 (High)</b>: Visible in central Europe.</li>
                        <li><b className="text-white">8-9 (Extreme)</b>: Global event.</li>
                    </ul>
                </Card>

                <h3 className="text-lg font-bold text-blue-400 mt-6 mb-2">Bz (Magnetic Orient.)</h3>
                <Card className="p-4 bg-zinc-900/50 flex flex-col gap-2">
                    <p className="opacity-80">
                        The direction of the solar wind's magnetic field.
                    </p>
                    <div className="flex gap-2">
                        <span className="text-red-400 font-bold">Positive (+)</span>
                        <span className="opacity-50">Shields UP (No Aurora)</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-green-400 font-bold">Negative (-)</span>
                        <span className="opacity-50">Shields DOWN (Aurora flows in)</span>
                    </div>
                </Card>

                <h3 className="text-lg font-bold text-white mt-6 mb-2">Credits</h3>
                <p className="opacity-50 text-xs">
                    Space Weather Data provided by <a href="https://www.swpc.noaa.gov/" className="underline">NOAA SWPC</a>.<br />
                    Weather Data provided by <a href="https://open-meteo.com/" className="underline">OpenMeteo</a>.<br />
                    Built by Antigravity using Next.js & Capacitor.
                </p>
            </div>
        </main>
    );
}
