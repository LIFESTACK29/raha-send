import { View } from "react-native";
import CustomInput from "../form/CustomInput";

const RoutePicker = ({
    pickup,
    setPickup,
    dropoff,
    setDropoff,
}: {
    pickup: string;
    setPickup: (val: string) => void;
    dropoff: string;
    setDropoff: (val: string) => void;
}) => {
    return (
        <View className="flex-row py-2 px-2">
            {/* Left Indicator Section */}
            <View className="w-4 items-center justify-between py-12">
                {/* Top Green Dot */}
                <View className="w-3.5 h-3.5 rounded-full bg-[#1B3012] z-10" />

                {/* Vertical Dashed Line */}
                <View
                    className="absolute top-[60px] bottom-[60px] w-[1px] border-l border-[#1B3012]"
                    style={{ borderStyle: "dashed" }}
                />

                {/* Bottom Orange Square */}
                <View className="w-3.5 h-3.5 bg-[#E67E22] z-10" />
            </View>

            {/* Right Content Section */}
            <View className="flex-1 ml-4">
                {/* Pickup Section */}
                <View className="mb-4">
                    <CustomInput
                        value={pickup}
                        setValue={setPickup}
                        placeholder="📍 Enter pickup address..."
                        label="Pickup Point"
                    />
                </View>

                {/* Dropoff Section */}
                <View>
                    <CustomInput
                        value={dropoff}
                        setValue={setDropoff}
                        placeholder="📍 Enter dropoff address..."
                        label="Dropoff Point"
                    />
                </View>
            </View>
        </View>
    );
};

export default RoutePicker;
