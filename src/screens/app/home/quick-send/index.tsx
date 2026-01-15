import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import CustomTextArea from "@/src/components/form/CustomTextArea";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import RoutePicker from "@/src/components/section/RoutePicker";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const QuickSendScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const [form, setForm] = useState({
        pickupDetails: {},
        senderDetails: {},
        receiverDetails: {},
    });

    return (
        <SubAppLayout>
            <SubAppHeader title="Send a package" />
            <ScrollView
                className="flex-1 px-5 py-3"
                showsVerticalScrollIndicator={false}
            >
                {/* Pickup Details */}
                <View>
                    <View>
                        <RoutePicker />
                    </View>
                    <View>
                        <CustomTextArea
                            value=""
                            setValue={() => {}}
                            label="Delivery note"
                            numberOfLines={2}
                            placeholder="Add a specific instruction for the rider (e.g. Gate code, Leave at the door)...)"
                        />
                    </View>
                </View>
                {/* End of Pickup Details */}

                {/* Sender Information */}
                <View className="py-4">
                    <View>
                        <Text className="text-xl text-foreground font-semibold">
                            Sender Information
                        </Text>
                        <Pressable className="flex flex-row items-center gap-2 py-2">
                            <View className="h-4 w-4 bg-white border border-accent rounded-full overflow-hidden p-0.5">
                                <View className="rounded-full w-full h-full bg-accent"></View>
                            </View>
                            <Text className="font-medium tracking-tight text-foreground/80 text-sm">
                                Use my account information
                            </Text>
                        </Pressable>
                    </View>
                    <View className="py-1.5 flex flex-col gap-2">
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Sender name"
                        />
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Sender phone number"
                        />
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Sender email"
                        />
                    </View>
                </View>
                {/* End of Sender Information */}

                {/* Receiver Information */}
                <View className="py-4">
                    <View>
                        <Text className="text-xl text-foreground font-semibold">
                            Receiver Information
                        </Text>
                    </View>
                    <View className="py-1.5 flex flex-col gap-2">
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Receiver name"
                        />
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Receiver phone number"
                        />
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Receiver email"
                        />
                    </View>
                </View>
                {/* End of Receiver Information */}
                <View className="pt-4 pb-10">
                    <CustomButton
                        text="Continue"
                        action={() => navigate("PackageType")}
                    />
                </View>
            </ScrollView>
        </SubAppLayout>
    );
};

export default QuickSendScreen;
