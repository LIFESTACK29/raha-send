import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/src/store/useAuthStore";
import { ContactDetailsSection } from "../components/ContactDetailsSection";
import { LocationAutocompleteInput } from "../components/LocationAutocompleteInput";
import { useDeliveryStore } from "../store/useDeliveryStore";
import { PackageType } from "../types/delivery.types";

const PACKAGE_TYPES: {
    type: PackageType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
}[] = [
    { type: "DOCUMENT", label: "Document", icon: "document-text-outline" },
    { type: "PARCEL", label: "Parcel", icon: "cube-outline" },
    { type: "FRAGILE", label: "Fragile", icon: "wine-outline" },
    { type: "FOOD", label: "Food", icon: "fast-food-outline" },
    { type: "ELECTRONICS", label: "Electronics", icon: "laptop-outline" },
    { type: "OTHER", label: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function CreateDeliveryScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuthStore();

    const {
        draft,
        setPickup,
        setDropoff,
        setIsSenderSelf,
        setCustomer,
        setReceiver,
        setPackageType,
        setNote,
        setItemImage,
        feeQuote,
        feeLoading,
        feeError,
        calculateFee,
        requestLoading,
        requestError,
        requestErrorCode,
        insufficientBalanceData,
        clearRequestError,
        startRiderSearch,
        matchRequest,
        resetDelivery,
    } = useDeliveryStore();

    const loggedInUser = useMemo(
        () =>
            user
                ? {
                      fullName: `${user.firstName} ${user.lastName}`.trim(),
                      email: user.email,
                      phoneNumber: user.phoneNumber,
                  }
                : null,
        [user],
    );

    useEffect(() => {
        if (draft.isSenderSelf && loggedInUser) {
            setCustomer(loggedInUser);
        }
    }, []);

    useEffect(() => {
        if (draft.pickupLocation && draft.dropoffLocation) {
            calculateFee();
        }
    }, [draft.pickupLocation, draft.dropoffLocation]);

    useEffect(() => {
        if (matchRequest) {
            router.push("/delivery/matching-rider" as any);
        }
    }, [matchRequest]);

    const lastShownWalletErrorRef = useRef<string | null>(null);
    useEffect(() => {
        if (!requestErrorCode) {
            lastShownWalletErrorRef.current = null;
            return;
        }

        const walletErrorKey = `${requestErrorCode}:${insufficientBalanceData?.shortfallInNaira ?? "none"}`;
        if (lastShownWalletErrorRef.current === walletErrorKey) return;
        lastShownWalletErrorRef.current = walletErrorKey;

        if (requestErrorCode === "WALLET_NOT_FOUND") {
            Alert.alert(
                "Wallet Setup Required",
                requestError ||
                    "Wallet not found. Please create and fund your wallet before requesting a delivery.",
                [
                    { text: "Later", style: "cancel" },
                    {
                        text: "Go to Wallet",
                        onPress: () => router.push("/(tabs)/wallet" as any),
                    },
                ],
            );
            return;
        }

        if (requestErrorCode === "INSUFFICIENT_WALLET_BALANCE") {
            const shortfall = insufficientBalanceData?.shortfallInNaira ?? 0;
            Alert.alert(
                "Insufficient Balance",
                `${requestError || "Insufficient wallet balance for this delivery request."}\n\nShortfall: ₦${shortfall.toLocaleString()}`,
                [
                    { text: "Close", style: "cancel" },
                    {
                        text: "Fund Wallet",
                        onPress: () => router.push("/(tabs)/wallet" as any),
                    },
                ],
            );
        }
    }, [
        requestErrorCode,
        requestError,
        insufficientBalanceData?.shortfallInNaira,
        router,
    ]);

    const handlePickImage = async () => {
        const permResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permResult.granted) {
            Alert.alert(
                "Permission Required",
                "Please allow access to your photos.",
            );
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setItemImage(result.assets[0].uri);
        }
    };

    const handleTakePhoto = async () => {
        const permResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permResult.granted) {
            Alert.alert("Permission Required", "Please allow camera access.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setItemImage(result.assets[0].uri);
        }
    };

    const showImageOptions = () => {
        Alert.alert("Upload Package Image", "Choose an option", [
            { text: "Camera", onPress: handleTakePhoto },
            { text: "Gallery", onPress: handlePickImage },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const isFormValid =
        draft.pickupLocation &&
        draft.dropoffLocation &&
        draft.customer.fullName.trim() &&
        draft.customer.email.trim() &&
        draft.customer.phoneNumber.trim() &&
        draft.receiver.fullName.trim() &&
        draft.receiver.email.trim() &&
        draft.receiver.phoneNumber.trim() &&
        draft.itemImage;

    const handleSubmit = async () => {
        if (!isFormValid) {
            Alert.alert(
                "Missing Fields",
                "Please fill all required fields and upload a package image.",
            );
            return;
        }
        await startRiderSearch();
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#ffffff" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar style="dark" />

            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity
                    onPress={() => {
                        resetDelivery();
                        router.back();
                    }}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Delivery</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: insets.bottom + 120,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name="navigate-outline"
                        size={20}
                        color="#01656c"
                    />
                    <Text style={styles.sectionTitle}>Locations</Text>
                </View>

                <View style={{ zIndex: 20 }}>
                    <LocationAutocompleteInput
                        label="Pickup Location"
                        placeholder="Where to pick up?"
                        icon="radio-button-on-outline"
                        iconColor="#f59e0b"
                        value={draft.pickupLocation}
                        onSelect={setPickup}
                    />
                </View>

                <View style={{ zIndex: 10, marginTop: 8 }}>
                    <LocationAutocompleteInput
                        label="Dropoff Location"
                        placeholder="Where to deliver?"
                        icon="location-outline"
                        iconColor="#ef4444"
                        value={draft.dropoffLocation}
                        onSelect={setDropoff}
                    />
                </View>

                <View style={styles.divider} />

                <ContactDetailsSection
                    title="Sender Details"
                    icon="person-outline"
                    contact={draft.customer}
                    onChange={setCustomer}
                    showSelfToggle
                    isSelf={draft.isSenderSelf}
                    onToggleSelf={setIsSenderSelf}
                    loggedInUser={loggedInUser}
                />

                <View style={styles.divider} />

                <ContactDetailsSection
                    title="Receiver Details"
                    icon="people-outline"
                    iconColor="#f59e0b"
                    contact={draft.receiver}
                    onChange={setReceiver}
                />

                <View style={styles.divider} />

                <View style={styles.sectionHeader}>
                    <Ionicons name="cube-outline" size={20} color="#01656c" />
                    <Text style={styles.sectionTitle}>Package Type</Text>
                </View>

                <View style={styles.packageGrid}>
                    {PACKAGE_TYPES.map((pkg) => {
                        const isActive = draft.packageType === pkg.type;
                        return (
                            <TouchableOpacity
                                key={pkg.type}
                                style={[
                                    styles.packageChip,
                                    isActive && styles.packageChipActive,
                                ]}
                                onPress={() => setPackageType(pkg.type)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={pkg.icon}
                                    size={18}
                                    color={isActive ? "#ffffff" : "#6b7280"}
                                />
                                <Text
                                    style={[
                                        styles.packageChipText,
                                        isActive &&
                                            styles.packageChipTextActive,
                                    ]}
                                >
                                    {pkg.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#01656c"
                    />
                    <Text style={styles.sectionTitle}>Note (Optional)</Text>
                </View>

                <View style={styles.noteInputWrap}>
                    <TextInput
                        style={styles.noteTextInput}
                        placeholder="e.g. Handle with care, fragile item..."
                        placeholderTextColor="#9ca3af"
                        value={draft.note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Ionicons name="camera-outline" size={20} color="#01656c" />
                    <Text style={styles.sectionTitle}>Package Image</Text>
                    <Text style={styles.requiredBadge}>Required</Text>
                </View>

                {draft.itemImage ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: draft.itemImage }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.changeImageBtn}
                            onPress={showImageOptions}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="camera-reverse-outline"
                                size={18}
                                color="#fff"
                            />
                            <Text style={styles.changeImageText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={showImageOptions}
                        activeOpacity={0.7}
                    >
                        <View style={styles.uploadIconWrap}>
                            <Ionicons
                                name="cloud-upload-outline"
                                size={32}
                                color="#01656c"
                            />
                        </View>
                        <Text style={styles.uploadTitle}>
                            Upload Package Photo
                        </Text>
                        <Text style={styles.uploadSubtitle}>
                            Take a photo or choose from gallery
                        </Text>
                    </TouchableOpacity>
                )}

                {(feeLoading || feeQuote || feeError) && (
                    <View style={styles.feeCard}>
                        <View style={styles.feeHeader}>
                            <Ionicons
                                name="receipt-outline"
                                size={20}
                                color="#01656c"
                            />
                            <Text style={styles.feeTitle}>Fee Estimate</Text>
                        </View>

                        {feeLoading ? (
                            <View style={styles.feeLoading}>
                                <ActivityIndicator
                                    size="small"
                                    color="#01656c"
                                />
                                <Text style={styles.feeLoadingText}>
                                    Calculating...
                                </Text>
                            </View>
                        ) : feeError ? (
                            <View style={styles.feeErrorWrap}>
                                <Ionicons
                                    name="warning-outline"
                                    size={16}
                                    color="#ef4444"
                                />
                                <Text style={styles.feeErrorText}>
                                    {feeError}
                                </Text>
                                <TouchableOpacity onPress={calculateFee}>
                                    <Text style={styles.retryText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : feeQuote ? (
                            <View>
                                <View style={styles.feeRow}>
                                    <Text style={styles.feeTotalLabel}>
                                        Total
                                    </Text>
                                    <Text style={styles.feeTotalValue}>
                                        {formatCurrency(
                                            feeQuote.pricing.totalFee,
                                        )}
                                    </Text>
                                </View>
                            </View>
                        ) : null}
                    </View>
                )}

                {requestError && (
                    <View style={styles.errorBanner}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={18}
                            color="#ef4444"
                        />
                        <Text style={styles.errorBannerText}>
                            {requestError}
                        </Text>
                    </View>
                )}

                {requestErrorCode === "WALLET_NOT_FOUND" && (
                    <TouchableOpacity
                        style={styles.walletCtaCard}
                        activeOpacity={0.8}
                        onPress={() => {
                            clearRequestError();
                            router.push("/(tabs)/wallet" as any);
                        }}
                    >
                        <View style={styles.walletCtaHeader}>
                            <Ionicons
                                name="wallet-outline"
                                size={18}
                                color="#01656c"
                            />
                            <Text style={styles.walletCtaTitle}>
                                Set Up Wallet
                            </Text>
                        </View>
                        <Text style={styles.walletCtaText}>
                            Create and fund your wallet to continue this
                            delivery request.
                        </Text>
                        <Text style={styles.walletCtaLink}>Go to Wallet</Text>
                    </TouchableOpacity>
                )}

                {requestErrorCode === "INSUFFICIENT_WALLET_BALANCE" && (
                    <TouchableOpacity
                        style={styles.walletCtaCard}
                        activeOpacity={0.8}
                        onPress={() => {
                            clearRequestError();
                            router.push("/(tabs)/wallet" as any);
                        }}
                    >
                        <View style={styles.walletCtaHeader}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={18}
                                color="#b45309"
                            />
                            <Text style={styles.walletCtaTitle}>
                                Fund Wallet
                            </Text>
                        </View>
                        <Text style={styles.walletCtaText}>
                            You need{" "}
                            <Text style={styles.walletCtaAmount}>
                                ₦
                                {(
                                    insufficientBalanceData?.shortfallInNaira ||
                                    0
                                ).toLocaleString()}
                            </Text>{" "}
                            more to place this delivery request.
                        </Text>
                        <Text style={styles.walletCtaLink}>Fund Now</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View
                style={[
                    styles.bottomBar,
                    { paddingBottom: insets.bottom + 16 },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.requestBtn,
                        (!isFormValid || requestLoading) &&
                            styles.requestBtnDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid || requestLoading}
                    activeOpacity={0.8}
                >
                    {requestLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons
                                name="bicycle-outline"
                                size={22}
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                            <Text style={styles.requestBtnText}>
                                Find Rider
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        backgroundColor: "#ffffff",
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
    },
    requiredBadge: {
        fontSize: 11,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#ef4444",
        backgroundColor: "#fef2f2",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        overflow: "hidden",
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#f3f4f6",
        marginVertical: 20,
    },
    packageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    packageChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#f4f7f7",
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    packageChipActive: {
        backgroundColor: "#022401",
        borderColor: "#022401",
    },
    packageChipText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#6b7280",
    },
    packageChipTextActive: {
        color: "#ffffff",
    },
    noteInputWrap: {
        backgroundColor: "#f4f7f7",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1.5,
        borderColor: "transparent",
        minHeight: 80,
    },
    noteTextInput: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro",
        color: "#1f2937",
        minHeight: 60,
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: "#e5e7eb",
        borderStyle: "dashed",
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafbfc",
    },
    uploadIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#e0f2fe",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    uploadTitle: {
        fontSize: 15,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#374151",
        marginBottom: 4,
    },
    uploadSubtitle: {
        fontSize: 12,
        fontFamily: "GTWalsheimPro",
        color: "#9ca3af",
    },
    imagePreviewContainer: {
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 16,
    },
    changeImageBtn: {
        position: "absolute",
        bottom: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    changeImageText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#ffffff",
    },
    feeCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        padding: 18,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    feeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
    },
    feeTitle: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
    },
    feeLoading: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    feeLoadingText: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro",
        color: "#6b7280",
    },
    feeErrorWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    feeErrorText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro",
        color: "#ef4444",
        flex: 1,
    },
    retryText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#01656c",
    },
    feeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    feeLabel: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro",
        color: "#6b7280",
    },
    feeValue: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro-Medium",
        color: "#374151",
    },
    feeDivider: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 8,
    },
    feeTotalLabel: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#1f2937",
    },
    feeTotalValue: {
        fontSize: 18,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#022401",
    },
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#fef2f2",
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#fecaca",
    },
    errorBannerText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro",
        color: "#ef4444",
        flex: 1,
    },
    walletCtaCard: {
        marginTop: 12,
        backgroundColor: "#f0f9ff",
        borderWidth: 1,
        borderColor: "#bae6fd",
        borderRadius: 12,
        padding: 14,
    },
    walletCtaHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    walletCtaTitle: {
        fontSize: 14,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#0c4a6e",
    },
    walletCtaText: {
        fontSize: 13,
        fontFamily: "GTWalsheimPro",
        color: "#334155",
        lineHeight: 18,
    },
    walletCtaAmount: {
        fontFamily: "GTWalsheimPro-Bold",
        color: "#0f172a",
    },
    walletCtaLink: {
        marginTop: 8,
        fontSize: 13,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#01656c",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
    },
    requestBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#022401",
        borderRadius: 16,
        paddingVertical: 18,
    },
    requestBtnDisabled: {
        opacity: 0.5,
    },
    requestBtnText: {
        fontSize: 16,
        fontFamily: "GTWalsheimPro-Bold",
        color: "#ffffff",
    },
});
