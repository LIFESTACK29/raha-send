import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, SplashScreen, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/src/store/useAuthStore";
import { authService } from "@/src/api/authService";
import { ThemeColors } from "@/constants/theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: "index",
};

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        "GTWalsheimPro": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Regular.ttf"),
        "GTWalsheimPro-Medium": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Medium.ttf"),
        "GTWalsheimPro-Bold": require("../src/assets/fonts/gt-walshiem-pro/GTWalsheimPro-Bold.ttf"),
    });

    const { token, isInitialized, setInitialized, setAuth } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                const storedUserParam = await AsyncStorage.getItem("user");

                if (storedToken && storedUserParam) {
                    try {
                        const response = await authService.getCurrentUser();
                        setAuth(response.user, storedToken);
                        await AsyncStorage.setItem("user", JSON.stringify(response.user));
                    } catch (e) {
                        // Token invalid/expired
                        await AsyncStorage.multiRemove(["token", "user"]);
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

    useEffect(() => {
        if (!isInitialized || !fontsLoaded) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inTabsGroup = segments[0] === "(tabs)";
        const isRoot = segments.length === 0 || (segments.length === 1 && segments[0] === "index");

        if (token) {
            // User is authenticated
            if (inAuthGroup || isRoot) {
                router.replace("/(tabs)");
            }
        } else {
            // User is not authenticated
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
