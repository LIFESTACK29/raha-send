import CustomButton from "@/src/components/form/CustomButton";
import CustomInput from "@/src/components/form/CustomInput";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import CategorySelector from "@/src/components/section/CategorySelector";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { useState } from "react";
import { Text } from "react-native";
import { ScrollView, View } from "react-native";

const PaymentMethodScreen = () => {
    const [form, setForm] = useState({
        pickupDetails: {},
        senderDetails: {},
        receiverDetails: {},
    });

    return (
        <SubAppLayout>
            <SubAppHeader title="Payment method" />
            <ScrollView className="flex-1 px-5 py-3"></ScrollView>
        </SubAppLayout>
    );
};

export default PaymentMethodScreen;
