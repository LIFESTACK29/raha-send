import { View, ScrollView, Text } from "react-native";
import AppLayout from "@/src/layouts/AppLayout";
import RiderHomeHeader from "@/src/components/navigation/RiderHomeHeader";
import RiderStatsCard from "@/src/components/card/RiderStatsCard";
import ActiveDeliveryCard from "@/src/components/card/ActiveDeliveryCard";
import IncomingDeliverySheet from "@/src/components/section/IncomingDeliverySheet";
import { useAtomValue } from "jotai";
import { activeDeliveryAtom } from "@/src/store/delivery";
import OrderItem from "@/src/components/card/OrderItem";
import { ORDERS } from "@/src/data/orders";
import { Package } from "lucide-react-native";

const RiderHomeScreen = () => {
    const activeDelivery = useAtomValue(activeDeliveryAtom);
    const recentDeliveries = ORDERS.slice(0, 3);
    return (
        <AppLayout>
            <View className="flex-1">
                <RiderHomeHeader />
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <RiderStatsCard />
                    <ActiveDeliveryCard />

                    {!activeDelivery && (
                        <View className="px-5 mt-6">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-foreground text-lg font-medium tracking-tight">
                                    Recent Deliveries
                                </Text>
                            </View>
                            {recentDeliveries.length > 0 ? (
                                recentDeliveries.map((order) => (
                                    <View key={order.id}>
                                        <OrderItem item={order} />
                                    </View>
                                ))
                            ) : (
                                <View className="items-center justify-center py-10 my-4 bg-white rounded-3xl border border-gray-100/80">
                                    <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-3">
                                        <Package size={20} color="#9CA3AF" />
                                    </View>
                                    <Text className="text-gray-400 text-sm font-medium">
                                        No active or ongoing delivery
                                    </Text>
                                    <Text className="text-gray-300 text-xs mt-1">
                                        New requests will appear here
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
            <IncomingDeliverySheet />
        </AppLayout>
    );
};

export default RiderHomeScreen;
