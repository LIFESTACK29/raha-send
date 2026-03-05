import React, { useCallback, useRef, useEffect } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetTextInput,
    useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";

interface GorhomBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    snapPoints?: string[];
    initialIndex?: number;
    enablePanDownToClose?: boolean;
    enableBackdropPress?: boolean;
    backgroundColor?: string;
    borderRadius?: number;
    backdropOpacity?: number;
    onChange?: (index: number) => void;
}

const GorhomBottomSheet = ({
    visible,
    onClose,
    children,
    snapPoints = ["25%", "50%", "85%"],
    initialIndex = 1,
    enablePanDownToClose = true,
    enableBackdropPress = true,
    backgroundColor = "#ffffff",
    borderRadius = 24,
    backdropOpacity = 0.5,
    onChange,
}: GorhomBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // ✅ FIXED: Removed restDisplacementThreshold and restSpeedThreshold
    // These are not in the Omit<SpringConfig, "velocity"> type
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 18,
        stiffness: 200,
        mass: 0.5,
        overshootClamping: false,
    });

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [visible]);

    const handleChange = useCallback(
        (index: number) => {
            onChange?.(index);
            if (index === -1) {
                onClose();
            }
        },
        [onChange, onClose],
    );

    useEffect(() => {
        if (!visible) return;

        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            bottomSheetRef.current?.dismiss();
            return true;
        });

        return () => sub.remove();
    }, [visible]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={backdropOpacity}
                pressBehavior={enableBackdropPress ? "close" : "none"}
            />
        ),
        [backdropOpacity, enableBackdropPress],
    );

    if (!visible) return null;

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={initialIndex}
            snapPoints={snapPoints}
            onChange={handleChange}
            enablePanDownToClose={enablePanDownToClose}
            backdropComponent={renderBackdrop}
            animationConfigs={animationConfigs}
            backgroundStyle={{
                backgroundColor,
                borderRadius,
            }}
            handleStyle={styles.handle}
            handleIndicatorStyle={styles.handleIndicator}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <BottomSheetView style={styles.content}>{children}</BottomSheetView>
        </BottomSheetModal>
    );
};

export const BottomSheetInput = BottomSheetTextInput;

const styles = StyleSheet.create({
    handle: {
        paddingTop: 12,
        paddingBottom: 8,
    },
    handleIndicator: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#D1D5DB",
    },
    content: {
        flex: 1,
    },
});

export default GorhomBottomSheet;
