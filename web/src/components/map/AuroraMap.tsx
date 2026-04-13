"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useRedMode } from "@/context/RedModeContext";
import { useSightings } from "@/hooks/useSightings";

// Fix Leaflet clean icon issue
const icon = L.icon({
    iconUrl: "/icons/icon-192x192.png", // Fallback to our app icon for now
    iconSize: [24, 24],
});

export default function AuroraMap() {
    const { isRedMode } = useRedMode();

    // Dark variant vs Red Mode variant??
    // For Red Mode we ideally want a pure red/black map.
    // Standard "Dark Matter" or "CartoDB Dark" is good for default.
    // CSS filters can force Red Mode look over standard tiles.

    const [ovalPoints, setOvalPoints] = useState<any[]>([]);
    const sightings = useSightings();

    useEffect(() => {
        // Fetch Oval Client-side
        import("@/lib/api/ovation").then(({ fetchAuroraOval }) => {
            fetchAuroraOval().then(setOvalPoints);
        });
    }, []);

    const tileLayer = isRedMode
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    return (
        <div className={`w-full h-full rounded-2xl overflow-hidden relative z-0 ${isRedMode ? 'grayscale contrast-125 brightness-75 sepia hue-rotate-[-50deg]' : ''}`}>
            {/* CSS Filter hack above for Red Mode map without custom tiles */}
            <MapContainer
                center={[68.35, 18.78]} // Abisko
                zoom={3} // Zoom out to see oval
                scrollWheelZoom={false}
                className="w-full h-full bg-black"
                style={{ background: '#000' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tileLayer}
                />

                {/* Aurora Oval Points */}
                {ovalPoints.map((p, i) => (
                    <CircleMarker
                        key={i}
                        center={[p.lat, p.long]}
                        radius={2}
                        pathOptions={{
                            fillColor: '#00ff00',
                            fillOpacity: p.value / 100,
                            stroke: false
                        }}
                    />
                ))}

                {/* Real-time Sightings */}
                {sightings.map((s) => (
                    <CircleMarker
                        key={s.id}
                        center={[s.lat, s.lng]}
                        radius={6}
                        pathOptions={{
                            fillColor: s.intensity === 'STRONG' ? '#ff0000' : '#ffff00',
                            fillOpacity: 0.8,
                            stroke: false
                        }}
                    >
                        <Popup>Verified Sighting<br />{s.intensity}</Popup>
                    </CircleMarker>
                ))}

                <Marker position={[68.35, 18.78]} icon={icon}>
                    <Popup>
                        Abisko <br /> Best Aurora spot.
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Overlay to ensure no bright white parts leak */}
            {isRedMode && <div className="absolute inset-0 bg-red-900/10 pointer-events-none z-[1000]" />}
        </div>
    );
}
