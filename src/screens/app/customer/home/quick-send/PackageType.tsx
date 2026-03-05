import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import CategorySelector from "@/src/components/section/CategorySelector";
import FindRiderSheet from "@/src/components/section/FindRiderSheet";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { useState } from "react";
import {
    Keyboard,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    View,
} from "react-native";
import { useAtom } from "jotai";
import { deliveryRequestAtom } from "@/src/store/delivery";

const PackageTypeScreen = () => {
    const [deliveryRequest, setDeliveryRequest] = useAtom(deliveryRequestAtom);

    const packageDescription = deliveryRequest.packageDescription || "";
    const selectedCategory = deliveryRequest.packageType;

    const setPackageDescription = (val: string) =>
        setDeliveryRequest((prev) => ({ ...prev, packageDescription: val }));
    const setSelectedCategory = (val: string) =>
        setDeliveryRequest((prev) => ({ ...prev, packageType: val }));

    const [showRiderSheet, setShowRiderSheet] = useState(false);

    return (
        <SubAppLayout>
            <SubAppHeader title="Select package type" />
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView
                    className="flex-1 px-5 py-3"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Package Type */}
                    <View>
                        <View>
                            <CategorySelector onSelect={setSelectedCategory} />
                        </View>
                        {selectedCategory === "Other" && (
                            <View className="py-3">
                                <CustomInput
                                    value={packageDescription}
                                    setValue={setPackageDescription}
                                    placeholder="Please specify"
                                    label="Please specify"
                                />
                            </View>
                        )}
                    </View>
                    {/* End of Package Type */}

                    <View className="pt-10 pb-5">
                        <View className="flex flex-row items-center justify-between px-2 py-3">
                            <Text className="font-medium text-base text-foreground tracking-tight">
                                Delivery fee:
                            </Text>
                            <Text className="font-semibold text-lg text-foreground tracking-tight">
                                ₦{deliveryRequest.fee?.toLocaleString()}
                            </Text>
                        </View>
                        <CustomButton
                            text="Find Rider"
                            action={() => setShowRiderSheet(true)}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>

            {/* Find Rider Bottom Sheet */}
            <FindRiderSheet
                visible={showRiderSheet}
                onClose={() => setShowRiderSheet(false)}
            />
        </SubAppLayout>
    );
};

export default PackageTypeScreen;
