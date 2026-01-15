import { NavigationContainer } from "@react-navigation/native";
import {
    Stack,
    Tab,
    TabScreenOptions,
    TransitionScreenOptions,
} from "@/src/main";
import SplashScreen from "@/src/screens/onboarding/Splash";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/notification/Toast";
import OnboardingLayerOneScreen from "./screens/onboarding/LayerOne";
import OnboardingLayerTwoScreen from "./screens/onboarding/LayerTwo";
import OnboardingLayerThreeScreen from "./screens/onboarding/LayerThree";
import LoginScreen from "./screens/auth/Login";
import VerifyEmailScreen from "./screens/auth/VerifyEmail";
import CreateAccountScreen from "./screens/auth/CreateAccount";
import { Platform, Pressable, Text, View } from "react-native";
import { bottomTabButtons } from "./data/bottomTabButtons";
import { cn } from "./lib/utils";
import { PlaneTakeoff } from "lucide-react-native";
import AnimatedTabButton from "./components/misc/AnimatedTabButton";
import QuickSendScreen from "./screens/app/home/quick-send";
import PackageTypeScreen from "./screens/app/home/quick-send/PackageType";
import PaymentMethodScreen from "./screens/app/home/quick-send/Payment";

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <ToastProvider>
                <ToastContainer />
                <MainNavigator />
            </ToastProvider>
        </NavigationContainer>
    );
};

const MainNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={TransitionScreenOptions}
        >
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="Authentication" component={AuthNavigator} />
            <Stack.Screen name="MainApp" component={AppNavigator} />

            {/* Home Group */}
            <Stack.Group>
                <Stack.Screen name="QuickSend" component={QuickSendScreen} />
                <Stack.Screen
                    name="PackageType"
                    component={PackageTypeScreen}
                />
                <Stack.Screen
                    name="PaymentMethod"
                    component={PaymentMethodScreen}
                />
            </Stack.Group>
            {/* End Of Home Group */}
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
            {bottomTabButtons.map((button: any, index: number) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={button.title}
                        component={button.component}
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
                                    <View className="bg-foreground w-[65px] h-[65px] rounded-full border-2 border-white flex items-center justify-center -rotate-12 mb-6 shadow-lg">
                                        <PlaneTakeoff color={"#ffffff"} />
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
                                                        : "text-gray-blue"
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
