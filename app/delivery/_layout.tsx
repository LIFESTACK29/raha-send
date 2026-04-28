import { Stack } from "expo-router";
import React from "react";

export default function DeliveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="matching-rider" />
      <Stack.Screen name="manual-pending" />
      <Stack.Screen name="confirmed" />
    </Stack>
  );
}
