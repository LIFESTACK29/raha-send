import { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import { Bell, Package, Tag, Wallet } from "lucide-react-native";

// Mock Notification Data
type NotificationType = "delivery" | "promo" | "account" | "system";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    type: NotificationType;
}

const initialNotifications: Notification[] = [
    {
        id: "1",
        title: "Package Delivered",
        message: "Your package to Ozuoba has been delivered successfully.",
        time: "Just now",
        isRead: false,
        type: "delivery",
    },
    {
        id: "2",
        title: "50% Off Your Next Delivery",
        message: "Use code RAHA50 to get a 50% discount on your next ride.",
        time: "2 hours ago",
        isRead: false,
        type: "promo",
    },
    {
        id: "3",
        title: "Wallet Topped Up",
        message: "You have successfully added ₦5,000 to your wallet.",
        time: "Yesterday",
        isRead: true,
        type: "account",
    },
    {
        id: "4",
        title: "Welcome to RahaSend!",
        message: "We're glad to have you here. Start sending packages today.",
        time: "3 days ago",
        isRead: true,
        type: "system",
    },
];

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, isRead: true } : notif,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true })),
        );
    };

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "delivery":
                return <Package size={16} color="#022401" />;
            case "promo":
                return <Tag size={16} color="#f45900" />;
            case "account":
                return <Wallet size={16} color="#0066cc" />;
            default:
                return <Bell size={16} color="#666666" />;
        }
    };

    const getIconBg = (type: NotificationType) => {
        switch (type) {
            case "delivery":
                return "bg-accent-green/30";
            case "promo":
                return "bg-light-orange/30";
            case "account":
                return "bg-blue-100";
            default:
                return "bg-light-gray";
        }
    };

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center pt-32">
            <View className="bg-light-gray w-24 h-24 rounded-full items-center justify-center mb-6">
                <Bell size={40} color="#CCCCCC" />
            </View>
            <Text className="text-xl font-medium text-foreground tracking-tight mb-2">
                No notifications yet
            </Text>
            <Text className="text-sm text-gray-blue text-center px-8">
                When you get updates about your deliveries, promotions, or
                account, they'll show up here.
            </Text>
        </View>
    );

    const renderItem = ({ item }: { item: Notification }) => (
        <Pressable
            onPress={() => markAsRead(item.id)}
            className={`flex-row px-5 py-4 border-b border-gray-100 ${
                !item.isRead ? "bg-green-50/50" : "bg-white"
            }`}
        >
            <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${getIconBg(item.type)}`}
            >
                {getIcon(item.type)}
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                    <Text
                        className={`text-[14px] flex-1 mr-2 tracking-tight flex-wrap ${
                            !item.isRead
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground/80"
                        }`}
                    >
                        {item.title}
                    </Text>
                    <Text className="text-[10px] text-gray-blue mt-0.5">
                        {item.time}
                    </Text>
                </View>
                <Text
                    className={`text-[11.5px] leading-5 font-normal tracking-tight ${
                        !item.isRead ? "text-foreground/80" : "text-gray-blue"
                    }`}
                >
                    {item.message}
                </Text>
            </View>
            {!item.isRead && (
                <View className="w-2.5 h-2.5 rounded-full bg-primary absolute top-5 right-5" />
            )}
        </Pressable>
    );

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <SubAppLayout>
            <SubAppHeader title="Notifications" />

            <View className="flex-1">
                {notifications.length > 0 && (
                    <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
                        <Text className="text-sm font-medium text-foreground">
                            {unreadCount} Unread
                        </Text>
                        {unreadCount > 0 && (
                            <Pressable onPress={markAllAsRead}>
                                <Text className="text-sm font-semibold tracking-tight text-primary">
                                    Mark all as read
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        notifications.length === 0
                            ? { flex: 1 }
                            : { paddingBottom: 50 }
                    }
                />
            </View>
        </SubAppLayout>
    );
};

export default NotificationsScreen;
