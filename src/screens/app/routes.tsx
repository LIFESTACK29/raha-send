import { createStackNavigator } from "@react-navigation/stack";
import { TransitionScreenOptions } from "@/src/main";

// Customer Screens
import CustomerHomeScreen from "./customer/home";
import CustomerProfileScreen from "./customer/profile";
import CustomerOrdersScreen from "./customer/orders";
import CustomerSupportScreen from "./customer/support";

// Rider Screens
import RiderHomeScreen from "./rider/home";
import RiderProfileScreen from "./rider/profile";
import RiderOrdersScreen from "./rider/orders";
import RiderSupportScreen from "./rider/support";

const Stack = createStackNavigator();

// Customer Routes
const HomeRoute = () => (
    <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="HomeScreen" component={CustomerHomeScreen} />
    </Stack.Navigator>
);

const OrdersRoute = () => (
    <Stack.Navigator
        initialRouteName="OrdersScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="OrdersScreen" component={CustomerOrdersScreen} />
    </Stack.Navigator>
);

const SupportRoute = () => (
    <Stack.Navigator
        initialRouteName="SupportScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="SupportScreen" component={CustomerSupportScreen} />
    </Stack.Navigator>
);

const ProfileRoute = () => (
    <Stack.Navigator
        initialRouteName="ProfileScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="ProfileScreen" component={CustomerProfileScreen} />
    </Stack.Navigator>
);

// Rider Routes
const RiderHomeRoute = () => (
    <Stack.Navigator
        initialRouteName="RiderHomeScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="RiderHomeScreen" component={RiderHomeScreen} />
    </Stack.Navigator>
);

const RiderOrdersRoute = () => (
    <Stack.Navigator
        initialRouteName="RiderOrdersScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen name="RiderOrdersScreen" component={RiderOrdersScreen} />
    </Stack.Navigator>
);

const RiderSupportRoute = () => (
    <Stack.Navigator
        initialRouteName="RiderSupportScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen
            name="RiderSupportScreen"
            component={RiderSupportScreen}
        />
    </Stack.Navigator>
);

const RiderProfileRoute = () => (
    <Stack.Navigator
        initialRouteName="RiderProfileScreen"
        screenOptions={TransitionScreenOptions}
    >
        <Stack.Screen
            name="RiderProfileScreen"
            component={RiderProfileScreen}
        />
    </Stack.Navigator>
);

export {
    HomeRoute,
    OrdersRoute,
    SupportRoute,
    ProfileRoute,
    RiderHomeRoute,
    RiderOrdersRoute,
    RiderSupportRoute,
    RiderProfileRoute,
};
