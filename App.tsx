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
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <Provider>
                    <StatusBar
                        style={colorScheme === "dark" ? "light" : "dark"}
                    />
                    <AppNavigation />
                </Provider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
