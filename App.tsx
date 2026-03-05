import "react-native-reanimated";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "jotai";
import { useFonts } from "expo-font";
import { useColorScheme } from "nativewind";
import "./global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigation from "./src/routes";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used 🔐 \n`);
            } else {
                console.log("No values stored under key: " + key);
            }
            return item;
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
}

export default function App() {
    const { colorScheme } = useColorScheme();
    const [loaded, error] = useFonts({
        "GTWP-CondensedBlack": require("./assets/fonts/gt-walshiem-pro/GTWalsheimPro-CondensedBlack.ttf"),
        "GTWP-CondensedBold": require("./assets/fonts/gt-walshiem-pro/GTWalsheimPro-CondensedBold.ttf"),
        "GTWP-CondensedMedium": require("./assets/fonts/gt-walshiem-pro/GTWalsheimPro-CondensedMedium.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded) {
        return null;
    }

    if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#000000");
    }

    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>
                <SafeAreaProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <Provider>
                            <BottomSheetModalProvider>
                                <StatusBar
                                    style={
                                        colorScheme === "dark"
                                            ? "light"
                                            : "dark"
                                    }
                                />
                                <AppNavigation />
                            </BottomSheetModalProvider>
                        </Provider>
                    </GestureHandlerRootView>
                </SafeAreaProvider>
            </ClerkLoaded>
        </ClerkProvider>
    );
}
