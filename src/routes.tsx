import {
    NavigationContainer,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Stack,
    Tab,
    TabScreenOptions,
    TransitionScreenOptions,
} from "@/src/main";
import SplashScreen from "@/src/screens/onboarding/Splash";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/notification/Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnboardingLayerOneScreen from "./screens/onboarding/LayerOne";
import OnboardingLayerTwoScreen from "./screens/onboarding/LayerTwo";
import OnboardingLayerThreeScreen from "./screens/onboarding/LayerThree";
import LoginScreen from "./screens/auth/Login";
import VerifyEmailScreen from "./screens/auth/VerifyEmail";
import CreateAccountScreen from "./screens/auth/CreateAccount";
import OnboardingScreen from "./screens/auth/Onboarding";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { cn } from "./lib/utils";
import { API_URL } from "./const";
import { userAtom } from "./store/user";
import { useAtom } from "jotai";
// import { useSetAtom } from "jotai";
import { Motorbike } from "lucide-react-native";
import AnimatedTabButton from "./components/misc/AnimatedTabButton";
import QuickSendScreen from "./screens/app/customer/home/quick-send";
import PackageTypeScreen from "./screens/app/customer/home/quick-send/PackageType";
import PaymentMethodScreen from "./screens/app/customer/home/quick-send/Payment";
import {
    bottomTabButtons,
    bottomTabButtonsRider,
} from "./data/bottomTabButtons";
import PersonalInformationScreen from "./screens/app/customer/profile/personal-information";
import SavedAddressesScreen from "./screens/app/customer/profile/addresses";
import AddAddressScreen from "./screens/app/customer/profile/addresses/add-address";
import NotificationsScreen from "./screens/app/customer/notifications";
import RiderPersonalInformationScreen from "./screens/app/rider/profile/personal-information";

const queryClient = new QueryClient();

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <ToastContainer />
                    <MainNavigator />
                </ToastProvider>
            </QueryClientProvider>
        </NavigationContainer>
    );
};

const MainNavigator = () => {
    const { isSignedIn, isLoaded, userId } = useAuth();
    const [user, setUser] = useAtom(userAtom);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        console.log("[Jotai State Tracker] Current user in atom:", user);
    }, [user]);

    useEffect(() => {
        const syncUserStatus = async () => {
            if (isSignedIn && userId && !user) {
                setIsAuthenticating(true);
                try {
                    const response = await fetch(
                        `${API_URL}/user/status/${userId}`,
                    );
                    const data = await response.json();

                    if (data.exists) {
                        setUser({
                            clerkId: userId,
                            email: data.user.email || "",
                            fullName: data.user.fullName || "",
                            phoneNumber: data.user.phoneNumber || "",
                            role: data.user.role,
                            isOnboarded: data.user.isOnboarded,
                            addresses: data.user.addresses || [],
                        });
                    }
                } catch (error) {
                    console.error(
                        "[MainNavigator] Status check failed:",
                        error,
                    );
                } finally {
                    setInitialLoading(false);
                    setIsAuthenticating(false);
                }
            } else {
                setInitialLoading(false);
            }
        };

        if (isLoaded) {
            syncUserStatus();
        }
    }, [isLoaded, isSignedIn, userId, user, setUser]);

    if (!isLoaded || (isSignedIn && initialLoading) || isAuthenticating) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                }}
            >
                <ActivityIndicator size="large" color="#022401" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={TransitionScreenOptions}>
            {!isSignedIn ? (
                <>
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingNavigator}
                    />
                    <Stack.Screen
                        name="Authentication"
                        component={AuthNavigator}
                    />
                </>
            ) : !user ? (
                <Stack.Screen
                    name="OnboardingForm"
                    component={OnboardingScreen}
                />
            ) : (
                <>
                    <Stack.Screen
                        name="MainApp"
                        component={AppNavigator}
                        initialParams={{ role: user.role }}
                    />
                    <Stack.Screen name="MainAppFull" component={AppNavigator} />
                    <Stack.Group>
                        <Stack.Screen
                            name="QuickSend"
                            component={QuickSendScreen}
                        />
                        <Stack.Screen
                            name="PackageType"
                            component={PackageTypeScreen}
                        />
                        <Stack.Screen
                            name="PaymentMethod"
                            component={PaymentMethodScreen}
                        />
                    </Stack.Group>
                    <Stack.Group>
                        <Stack.Screen
                            name="PersonalInformation"
                            component={PersonalInformationScreen}
                        />
                        <Stack.Screen
                            name="SavedAddresses"
                            component={SavedAddressesScreen}
                        />
                        <Stack.Screen
                            name="AddAddress"
                            component={AddAddressScreen}
                        />
                        <Stack.Screen
                            name="Notifications"
                            component={NotificationsScreen}
                        />
                        <Stack.Screen
                            name="RiderPersonalInformation"
                            component={RiderPersonalInformationScreen}
                        />
                    </Stack.Group>
                </>
            )}
        </Stack.Navigator>
    );
};

const OnboardingNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={TransitionScreenOptions}
        >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen
                name="OnboardingLayerOne"
                component={OnboardingLayerOneScreen}
            />
            <Stack.Screen
                name="OnboardingLayerTwo"
                component={OnboardingLayerTwoScreen}
            />
            <Stack.Screen
                name="OnboardingLayerThree"
                component={OnboardingLayerThreeScreen}
            />
        </Stack.Navigator>
    );
};

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="LoginAccount"
            screenOptions={TransitionScreenOptions}
        >
            <Stack.Screen name="LoginAccount" component={LoginScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
            />
            <Stack.Screen name="OnboardingForm" component={OnboardingScreen} />

            {/* <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
            /> */}
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const role = route.params?.role || "customer"; // Default to customer for now

    console.log("[AppNavigator] Rendering for role:", role);

    const tabs = role === "customer" ? bottomTabButtons : bottomTabButtonsRider;

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                ...TabScreenOptions,
                tabBarStyle: {
                    elevation: 0,
                    padding: 10,
                    paddingTop: 23,
                    borderWidth: 0,
                    borderColor: "#ffffff",
                    paddingBottom: Platform.OS === "android" ? 10 : 20,
                    height: Platform.OS === "android" ? 75 : 105,
                    display: "flex",
                    backgroundColor: "#ffffff",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    alignItems: "center",
                },
            }}
        >
            {tabs.map((button: any, index: number) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={button.title}
                        component={button.component}
                        listeners={
                            button.title.toLowerCase() === "main"
                                ? {
                                      tabPress: (e) => {
                                          e.preventDefault();
                                          navigation.navigate("QuickSend");
                                      },
                                  }
                                : undefined
                        }
                        options={{
                            // 1. Add the Custom Animated Button here
                            tabBarButton: (props) => (
                                <AnimatedTabButton {...props} />
                            ),

                            tabBarIcon: ({ focused }) =>
                                button.title.toLowerCase() !== "main" ? (
                                    button.icon(focused)
                                ) : (
                                    // Keep your existing design, but it will now animate!
                                    <View className="bg-foreground w-[65px] h-[65px] rounded-full border-2 border-white flex items-center justify-center mb-6 shadow-lg">
                                        <Motorbike
                                            size={28}
                                            color={"#ffffff"}
                                            strokeWidth={2}
                                        />
                                    </View>
                                ),
                            tabBarLabel: ({ children, focused }) => {
                                return (
                                    <>
                                        {children.toLowerCase() !== "main" && (
                                            <Text
                                                className={cn(
                                                    "font-medium text-xs mt-[1px] tracking-tight py-[2px]",
                                                    focused
                                                        ? "text-foreground"
                                                        : "text-gray-blue",
                                                )}
                                            >
                                                {children}
                                            </Text>
                                        )}
                                    </>
                                );
                            },
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
};

export default AppNavigation;
