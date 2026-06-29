import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { api } from "@/src/api/config";

// Show notifications while the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permission, obtain the native FCM device token, and
 * register it with the backend (PATCH /user/push-token). Best-effort: never
 * throws, so it can be called on startup without guarding.
 *
 * NOTE: FCM tokens require a dev/production build with Firebase configured
 * (google-services.json / GoogleService-Info.plist). It will no-op in Expo Go.
 */
export const registerPushToken = async (): Promise<void> => {
  try {
    if (!Device.isDevice) return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let granted = existing.granted;
    if (!granted && existing.canAskAgain) {
      const requested = await Notifications.requestPermissionsAsync();
      granted = requested.granted;
    }
    if (!granted) return;

    const { data: pushToken } = await Notifications.getDevicePushTokenAsync();
    if (!pushToken) return;

    await api.patch("/user/push-token", { pushToken });
  } catch {
    // Best-effort — push registration must never block the app.
  }
};
