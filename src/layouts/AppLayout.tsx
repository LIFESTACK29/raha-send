import { SafeAreaView } from "react-native-safe-area-context";
import { PropsWithChildren } from "react";

const AppLayout = ({ children }: PropsWithChildren) => {
    return (
        <SafeAreaView
            className="flex flex-1 w-full h-full bg-background"
            edges={["top", "left", "right"]}
        >
            {children}
        </SafeAreaView>
    );
};

export default AppLayout;
