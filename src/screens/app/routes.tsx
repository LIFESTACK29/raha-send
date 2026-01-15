import { createStackNavigator } from "@react-navigation/stack";
import { TransitionScreenOptions } from "@/src/main";
import HomeScreen from "./home";
import ProfileScreen from "./profile";

const Stack = createStackNavigator();

const HomeRoute = () => {
    return (
        <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={TransitionScreenOptions}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
    );
};

const ProfileRoute = () => {
    return (
        <Stack.Navigator
            initialRouteName="ProfileScreen"
            screenOptions={TransitionScreenOptions}
        >
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export { HomeRoute, ProfileRoute };
