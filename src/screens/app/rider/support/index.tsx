import { ScrollView, Text, View } from "react-native";
import AppLayout from "@/src/layouts/AppLayout";
import SupportActionCard from "@/src/components/card/SupportActionCard";
import FAQItem from "@/src/components/card/FAQItem";
import { RIDER_FAQ_ITEMS, FAQItemType } from "@/src/data/faqItems";

const RiderSupportScreen = () => {
    return (
        <AppLayout>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                {/* Header */}
                <View className="px-5 pt-2 pb-4">
                    <Text className="text-foreground text-2xl font-medium tracking-tight">
                        Help & Support
                    </Text>
                    <Text className="text-gray-blue text-sm mt-1 tracking-tight">
                        We're here to help you get back on the road
                    </Text>
                </View>

                {/* Contact Methods */}
                <View className="px-5 pb-6">
                    <SupportActionCard />
                </View>

                {/* FAQ Section */}
                <View className="px-5 py-2">
                    <Text className="text-xl font-medium text-foreground tracking-tight mb-4">
                        Frequently Asked Questions
                    </Text>
                    {RIDER_FAQ_ITEMS.map((item: FAQItemType) => (
                        <FAQItem key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView>
        </AppLayout>
    );
};

export default RiderSupportScreen;
