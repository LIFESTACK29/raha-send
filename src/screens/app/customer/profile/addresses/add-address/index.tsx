import { useState, useEffect } from "react";
import {
    View,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import CustomInput from "@/src/components/form/CustomInput";
import CustomButton from "@/src/components/form/CustomButton";
import { useAuth } from "@clerk/clerk-expo";
import { useToast } from "@/src/context/ToastContext";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/src/const";
import { useAtom } from "jotai";
import { userAtom, Address } from "@/src/store/user";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Nav } from "@/src/types";

const AddAddressScreen = () => {
    const { goBack } = useNavigation<Nav>();
    const route = useRoute<any>();
    const addressToEdit = route.params?.address as Address | undefined;

    const [user, setUser] = useAtom(userAtom);
    const { getToken } = useAuth();
    const { addToast } = useToast();

    const [form, setForm] = useState({
        name: "",
        location: "",
        landmark: "",
    });

    useEffect(() => {
        if (addressToEdit) {
            setForm({
                name: addressToEdit.name,
                location: addressToEdit.location,
                landmark: addressToEdit.landmark || "",
            });
        }
    }, [addressToEdit]);

    const saveMutation = useMutation({
        mutationFn: async ({
            isEdit,
            editId,
            formData,
        }: {
            isEdit: boolean;
            editId: string | null;
            formData: typeof form;
        }) => {
            if (!user) throw new Error("No user found");
            const token = await getToken();
            const headers = { Authorization: `Bearer ${token}` };

            if (isEdit && editId) {
                const response = await axios.put(
                    `${API_URL}/user/addresses/${user.clerkId}/${editId}`,
                    formData,
                    { headers },
                );
                return response.data.user;
            } else {
                const response = await axios.post(
                    `${API_URL}/user/addresses/${user.clerkId}`,
                    formData,
                    { headers },
                );
                return response.data.user;
            }
        },
        onMutate: async ({
            isEdit,
            editId,
            formData,
        }: {
            isEdit: boolean;
            editId: string | null;
            formData: typeof form;
        }) => {
            Keyboard.dismiss();

            // Snapshot the previous value
            const previousAddresses = [...(user?.addresses || [])];

            // Optimistically update to the new value
            let updatedAddresses = [...previousAddresses];
            if (isEdit && editId) {
                updatedAddresses = updatedAddresses.map((addr) =>
                    addr._id === editId ? { ...addr, ...formData } : addr,
                );
            } else {
                const dummyId = Date.now().toString();
                updatedAddresses.push({ _id: dummyId, ...formData });
            }

            setUser((prev: any) => ({ ...prev, addresses: updatedAddresses }));

            // Return a context object with the snapshotted value
            return { previousAddresses };
        },
        onError: (err: any, variables: any, context: any) => {
            console.error(
                "Error saving address:",
                err.response?.data || err.message,
            );
            // Rollback to the previous value
            if (context?.previousAddresses) {
                setUser((prev: any) => ({
                    ...prev,
                    addresses: context.previousAddresses,
                }));
            }
            addToast({
                title: "Error",
                message:
                    err.response?.data?.message || "Failed to save address",
                type: "error",
            });
        },
        onSuccess: (updatedUser: any, variables: any) => {
            setUser(updatedUser);
            addToast({
                title: "Success",
                message: variables.isEdit
                    ? "Address updated successfully"
                    : "Address added successfully",
                type: "success",
            });
            goBack();
        },
    });

    const handleSave = () => {
        if (!form.name || !form.location || !user) return;
        saveMutation.mutate({
            isEdit: !!addressToEdit,
            editId: addressToEdit?._id || null,
            formData: form,
        });
    };

    return (
        <SubAppLayout>
            <SubAppHeader
                title={addressToEdit ? "Edit Address" : "Add New Address"}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="flex-1 px-5 pt-5"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="mb-2">
                        <CustomInput
                            value={form.name}
                            setValue={(val: string) =>
                                setForm({ ...form, name: val })
                            }
                            label="Name (e.g. Home, Work)"
                            placeholder="Home"
                        />
                    </View>
                    <View className="mb-2">
                        <CustomInput
                            value={form.location}
                            setValue={(val: string) =>
                                setForm({ ...form, location: val })
                            }
                            label="Location"
                            placeholder="No. 9 Aranta Road, Ozuoba"
                        />
                    </View>
                    <View className="mb-5">
                        <CustomInput
                            value={form.landmark}
                            setValue={(val: string) =>
                                setForm({ ...form, landmark: val })
                            }
                            label="Landmark (Optional)"
                            placeholder="Bakery Junction"
                        />
                    </View>

                    <CustomButton
                        text={addressToEdit ? "Save Changes" : "Save Address"}
                        action={handleSave}
                        disabled={!form.name || !form.location}
                        className="mt-4 mb-[100px]"
                        processing={saveMutation.isPending}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SubAppLayout>
    );
};

export default AddAddressScreen;
