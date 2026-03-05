import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Package, Check, Clock } from "lucide-react-native";
import { ablyClient } from "@/src/services/ably";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { API_URL } from "@/src/const";
import GorhomBottomSheet from "@/src/components/misc/CustomBottomSheet";
import { useAtom } from "jotai";
import { activeDeliveryAtom } from "@/src/store/delivery";

export default function IncomingDeliverySheet() {
    const { getToken, userId } = useAuth();
    const [_, setActiveDelivery] = useAtom(activeDeliveryAtom);
    const [delivery, setDelivery] = useState<any>(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const channel = ablyClient.channels.get("riders-pool");
        channel.subscribe("incoming_delivery", (message: any) => {
            console.log("New incoming delivery:", message.data);
            setDelivery(message.data);
            setVisible(true);
        });

        return () => {
            channel.unsubscribe();
        };
    }, [userId]);

    const closeSheet = () => setVisible(false);

    const handleAccept = async () => {
        if (!delivery) return;
        setIsAccepting(true);
        try {
            const token = await getToken();
            await axios.post(
                `${API_URL}/deliveries/${delivery._id}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            // Accepted!
            setActiveDelivery({
                ...delivery,
                status: "ONGOING",
                riderId: userId,
            });
            closeSheet();
            // TODO: Update global state or trigger a refresh for ActiveDeliveryCard
        } catch (error) {
            console.error(error);
            alert("This delivery was already accepted by someone else.");
            closeSheet();
        } finally {
            setIsAccepting(false);
        }
    };

    return (
        <GorhomBottomSheet
            visible={visible}
            onClose={() => {
                closeSheet();
                setTimeout(() => setDelivery(null), 300);
            }}
            snapPoints={["45%"]}
            backgroundColor="#F4F4F0"
        >
            {delivery && (
                <View className="px-5 pt-2">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-foreground text-xl font-bold tracking-tight">
                            New Delivery Request
                        </Text>
                        <View className="bg-accent-green/20 px-3 py-1.5 rounded-full">
                            <Text className="text-[#022401] font-bold text-xs tracking-tight">
                                ₦{delivery.fee?.toLocaleString() || "3,900"}
                            </Text>
                        </View>
                    </View>

                    <View
                        className="bg-white rounded-3xl p-4 mb-5"
                        style={styles.cardShadow}
                    >
                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-[#FFEFD2] rounded-full items-center justify-center mr-3">
                                <Package size={18} color="#B08300" />
                            </View>
                            <View>
                                <Text className="text-foreground font-semibold text-sm tracking-tight">
                                    {delivery.packageType}
                                </Text>
                                <Text className="text-gray-400 text-[11px] tracking-tight">
                                    {delivery.trackingId}
                                </Text>
                            </View>
                            <View className="ml-auto flex-row items-center">
                                <Clock size={12} color="#9CA3AF" />
                                <Text className="text-gray-400 text-[11px] tracking-tight font-medium ml-1">
                                    Just now
                                </Text>
                            </View>
                        </View>

                        <View className="pl-2">
                            <View className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

                            <View className="flex-row items-start mb-4 relative z-10">
                                <View className="w-4 h-4 rounded-full bg-white border-4 border-foreground mt-0.5 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs tracking-tight mb-0.5">
                                        Pickup
                                    </Text>
                                    <Text
                                        className="text-foreground font-semibold text-[14px] tracking-tight"
                                        numberOfLines={2}
                                    >
                                        {delivery.pickupLocation}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-start relative z-10">
                                <View className="w-4 h-4 rounded-full bg-white border-4 border-accent-green mt-0.5 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs tracking-tight mb-0.5">
                                        Dropoff
                                    </Text>
                                    <Text
                                        className="text-foreground font-semibold text-[14px] tracking-tight"
                                        numberOfLines={2}
                                    >
                                        {delivery.dropoffLocation}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={closeSheet}
                            className="flex-1 h-14 bg-white rounded-2xl flex-row items-center justify-center"
                            style={styles.actionBtn}
                        >
                            <Text className="text-foreground font-semibold tracking-tight text-[15px]">
                                Decline
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={handleAccept}
                            disabled={isAccepting}
                            className={`flex-1 h-14 bg-[#022401] rounded-2xl flex-row items-center justify-center ${
                                isAccepting ? "opacity-70" : "opacity-100"
                            }`}
                        >
                            {!isAccepting && <Check size={18} color="#FFF" />}
                            <Text className="text-white font-semibold ml-2 text-[15px] tracking-tight">
                                {isAccepting ? "Accepting..." : "Accept"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </GorhomBottomSheet>
    );
}

const styles = StyleSheet.create({
    cardShadow: {
        borderColor: "#D1D5DB40",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    actionBtn: {
        borderColor: "#D1D5DB60",
        borderWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
});
