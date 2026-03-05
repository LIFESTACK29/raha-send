import { View, Text, StyleSheet } from "react-native";
import { Banknote, CheckCircle2, TrendingUp } from "lucide-react-native";

const RiderStatsCard = () => {
    return (
        <View className="px-5 mt-2">
            <View
                className="bg-[#022401] rounded-3xl p-5"
                // style={styles.cardShadow}
            >
                {/* Header Row */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-white/70 text-sm font-medium tracking-tight mb-1">
                            Today's Earnings
                        </Text>
                        <Text className="text-white text-3xl font-semibold tracking-tight">
                            ₦14,500
                        </Text>
                    </View>
                    <View className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
                        <Banknote size={22} color="#FFF" />
                    </View>
                </View>

                {/* Sub Stats Row */}
                <View className="flex-row items-center justify-between border-t border-white/10 pt-5">
                    <View className="flex-1 items-center border-r border-white/10">
                        <View className="w-8 h-8 rounded-full bg-accent-green/20 items-center justify-center mb-2">
                            <CheckCircle2 size={16} color="#4ADE80" />
                        </View>
                        <Text className="text-white/70 text-xs font-medium mb-1 tracking-tight">
                            Deliveries
                        </Text>
                        <Text className="text-white font-semibold text-lg">
                            8
                        </Text>
                    </View>

                    <View className="flex-1 items-center">
                        <View className="w-8 h-8 rounded-full bg-[#f45900]/20 items-center justify-center mb-2">
                            <TrendingUp size={16} color="#EAB308" />
                        </View>
                        <Text className="text-white/70 text-xs font-medium mb-1 tracking-tight">
                            Acceptance
                        </Text>
                        <Text className="text-white font-semibold text-lg">
                            96%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#022401",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
});

export default RiderStatsCard;
