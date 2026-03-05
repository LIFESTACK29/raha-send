import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import AppLayout from "@/src/layouts/AppLayout";
import OrderItem from "@/src/components/card/OrderItem";
import OrdersFilter from "@/src/components/section/OrdersFilter";
import { ORDERS, Order } from "@/src/data/orders";

const RiderOrdersScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredOrders =
        selectedFilter === "All"
            ? ORDERS
            : ORDERS.filter((order) => order.status === selectedFilter);

    return (
        <AppLayout>
            <View className="flex-1">
                {/* Header */}
                <View className="px-5 pt-2 pb-1">
                    <Text className="text-foreground text-2xl font-medium tracking-tight">
                        My Tasks
                    </Text>
                    <Text className="text-gray-blue text-sm mt-1 tracking-tight">
                        Manage your delivery requests
                    </Text>
                </View>

                {/* Filter Pills */}
                <View className="px-5">
                    <OrdersFilter
                        selected={selectedFilter}
                        onSelect={setSelectedFilter}
                    />
                </View>

                {/* Orders List */}
                <View className="flex-1 px-5">
                    <FlatList
                        data={filteredOrders}
                        keyExtractor={(item: Order) => item.id}
                        renderItem={({ item }: { item: Order }) => (
                            <OrderItem item={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 50,
                            paddingTop: 8,
                        }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20">
                                <Text className="text-gray-400 text-base font-medium">
                                    No tasks found
                                </Text>
                                <Text className="text-gray-300 text-sm mt-1">
                                    Your {selectedFilter.toLowerCase()} tasks
                                    will appear here
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </AppLayout>
    );
};

export default RiderOrdersScreen;
