import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import CategorySelector from "@/src/components/section/CategorySelector";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text } from "react-native";
import { ScrollView, View } from "react-native";

const PackageTypeScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const [form, setForm] = useState({
        pickupDetails: {},
        senderDetails: {},
        receiverDetails: {},
    });

    return (
        <SubAppLayout>
            <SubAppHeader title="Select package type" />
            <ScrollView className="flex-1 px-5 py-3">
                {/* Package Type */}
                <View>
                    <View>
                        <CategorySelector />
                    </View>
                    <View className="py-3">
                        <CustomInput
                            value={""}
                            setValue={() => {}}
                            placeholder="Please specify"
                            label="Please specify"
                        />
                    </View>
                </View>
                {/* End of Package Type */}

                <View className="pt-10 pb-5">
                    <View className="flex flex-row items-center justify-between px-2 py-3">
                        <Text className="font-medium text-base text-foreground">
                            Delivery fee:
                        </Text>
                        <Text className="font-semibold text-lg text-foreground">
                            ₦3,900
                        </Text>
                    </View>
                    <CustomButton
                        text="Proceed to payment"
                        action={() => navigate("PaymentMethod")}
                    />
                </View>
            </ScrollView>
        </SubAppLayout>
    );
};

export default PackageTypeScreen;
