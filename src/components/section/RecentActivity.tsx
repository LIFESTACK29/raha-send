import {
    RECENT_ACTIVITIES,
    RecentActivity as RCA,
} from "@/src/data/recentActivities";
import { FlatList, Pressable, Text, View } from "react-native";
import RecentActivityItem from "../card/RecentActivityItem";

const RecentActivity = () => {
    return (
        <View className="px-5 py-8">
            <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-foreground tracking-tight">
                    Recent Activity
                </Text>
                <Pressable className="px-3 h-10 flex flex-row items-center justify-center">
                    <Text className="text-accent text-base font-medium ">
                        View All
                    </Text>
                </Pressable>
            </View>
            <View className="py-3">
                <FlatList
                    data={RECENT_ACTIVITIES.slice(0, 2)}
                    keyExtractor={(item: RCA) => item.id}
                    renderItem={({ item }: { item: RCA }) => (
                        <RecentActivityItem item={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    // This padding ensures the bottom shadows of the last item are visible
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>
        </View>
    );
};

export default RecentActivity;
