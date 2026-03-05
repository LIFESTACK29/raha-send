import Ably from "ably";

// Use EXPO_PUBLIC prefix for Expo to expose variables to the React Native app.
const ABLY_API_KEY =
    process.env.EXPO_PUBLIC_ABLY_API_KEY || "dummy_key:dummy_secret";

export const ablyClient = new Ably.Realtime({ key: ABLY_API_KEY });

ablyClient.connection.on("connected", () => {
    console.log("✅ Mobile connected to Ably Realtime");
});

ablyClient.connection.on("failed", () => {
    console.log("❌ Mobile failed to connect to Ably");
});
