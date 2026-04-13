import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export async function initializeBackgroundLogic() {
    if (!Capacitor.isNativePlatform()) return;

    // Request Local Notification Permission
    await LocalNotifications.requestPermissions();

    // Listen for App Resume (Foregrounding)
    App.addListener('resume', async () => {
        console.log("App resumed, checking for Aurora...");
        await checkForAurora();
    });

    // Also check on startup
    await checkForAurora();
}

async function checkForAurora() {
    // Mock check - in reality, we would fetch fresh data from API here
    // If the "GO" condition is met, we notify the user.

    const isGoCondition = Math.random() > 0.8; // 20% chance for simulation

    if (isGoCondition) {
        await scheduleNotification();
    }
}

async function scheduleNotification() {
    await LocalNotifications.schedule({
        notifications: [
            {
                title: "Aurora Detected!",
                body: "High activity and clear skies. Go out now!",
                id: 1,
                schedule: { at: new Date(Date.now() + 1000) }, // 1 sec from now
                sound: undefined,
                attachments: undefined,
                actionTypeId: "",
                extra: null
            }
        ]
    });
}
