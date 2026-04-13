import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export async function initializePushNotifications() {
    if (!Capacitor.isNativePlatform()) {
        console.log("Not native platform, skipping push initialization");
        return;
    }

    // Request permission
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
        // Register with Apple / Firebase
        await PushNotifications.register();
    } else {
        console.warn("Push notification permission denied");
    }

    // Add Listeners
    PushNotifications.addListener('registration', (token) => {
        console.log('Push Registration Success. Token:', token.value);
        // TODO: Send token to backend
    });

    PushNotifications.addListener('registrationError', (error) => {
        console.error('Push Registration Error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push Received:', notification);
        // Show a local alert or update UI?
    });
}
