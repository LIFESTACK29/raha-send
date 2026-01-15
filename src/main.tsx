import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    createStackNavigator,
    TransitionPresets,
} from "@react-navigation/stack";

export const Stack = createStackNavigator();
export const Tab = createBottomTabNavigator();
export const TransitionScreenOptions = {
    headerShown: false,
    gestureEnabled: false,
    ...TransitionPresets.SlideFromRightIOS,
};
export const TabScreenOptions = {
    headerShown: false,
    gestureEnabled: false,
};
