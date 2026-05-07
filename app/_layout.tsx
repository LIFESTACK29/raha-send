import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { AppState, AppStateStatus } from "react-native";
import "react-native-reanimated";
import "../global.css";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/src/store/useAuthStore";
import { authService } from "@/src/api/authService";
import { ThemeColors } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: "index",
};

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "GTWalsheimPro": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Regular.ttf"),
        "GTWalsheimPro-Medium": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Medium.ttf"),
        "GTWalsheimPro-Bold": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Bold.ttf"),
    });

    const { token, isInitialized, setInitialized, setAuth, logout } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();
    const backgroundTimestamp = useRef<number | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("token");
                const storedUserParam = await SecureStore.getItemAsync("user");

                if (storedToken && storedUserParam) {
                    try {
                        const response = await authService.getCurrentUser();
                        setAuth(response.user, storedToken);
                        await SecureStore.setItemAsync("user", JSON.stringify(response.user));
                    } catch (e) {
                        await SecureStore.deleteItemAsync("token");
                        await SecureStore.deleteItemAsync("user");
                    }
                }
            } catch (error) {
                console.error("Token verification failed", error);
            } finally {
                setInitialized(true);
            }
        };

        if (fontsLoaded || error) {
            initAuth();
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    // Inactivity timeout — clear session if app is backgrounded for >15 min
    useEffect(() => {
        const handleAppStateChange = (nextState: AppStateStatus) => {
            if (nextState === "background" || nextState === "inactive") {
                backgroundTimestamp.current = Date.now();
            } else if (nextState === "active") {
                if (
                    backgroundTimestamp.current !== null &&
                    Date.now() - backgroundTimestamp.current > INACTIVITY_LIMIT_MS
                ) {
                    logout();
                }
                backgroundTimestamp.current = null;
            }
        };

        const sub = AppState.addEventListener("change", handleAppStateChange);
        return () => sub.remove();
    }, [logout]);

    useEffect(() => {
        if (!isInitialized || !fontsLoaded) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inTabsGroup = segments[0] === "(tabs)";
        const isRoot = segments.length === 0 || (segments.length === 1 && segments[0] === "index");

        if (token) {
            if (inAuthGroup || isRoot) {
                router.replace("/(tabs)");
            }
        } else {
            const inDeliveryGroup = segments[0] === "delivery";
            if (inTabsGroup || inDeliveryGroup) {
                router.replace("/(auth)/login");
            }
        }
    }, [token, isInitialized, segments, fontsLoaded]);

    if (!fontsLoaded && !error) {
        return null;
    }

    const navigationTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: ThemeColors.background,
            primary: ThemeColors.foreground,
        },
    };

    return (
        <ThemeProvider value={navigationTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="delivery" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
