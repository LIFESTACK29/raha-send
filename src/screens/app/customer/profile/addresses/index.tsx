import { useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    ActivityIndicator,
} from "react-native";
import SubAppHeader from "@/src/components/navigation/SubAppHeader";
import SubAppLayout from "@/src/layouts/SubAppLayout";
import { Plus, MapPin, Edit2, Trash2, X } from "lucide-react-native";
import { useAtom } from "jotai";
import { userAtom, Address } from "@/src/store/user";
import { useAuth } from "@clerk/clerk-expo";
import { useToast } from "@/src/context/ToastContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/src/const";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "@/src/types";

const SavedAddressesScreen = () => {
    const { navigate } = useNavigation<Nav>();
    const [user, setUser] = useAtom(userAtom);
    const { getToken } = useAuth();
    const { addToast } = useToast();

    const addresses = user?.addresses || [];
    const queryClient = useQueryClient();

    const handleEdit = (address: Address) => {
        navigate("AddAddress", { address });
    };

    // --- DELETE MUTATION ---
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!user) throw new Error("No user found");
            const token = await getToken();
            const response = await axios.delete(
                `${API_URL}/user/addresses/${user.clerkId}/${id}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            return response.data.user;
        },
        onMutate: async (id: string) => {
            const previousAddresses = [...(user?.addresses || [])];
            const updatedAddresses = previousAddresses.filter(
                (addr) => addr._id !== id,
            );

            // Optimistically update
            setUser((prev: any) => ({ ...prev, addresses: updatedAddresses }));

            return { previousAddresses };
        },
        onError: (err: any, variables: any, context: any) => {
            console.error(
                "Error deleting address:",
                err.response?.data || err.message,
            );
            // Rollback
            if (context?.previousAddresses) {
                setUser((prev: any) => ({
                    ...prev,
                    addresses: context.previousAddresses,
                }));
            }
            addToast({
                title: "Error",
                message:
                    err.response?.data?.message || "Failed to delete address",
                type: "error",
            });
        },
        onSuccess: (updatedUser: any) => {
            setUser(updatedUser);
            addToast({
                title: "Success",
                message: "Address deleted successfully",
                type: "success",
            });
        },
    });

    const handleDelete = (id: string) => {
        if (!user) return;
        deleteMutation.mutate(id);
    };

    const renderItem = ({ item }: { item: Address }) => (
        <View className="flex-row items-center justify-between bg-zinc-50 rounded-3xl p-4 mb-3 border border-gray-100">
            <View className="flex-row items-center flex-1 pr-4">
                <View className="w-10 h-10 rounded-full bg-light-gray items-center justify-center mr-3">
                    <MapPin size={17} color="#022401" />
                </View>
                <View className="flex-1">
                    <Text className="text-foreground font-medium text-base mb-0.5 tracking-tight">
                        {item.name}
                    </Text>
                    <Text className="text-gray-500 text-[11.5px] tracking-tight leading-5">
                        {item.location}
                    </Text>
                    {item.landmark ? (
                        <Text className="text-gray-400 text-[10px] mt-0.5 tracking-tight">
                            Landmark: {item.landmark}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View className="flex-row items-center space-x-2">
                <Pressable
                    onPress={() => handleEdit(item)}
                    className="p-1 w-9 h-9 flex flex-row items-center justify-center bg-gray-100 rounded-full"
                >
                    <Edit2 size={15} color="#4B5563" />
                </Pressable>
                <Pressable
                    onPress={() => handleDelete(item._id)}
                    className="p-1 w-9 h-9 flex flex-row items-center justify-center bg-red-50 rounded-full ml-2"
                >
                    <Trash2 size={15} color="#EF4444" />
                </Pressable>
            </View>
        </View>
    );

    return (
        <SubAppLayout>
            <SubAppHeader title="Saved Addresses" />

            <View className="flex-1 px-5 pt-3">
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <MapPin
                                size={48}
                                color="#D1D5DB"
                                className="mb-4"
                            />
                            <Text className="text-gray-400 text-base font-medium">
                                No saved addresses
                            </Text>
                            <Text className="text-gray-300 text-sm mt-1">
                                Add an address to make deliveries easier
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* Floating Action Button */}
            <Pressable
                onPress={() => navigate("AddAddress")}
                className="absolute bottom-8 right-5 w-16 h-16 bg-green-950 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30"
            >
                <Plus size={24} color="#ffffff" />
            </Pressable>
        </SubAppLayout>
    );
};

export default SavedAddressesScreen;
