import { Stack } from "expo-router";

export default function RidesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="confirm" />
      <Stack.Screen name="status" />
      <Stack.Screen name="post-ride" />
      <Stack.Screen name="history" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
