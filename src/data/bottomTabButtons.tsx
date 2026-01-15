import { HomeRoute, ProfileRoute } from "@/src/screens/app/routes";
import HomeIcon from "@/src/assets/icons/navigation/HomeIcon";
import MessageIcon from "@/src/assets/icons/navigation/MessageIcon";
import UserIcon from "@/src/assets/icons/navigation/UserIcon";
import OrderIcon from "../assets/icons/navigation/OrderIcon";

const activeColor = "#022401";
const inActiveColor = "#B3B3B3";

export const bottomTabButtons = [
    {
        title: "Home",
        routeTitle: "Home",
        component: HomeRoute,
        icon: (active: boolean) => (
            <HomeIcon
                color={active ? activeColor : inActiveColor}
                size={{ width: "22", height: "22" }}
            />
        ),
    },
    {
        title: "Orders",
        routeTitle: "Orders",
        component: HomeRoute,
        icon: (active: boolean) => (
            <OrderIcon
                color={active ? activeColor : inActiveColor}
                size={{ width: "22", height: "22" }}
            />
        ),
    },
    {
        title: "Main",
        routeTitle: "Main",
        component: HomeRoute,
        icon: (active: boolean) => (
            <HomeIcon
                color={active ? activeColor : inActiveColor}
                size={{ width: "60", height: "60" }}
            />
        ),
    },
    {
        title: "Support",
        routeTitle: "Support",
        component: HomeRoute,
        icon: (active: boolean) => (
            <MessageIcon
                color={active ? activeColor : inActiveColor}
                size={{ width: "22", height: "22" }}
            />
        ),
    },
    {
        title: "Profile",
        routeTitle: "Profile",
        component: ProfileRoute,
        icon: (active: boolean) => (
            <UserIcon
                color={active ? activeColor : inActiveColor}
                size={{ width: "22", height: "22" }}
            />
        ),
    },
];
