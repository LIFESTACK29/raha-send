import { create } from "zustand";
import { deliveryService } from "../services/delivery.api";
import {
    ContactDetails,
    DeliveryLocation,
    DeliveryStoreState,
    MatchingState,
    NoRiderFoundPayload,
    PackageType,
    Rider,
} from "../types/delivery.types";

const emptyContact: ContactDetails = {
    fullName: "",
    email: "",
    phoneNumber: "",
};

const initialDraft = {
    pickupLocation: null as DeliveryLocation | null,
    dropoffLocation: null as DeliveryLocation | null,
    isSenderSelf: true,
    customer: { ...emptyContact },
    receiver: { ...emptyContact },
    packageType: "PARCEL" as PackageType,
    note: "",
    itemImage: null as string | null,
};

export const useDeliveryStore = create<DeliveryStoreState>((set, get) => ({
    // ── Draft ──────────────────────────────────
    draft: { ...initialDraft },

    setPickup: (location: DeliveryLocation) =>
        set((s) => ({ draft: { ...s.draft, pickupLocation: location } })),

    setDropoff: (location: DeliveryLocation) =>
        set((s) => ({ draft: { ...s.draft, dropoffLocation: location } })),

    setIsSenderSelf: (isSelf: boolean) =>
        set((s) => ({
            draft: {
                ...s.draft,
                isSenderSelf: isSelf,
            },
        })),

    setCustomer: (details: Partial<ContactDetails>) =>
        set((s) => ({
            draft: {
                ...s.draft,
                customer: { ...s.draft.customer, ...details },
            },
        })),

    setReceiver: (details: Partial<ContactDetails>) =>
        set((s) => ({
            draft: {
                ...s.draft,
                receiver: { ...s.draft.receiver, ...details },
            },
        })),

    setPackageType: (type: PackageType) =>
        set((s) => ({ draft: { ...s.draft, packageType: type } })),

    setNote: (note: string) => set((s) => ({ draft: { ...s.draft, note } })),

    setItemImage: (uri: string | null) =>
        set((s) => ({ draft: { ...s.draft, itemImage: uri } })),

    // ── Fee Quote ──────────────────────────────
    feeQuote: null,
    feeLoading: false,
    feeError: null,

    calculateFee: async () => {
        const { draft } = get();
        if (!draft.pickupLocation || !draft.dropoffLocation) return;

        set({ feeLoading: true, feeError: null });
        try {
            const res = await deliveryService.calculateFee(
                draft.pickupLocation,
                draft.dropoffLocation,
            );
            set({ feeQuote: res.data });
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Fee calculation failed";
            set({ feeError: msg });
        } finally {
            set({ feeLoading: false });
        }
    },

    // ── Match Request (Phase 1) ────────────────
    matchRequest: null,
    requestLoading: false,
    requestError: null,
    requestErrorCode: null,
    insufficientBalanceData: null,
    clearRequestError: () =>
        set({
            requestError: null,
            requestErrorCode: null,
            insufficientBalanceData: null,
        }),

    startRiderSearch: async () => {
        const { draft } = get();
        if (
            !draft.pickupLocation ||
            !draft.dropoffLocation ||
            !draft.itemImage
        ) {
            set({
                requestError: "Please fill all required fields",
                requestErrorCode: null,
                insufficientBalanceData: null,
            });
            return;
        }

        set({
            requestLoading: true,
            requestError: null,
            requestErrorCode: null,
            insufficientBalanceData: null,
        });
        try {
            const res = await deliveryService.requestMatch({
                pickupLocation: draft.pickupLocation,
                dropoffLocation: draft.dropoffLocation,
                customer: draft.customer,
                receiver: draft.receiver,
                packageType: draft.packageType,
                note: draft.note || undefined,
                itemImageUri: draft.itemImage,
            });
            set({
                matchRequest: res.matchRequest,
                matchingState: "searching",
                requestError: null,
                requestErrorCode: null,
                insufficientBalanceData: null,
            });
        } catch (err: any) {
            const code = err?.response?.data?.code;
            const isKnownWalletError =
                code === "WALLET_NOT_FOUND" ||
                code === "INSUFFICIENT_WALLET_BALANCE";
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Search request failed";
            set({
                requestError: msg,
                requestErrorCode: isKnownWalletError ? code : null,
                insufficientBalanceData:
                    code === "INSUFFICIENT_WALLET_BALANCE"
                        ? err?.response?.data?.data || null
                        : null,
            });
        } finally {
            set({ requestLoading: false });
        }
    },

    waitMore: async () => {
        const { matchRequest } = get();
        if (!matchRequest) return;
        try {
            await deliveryService.waitMore(matchRequest.id);
            set({ matchingState: "searching", noRiderPayload: null });
        } catch (err: any) {
            console.error("Wait more error:", err);
        }
    },

    createManual: async () => {
        const { matchRequest } = get();
        if (!matchRequest) return;
        try {
            const res = await deliveryService.createManual(matchRequest.id);

            set({
                delivery: res.delivery,
                matchingState: "manual_pending",
                noRiderPayload: null,
            });
        } catch (err: any) {
            console.error("Create manual error:", err);
        }
    },

    // ── Delivery (Phase 2) ─────────────────────
    delivery: null,
    matchingState: "idle",
    setMatchingState: (state: MatchingState) => set({ matchingState: state }),

    // ── Rider ──────────────────────────────────
    rider: null,
    setRider: (rider: Rider) => set({ rider, matchingState: "accepted" }),

    // ── Payloads ───────────────────────────────
    noRiderPayload: null,
    setNoRiderPayload: (payload: NoRiderFoundPayload) =>
        set({ noRiderPayload: payload, matchingState: "no_rider_found" }),

    // ── Reset ──────────────────────────────────
    resetDelivery: () =>
        set({
            draft: { ...initialDraft },
            feeQuote: null,
            feeLoading: false,
            feeError: null,
            matchRequest: null,
            delivery: null,
            requestLoading: false,
            requestError: null,
            requestErrorCode: null,
            insufficientBalanceData: null,
            matchingState: "idle",
            rider: null,
            noRiderPayload: null,
        }),
}));
