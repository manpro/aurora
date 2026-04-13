"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRedMode } from "@/context/RedModeContext";
import { BigButton } from "@/components/ui/BigButton";
import { GlassCard } from "@/components/ui/GlassCard"; // NEW
import { Moon, Cloud, Navigation, Eye, Menu, Sparkles, Activity } from "lucide-react";
import { useAuroraStatus } from "@/hooks/useAuroraStatus";
import { ObservationModal } from "@/components/observation/ObservationModal";
import { BetterSpotsWidget } from "@/components/home/BetterSpotsWidget";
import { ForecastGraph } from "@/components/forecast/ForecastGraph";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // NEW

const AuroraMap = dynamic(() => import("@/components/map/AuroraMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 animate-pulse rounded-2xl" />
});

import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function Home() {
  usePullToRefresh();
  const { isRedMode, toggleRedMode } = useRedMode();
  const status = useAuroraStatus();
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Loading state
  if (!status) return (
    <div className="min-h-screen flex items-center justify-center text-zinc-500 font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <span className="tracking-widest text-xs uppercase opacity-50">Calibrating Sensors...</span>
      </div>
    </div>
  );

  const { recommendation, metrics, weather, ground } = status;
  const isGo = recommendation.goOut;

  // Variant for the pulsing orb
  const orbVariant = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: isGo ? 1.5 : 4, // Fast pulse if GO, slow "breathing" if STAY
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const orbColor = isGo
    ? (isRedMode ? 'bg-red-600 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50')
    : (isRedMode ? 'bg-red-900/30 shadow-red-900/20' : 'bg-slate-500/30 shadow-slate-500/20');

  return (
    <main className="min-h-screen p-4 pb-28 flex flex-col gap-6 max-w-md mx-auto selection:bg-emerald-500/30">

      {/* Dynamic Background Elements (Stars/Glow) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {!isRedMode && <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen" />}
        {!isRedMode && <div className="absolute top-40 -left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-[80px] mix-blend-screen" />}
      </div>

      {/* Header */}
      <header className="flex justify-between items-center py-2 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400 opacity-80" />
          <h1 className="text-xl font-bold tracking-[0.2em] opacity-90">AURORA</h1>
        </div>
        <button
          onClick={toggleRedMode}
          className="p-3 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
          aria-label="Toggle Red Mode"
        >
          <div className={`w-3 h-3 rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${isRedMode ? 'bg-red-500 text-red-500' : 'bg-emerald-400 text-emerald-400'}`} />
        </button>
      </header>

      {/* Hero Decision Status (The Pulsing Orb) */}
      <section className="flex flex-col justify-center relative">
        <GlassCard
          variant={isGo ? (isRedMode ? "alert" : "active") : "default"}
          className="flex flex-col items-center justify-center aspect-square text-center gap-6"
        >
          {/* The Orb */}
          <div className="relative">
            <motion.div
              variants={orbVariant}
              animate="pulse"
              className={`w-32 h-32 rounded-full blur-2xl absolute inset-0 ${orbColor}`}
            />
            <div className="relative z-10 w-32 h-32 flex items-center justify-center">
              {/* HPI or Icon here */}
              {isGo ? <Sparkles className="w-12 h-12 text-white drop-shadow-lg" /> : <Moon className="w-12 h-12 opacity-50" />}
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl"
            >
              {recommendation.text}
            </motion.h2>
            <p className="text-lg opacity-80 max-w-[220px] mx-auto leading-tight font-light">
              {recommendation.description}
            </p>
          </div>

          {/* Live Metrics Pill */}
          <div className="flex gap-2 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
              <div className={`w-2 h-2 rounded-full ${ground && ground.db_dt > 20 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-[10px] uppercase tracking-widest font-mono opacity-70">
                {ground ? `TGO: ${ground.db_dt.toFixed(1)} nT/m` : 'SAT ONLY'}
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Map Section */}
      <GlassCard className="h-64 !p-0 relative group">
        <AuroraMap />
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono border border-white/10 pointer-events-none">
          LIVE OVAL + SIGHTINGS
        </div>
      </GlassCard>

      {/* Vital Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="flex flex-col items-center justify-center gap-1 h-32 !p-4">
          <Moon className="w-6 h-6 opacity-50 mb-2" />
          <span className="text-3xl font-bold tracking-tighter">{weather.moonIllumination}%</span>
          <span className="text-[10px] uppercase tracking-widest opacity-40">Illumination</span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center gap-1 h-32 !p-4">
          {/* Visualizing Clouds as a mini-bar */}
          <Cloud className="w-6 h-6 opacity-50 mb-2" />
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tighter">{weather.cloudCover}%</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-40">Cloud Cover</span>
        </GlassCard>
      </div>

      {/* Magnetometer Live Graph (Sparkline MVP) */}
      {ground && (
        <GlassCard className="!p-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">Magnetometer (Tromsø)</span>
            </div>
            <span className={`text-xs font-mono ${ground.db_dt > 20 ? 'text-red-400 font-bold' : 'opacity-50'}`}>
              {ground.db_dt.toFixed(2)} dB/dt
            </span>
          </div>

          {/* Visual Bar representation of intensity (since we don't have historical array in MVP, we show current intensity bar) */}
          <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden relative">
            {/* Safe Zone */}
            <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-emerald-500/20 border-r border-white/10" />
            {/* Activity Zone */}
            <div className="absolute left-[40%] top-0 bottom-0 w-[40%] bg-yellow-500/20 border-r border-white/10" />
            {/* Storm Zone */}
            <div className="absolute left-[80%] top-0 bottom-0 w-[20%] bg-red-500/20" />

            {/* The Needle */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: `${Math.min(ground.db_dt * 2, 100)}%` }} // Scaling: 50 nT = 100%
              transition={{ type: "spring", stiffness: 100 }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
            />
          </div>
          <div className="flex justify-between text-[8px] opacity-30 font-mono mt-1">
            <span>0</span>
            <span>25</span>
            <span>50 nT/min</span>
          </div>
        </GlassCard>
      )}

      <BetterSpotsWidget />

      {/* Forecast Graph */}
      {status.forecast && (
        <ForecastGraph
          kpData={status.forecast.kp}
          cloudData={status.forecast.clouds}
        />
      )}

      {/* Action Bar */}
      <div className="flex gap-4">
        <BigButton
          variant="primary"
          fullWidth
          className="h-16 text-xl bg-gradient-to-r from-emerald-600 to-teal-600 border-none shadow-lg shadow-emerald-900/40"
          onClick={() => setIsLogOpen(true)}
        >
          LOG SIGHTING
        </BigButton>
      </div>

      {/* Modals */}
      <ObservationModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        predictedVisibility={metrics.visibility.label}
      />

      {/* Nav Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/80 backdrop-blur-xl flex justify-around shadow-2xl z-50">
        <Link href="/settings"><Menu className="text-white/50 hover:text-white transition-colors w-6 h-6" /></Link>
        <Eye className={`w-8 h-8 -mt-1 transition-colors ${isRedMode ? 'text-red-500 drop-shadow-[0_0_10px_red]' : 'text-white'}`} />
        <Link href="/about"><Navigation className="text-white/50 hover:text-white transition-colors w-6 h-6" /></Link>
      </nav>
    </main>
  );
}
