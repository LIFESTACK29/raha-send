import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SectionList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CampusLocation, LocationCategory } from "../types";

const CATEGORY_LABELS: Record<LocationCategory, string> = {
  FACULTY: "Faculties",
  HOSTEL: "Hostels",
  GATE: "Gates",
  LANDMARK: "Landmarks",
  FOOD: "Food & Market",
  ADMIN: "Admin",
};

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: CampusLocation) => void;
  campusLocations: Partial<Record<LocationCategory, CampusLocation[]>>;
  loading?: boolean;
  title?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onSelect,
  campusLocations,
  loading,
  title = "Select Location",
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const q = query.toLowerCase().trim();

    return (Object.entries(campusLocations) as [LocationCategory, CampusLocation[]][])
      .map(([category, locations]) => {
        const filtered = q
          ? locations.filter(
              (loc) =>
                loc.name.toLowerCase().includes(q) ||
                loc.aliases.some((a) => a.toLowerCase().includes(q))
            )
          : locations;
        return { title: CATEGORY_LABELS[category], data: filtered };
      })
      .filter((s) => s.data.length > 0);
  }, [campusLocations, query]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={24} color="#022401" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator color="#01656c" style={{ marginTop: 40 }} />
        ) : sections.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="location-outline" size={40} color="#9ca3af" />
            <Text style={styles.emptyText}>No locations found</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => {
                  onSelect(item);
                  onClose();
                  setQuery("");
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="location-outline" size={18} color="#01656c" style={styles.locIcon} />
                <View style={styles.locText}>
                  <Text style={styles.locName}>{item.name}</Text>
                  {item.zone && (
                    <Text style={styles.locZone}>{item.zone.name}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#022401" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: "#022401" },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  locIcon: { marginRight: 12 },
  locText: { flex: 1 },
  locName: { fontSize: 15, color: "#022401", fontWeight: "500" },
  locZone: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: "#9ca3af" },
});
