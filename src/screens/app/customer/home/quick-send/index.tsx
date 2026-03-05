import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import CustomTextArea from "@/src/components/form/CustomTextArea";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import RoutePicker from "@/src/components/section/RoutePicker";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { Nav } from "@/src/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAtom } from "jotai";
import { deliveryRequestAtom } from "@/src/store/delivery";
import {
    Keyboard,
    Pressable,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const QuickSendScreen = () => {
    const { navigate } = useNavigation<Nav>();

    const [deliveryRequest, setDeliveryRequest] = useAtom(deliveryRequestAtom);

    // We can also bind directly to the states
    const pickup = deliveryRequest.pickupLocation;
    const dropoff = deliveryRequest.dropoffLocation;
    const deliveryNote = deliveryRequest.deliveryNote;

    const setPickup = (val: string) =>
        setDeliveryRequest((prev) => ({ ...prev, pickupLocation: val }));
    const setDropoff = (val: string) =>
        setDeliveryRequest((prev) => ({ ...prev, dropoffLocation: val }));
    const setDeliveryNote = (val: string) =>
        setDeliveryRequest((prev) => ({ ...prev, deliveryNote: val }));

    const [useMyInfo, setUseMyInfo] = useState(true);
    const [senderName, setSenderName] = useState("David Chikabadu");
    const [senderPhone, setSenderPhone] = useState("08012345678");
    const [senderEmail, setSenderEmail] = useState("ogwunelsondavid@gmail.com");
    const [receiverName, setReceiverName] = useState("Wilson Chibudom");
    const [receiverPhone, setReceiverPhone] = useState("07043306040");
    const [receiverEmail, setReceiverEmail] = useState(
        "chibudomwilson@gmail.com",
    );

    const toggleUseMyInfo = () => {
        if (!useMyInfo) {
            setSenderName("David Chikabadu");
            setSenderPhone("08012345678");
            setSenderEmail("ogwunelsondavid@gmail.com");
        } else {
            setSenderName("");
            setSenderPhone("");
            setSenderEmail("");
        }
        setUseMyInfo(!useMyInfo);
    };

    return (
        <SubAppLayout>
            <SubAppHeader title="Send a package" />
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView
                    className="flex-1 px-5 py-3"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Pickup Details */}
                    <View>
                        <View>
                            <RoutePicker
                                pickup={pickup}
                                setPickup={setPickup}
                                dropoff={dropoff}
                                setDropoff={setDropoff}
                            />
                        </View>
                        <View>
                            <CustomTextArea
                                value={deliveryNote}
                                setValue={setDeliveryNote}
                                label="Delivery note"
                                numberOfLines={2}
                                placeholder="Add a specific instruction for the rider (e.g. Gate code, Leave at the door)..."
                            />
                        </View>
                    </View>
                    {/* End of Pickup Details */}

                    {/* Sender Information */}
                    <View className="py-4">
                        <View>
                            <Text className="text-xl text-foreground font-medium tracking-tight">
                                Sender Information
                            </Text>
                            <Pressable
                                className="flex flex-row items-center gap-2 py-2"
                                onPress={toggleUseMyInfo}
                            >
                                <View className="h-4 w-4 bg-white border border-accent rounded-full overflow-hidden p-0.5">
                                    {useMyInfo && (
                                        <View className="rounded-full w-full h-full bg-accent" />
                                    )}
                                </View>
                                <Text className="font-medium tracking-tight text-foreground/80 text-sm">
                                    Use my account information
                                </Text>
                            </Pressable>
                        </View>
                        <View className="py-1.5 flex flex-col gap-2">
                            <CustomInput
                                value={senderName}
                                setValue={setSenderName}
                                placeholder="Sender name"
                            />
                            <CustomInput
                                value={senderPhone}
                                setValue={setSenderPhone}
                                placeholder="Sender phone number"
                                keyboardType="phone-pad"
                            />
                            <CustomInput
                                value={senderEmail}
                                setValue={setSenderEmail}
                                placeholder="Sender email"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>
                    {/* End of Sender Information */}

                    {/* Receiver Information */}
                    <View className="py-4">
                        <View>
                            <Text className="text-xl text-foreground font-medium tracking-tight">
                                Receiver Information
                            </Text>
                        </View>
                        <View className="py-1.5 flex flex-col gap-2">
                            <CustomInput
                                value={receiverName}
                                setValue={setReceiverName}
                                placeholder="Receiver name"
                            />
                            <CustomInput
                                value={receiverPhone}
                                setValue={setReceiverPhone}
                                placeholder="Receiver phone number"
                                keyboardType="phone-pad"
                            />
                            <CustomInput
                                value={receiverEmail}
                                setValue={setReceiverEmail}
                                placeholder="Receiver email"
                                keyboardType="email-address"
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
            </TouchableWithoutFeedback>
        </SubAppLayout>
    );
};

export default QuickSendScreen;
