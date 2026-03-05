import { View, Text, Pressable, StyleSheet } from "react-native";
import { MapPin, Navigation, Package, Clock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";
import { useAtomValue } from "jotai";
import { activeDeliveryAtom } from "@/src/store/delivery";

const ActiveDeliveryCard = () => {
    const { navigate } = useNavigation<Nav>();
    const activeDelivery = useAtomValue(activeDeliveryAtom);

    if (!activeDelivery) return null;

    return (
        <View className="px-5 mt-6">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-foreground text-lg font-medium tracking-tight">
                    Current Delivery
                </Text>
                <View className="bg-accent-green/20 px-3 py-1.5 rounded-full">
                    <Text className="text-[#022401] text-[10px] font-bold tracking-tight">
                        ONGOING
                    </Text>
                </View>
            </View>

            <Pressable onPress={() => navigate("RiderOrders")}>
                <View
                    className="bg-white rounded-3xl p-5 border border-gray-100/80"
                    style={styles.cardShadow}
                >
                    {/* Top Row: Package Info */}
                    <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-[#FFEFD2] rounded-full items-center justify-center mr-3">
                                <Package size={18} color="#B08300" />
                            </View>
                            <View className="flex flex-col gap-0.5">
                                <Text className="text-foreground font-semibold text-[14px] tracking-tight mb-0.5">
                                    {activeDelivery.packageType}
                                </Text>
                                <Text className="text-gray-400 text-[10px] font-medium">
                                    ID: {activeDelivery.trackingId}
                                </Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-foreground font-bold text-base tracking-tight mb-0.5">
                                ₦{activeDelivery.fee?.toLocaleString()}
                            </Text>
                            <View className="flex-row items-center">
                                <Clock size={11} color="#9CA3AF" />
                                <Text className="text-gray-400 text-[10px] tracking-tight font-medium ml-1">
                                    15 min away
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Route Details */}
                    <View className="mb-5">
                        <View className="flex-row items-center mb-4">
                            <View className="w-6 items-center">
                                <View className="w-2 h-2 rounded-full bg-foreground" />
                                <View className="w-[1px] h-6 bg-gray-200 absolute top-3" />
                            </View>
                            <View className="flex-1 border-b border-gray-50 pb-3 ml-2">
                                <Text className="text-gray-400 text-[11px] font-medium tracking-tight mb-0.5 uppercase">
                                    Pickup
                                </Text>
                                <Text
                                    className="text-foreground font-medium text-sm tracking-tight"
                                    numberOfLines={1}
                                >
                                    {activeDelivery.pickupLocation}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-6 items-center">
                                <MapPin size={16} color="#f45900" />
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-[#f45900] text-[11px] font-bold tracking-tight mb-0.5 uppercase">
                                    Drop-off
                                </Text>
                                <Text
                                    className="text-foreground font-medium text-sm tracking-tight"
                                    numberOfLines={1}
                                >
                                    {activeDelivery.dropoffLocation}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View className="flex-row gap-3">
                        <Pressable className="flex-1 bg-[#022401] py-3.5 rounded-2xl flex-row items-center justify-center shadow-sm">
                            <Navigation size={17} color="#FFF" />
                            <Text className="text-white font-medium ml-2 text-[14px]">
                                Navigate
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
});

export default ActiveDeliveryCard;
