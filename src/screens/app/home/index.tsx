import AdvertCard from "@/src/components/card/AdvertCard";
import ServiceActionCard from "@/src/components/card/ServiceActionCard";
import HomeHeader from "@/src/components/navigation/HomeHeader";
import RecentActivity from "@/src/components/section/RecentActivity";
import AppLayout from "@/src/layouts/AppLayout";
import { View } from "react-native";

const HomeScreen = () => {
    return (
        <AppLayout>
            <View className="flex-1">
                <HomeHeader />
                <AdvertCard />
                <ServiceActionCard />
                <RecentActivity />
            </View>
        </AppLayout>
    );
};

export default HomeScreen;
