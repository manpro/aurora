"use client";

import { useSettings } from "@/hooks/useSettings";
import { Card } from "@/components/ui/Card";
import { BigButton } from "@/components/ui/BigButton";
import { Navigation, Bell, Cloud, Ruler, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRedMode } from "@/context/RedModeContext";

export default function SettingsPage() {
    const { settings, updateSettings, loaded } = useSettings();
    const { isRedMode } = useRedMode();

    if (!loaded) return <div className="p-8 text-center animate-pulse">LOADING CONFIG...</div>;

    return (
        <main className="min-h-screen p-4 pb-24 flex flex-col gap-6 max-w-md mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 py-2">
                <Link href="/">
                    <button className="p-2 border border-zinc-800 rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </Link>
                <h1 className="text-xl font-bold tracking-wider opacity-80 decoration-slice">SETTINGS</h1>
            </header>

            {/* Notifications Section */}
            <section className="flex flex-col gap-4">
                <h2 className="text-sm font-mono opacity-50 uppercase tracking-widest pl-1">Alert Triggers</h2>

                <Card className="flex flex-col gap-4 p-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Bell className="text-aurora-red" />
                            <span className="font-bold">Notifications</span>
                        </div>
                        <div
                            onClick={() => updateSettings({ notificationEnabled: !settings.notificationEnabled })}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.notificationEnabled ? 'bg-aurora-red' : 'bg-zinc-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {settings.notificationEnabled && (
                        <>
                            <div className="h-px bg-white/10 w-full" />

                            {/* KP Slider */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><Ruler size={14} /> Min Kp Index</span>
                                    <span className="font-mono text-aurora-red font-bold">{settings.kpThreshold}</span>
                                </div>
                                <input
                                    type="range" min="0" max="9" step="1"
                                    value={settings.kpThreshold}
                                    onChange={(e) => updateSettings({ kpThreshold: parseInt(e.target.value) })}
                                    className="w-full accent-aurora-red h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-[10px] opacity-40">Only alert if activity is higher than this.</span>
                            </div>

                            {/* Cloud Slider */}
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2"><Cloud size={14} /> Max Cloud Cover</span>
                                    <span className="font-mono text-blue-400 font-bold">{settings.cloudThreshold}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="10"
                                    value={settings.cloudThreshold}
                                    onChange={(e) => updateSettings({ cloudThreshold: parseInt(e.target.value) })}
                                    className="w-full accent-blue-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-[10px] opacity-40">Don't alert if it's too cloudy.</span>
                            </div>
                        </>
                    )}
                </Card>
            </section>

            {/* Location Section */}
            <section className="flex flex-col gap-4">
                <h2 className="text-sm font-mono opacity-50 uppercase tracking-widest pl-1">Location</h2>
                <Card className="flex flex-col gap-4 p-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <MapPin className={!settings.manualLocation ? "text-green-500" : "text-zinc-500"} />
                            <div className="flex flex-col">
                                <span className="font-bold">Use GPS</span>
                                <span className="text-xs opacity-50">{settings.manualLocation ? "Manual Mode Active" : "Auto-detecting location"}</span>
                            </div>
                        </div>
                        <div
                            onClick={() => updateSettings({ manualLocation: !settings.manualLocation })}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${!settings.manualLocation ? 'bg-green-600' : 'bg-zinc-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${!settings.manualLocation ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {settings.manualLocation && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase opacity-50">Latitude</label>
                                <input
                                    type="number"
                                    className="bg-zinc-900 border border-zinc-700 rounded p-2 text-sm font-mono"
                                    value={settings.manualLat}
                                    onChange={(e) => updateSettings({ manualLat: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] uppercase opacity-50">Longitude</label>
                                <input
                                    type="number"
                                    className="bg-zinc-900 border border-zinc-700 rounded p-2 text-sm font-mono"
                                    value={settings.manualLng}
                                    onChange={(e) => updateSettings({ manualLng: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </section>

            <div className="mt-8 text-center opacity-30 text-xs font-mono">
                v1.0.0 (Build 2026.01.22)
            </div>
        </main>
    );
}
