import { JSX } from "react";
import { ImageBackground } from "react-native";

const OnboardingLayout = ({
    children,
    image,
}: {
    children: JSX.Element;
    image: any;
}) => {
    return (
        <ImageBackground
            source={image}
            className="h-full flex-1 flex-row w-full bg-background"
        >
            {children}
        </ImageBackground>
    );
};

export default OnboardingLayout;
