"use client";

import { useEffect } from "react";
import { initializePushNotifications } from "@/lib/native/push";
import { initializeBackgroundLogic } from "@/lib/native/background";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from '@capacitor/status-bar';

export function NativeLifecycleManager() {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            // 1. Initialize Push
            initializePushNotifications();

            // 2. Initialize Background/Resume Checks
            initializeBackgroundLogic();

            // 3. Set Status Bar to Dark (Red Mode compatible)
            try {
                StatusBar.setStyle({ style: Style.Dark });
                StatusBar.setBackgroundColor({ color: '#000000' }); // Black
            } catch (e) {
                console.warn("Status Bar plugin not available or failed", e);
            }
        }
    }, []);

    return null;
}
