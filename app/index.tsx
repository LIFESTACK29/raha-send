import { Button } from "@/src/components/button";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    View,
    ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
    id: string;
    title: string;
    description: string;
    image: any;
}

const onboardingData: OnboardingItem[] = [
    {
        id: "1",
        title: "Request for Delivery in few clicks",
        description:
            "On-demand delivery whenever and wherever the need arises.",
        image: require("@/src/assets/images/onboarding-1.jpg"),
    },
    {
        id: "2",
        title: "Fast & Reliable Delivery",
        description:
            "Get your packages delivered quickly and securely to your doorstep.",
        image: require("@/src/assets/images/onboarding-2.jpg"),
    },
    {
        id: "3",
        title: "Track Your Orders",
        description: "Stay updated with real-time tracking of your deliveries.",
        image: require("@/src/assets/images/onboarding-3.jpg"),
    },
];

export default function OnboardingScreen() {
    const scrollRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const insets = useSafeAreaInsets();

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index || 0);
            }
        },
    ).current;

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const goToNextSlide = () => {
        if (currentIndex < onboardingData.length - 1) {
            scrollRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            
            {/* Carousel */}
            <FlatList
                ref={scrollRef}
                data={onboardingData}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
                renderItem={({ item }) => (
                    <View style={{ width, height }}>
                        <ImageBackground
                            source={item.image}
                            className="flex-1"
                            resizeMode="cover"
                        >
                            {/* Dark Overlay for readability */}
                            <View 
                                className="flex-1 bg-black/40 px-8"
                                style={{ paddingTop: insets.top + 120, paddingBottom: insets.bottom + 180 }}
                            >
                                <View className="flex-1 justify-end mb-10">
                                    <Text className="text-4xl font-walsheim-bold text-white mb-4 leading-tight">
                                        {item.title}
                                    </Text>
                                    <Text className="text-lg font-walsheim text-white/90 leading-7">
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                )}
            />

            {/* Logo Overlay */}
            <View 
                style={{ position: 'absolute', top: insets.top + 20, left: 0, right: 0 }}
                className="items-center"
            >
                <Image
                    source={require("@/src/assets/images/logo.png")}
                    className="w-40 h-20"
                    resizeMode="contain"
                />
            </View>

            {/* Bottom Controls Overlay */}
            <View 
                style={{ position: 'absolute', bottom: insets.bottom + 40, left: 0, right: 0 }}
                className="px-8 items-center"
            >
                {/* Pagination Dots */}
                <View className="flex-row justify-center items-center mb-8 gap-2">
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            className={`h-1.5 rounded-full ${
                                index === currentIndex
                                    ? "w-8 bg-white"
                                    : "w-4 bg-white/40"
                            }`}
                        />
                    ))}
                </View>

                {/* Button Container */}
                <View className="w-full mb-6">
                    <Link href="/(auth)/login" asChild>
                        <Button
                            onPress={() => {}}
                            title="Get Started"
                            variant="secondary" // Using variant secondary for brand color
                            size="large"
                            style={{ borderRadius: 12 }}
                        />
                    </Link>
                </View>

                {/* Footer Text */}
                <View className="flex-row justify-center items-center gap-1">
                    <Text className="text-base font-walsheim text-white">
                        Have an account already?{" "}
                    </Text>
                    <Link href="/(auth)/login" asChild>
                        <Text className="text-base font-walsheim-bold text-white underline">
                            SIGN IN
                        </Text>
                    </Link>
                </View>
            </View>
        </View>
    );
}
