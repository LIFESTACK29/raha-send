import AppLayout from "@/src/layouts/AppLayout";
import { Text, View } from "react-native";

const ProfileScreen = () => {
    return (
        <AppLayout>
            <View className="flex-1">
                <Text>Hello World</Text>
            </View>
        </AppLayout>
    );
};

export default ProfileScreen;
