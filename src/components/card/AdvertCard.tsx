import { MoveRight } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";

const AdvertCard = () => {
    return (
        <View className="px-5 py-5">
            <View className="relative h-40 rounded-[25px] bg-gray-400 overflow-hidden">
                <Image
                    source={require("@/src/assets/images/ads.png")}
                    className="w-full h-full"
                    style={{
                        objectFit: "cover",
                    }}
                />
                <View className="absolute top-0 left-0 flex flex-row items-end justify-end p-5 w-full h-full bg-foreground/20">
                    <Pressable className="w-11 h-11 bg-white rounded-full flex flex-row items-center justify-center">
                        <MoveRight size={18} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default AdvertCard;
