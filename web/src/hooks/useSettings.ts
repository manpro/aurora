import { useState, useEffect } from "react";
import { Preferences } from '@capacitor/preferences';

export interface AppSettings {
    kpThreshold: number; // 0-9
    cloudThreshold: number; // 0-100
    notificationEnabled: boolean;
    manualLocation: boolean;
    manualLat: number;
    manualLng: number;
}

const DEFAULT_SETTINGS: AppSettings = {
    kpThreshold: 4,
    cloudThreshold: 30, // Notify only if clouds < 30%
    notificationEnabled: true,
    manualLocation: false,
    manualLat: 68.35, // Abisko default
    manualLng: 18.78
};

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { value } = await Preferences.get({ key: 'app_settings' });
            if (value) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(value) });
            }
            setLoaded(true);
        } catch (e) {
            console.error("Failed to load settings", e);
            setLoaded(true);
        }
    };

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        const merged = { ...settings, ...newSettings };
        setSettings(merged);
        try {
            await Preferences.set({
                key: 'app_settings',
                value: JSON.stringify(merged)
            });
        } catch (e) {
            console.error("Failed to save settings", e);
        }
    };

    return { settings, updateSettings, loaded };
}
