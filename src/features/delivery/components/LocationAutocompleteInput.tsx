import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DeliveryLocation } from "../types/delivery.types";

/** Nominatim (OpenStreetMap) result shape */
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

interface LocationAutocompleteInputProps {
  label: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value: DeliveryLocation | null;
  onSelect: (location: DeliveryLocation) => void;
  country?: string;
}

export const LocationAutocompleteInput: React.FC<
  LocationAutocompleteInputProps
> = ({
  label,
  placeholder,
  icon,
  iconColor = "#01656c",
  value,
  onSelect,
  country = "ng",
}) => {
  const [query, setQuery] = useState(value?.shortName || "");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState(!!value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=${country}&limit=5&q=${encodeURIComponent(
          text
        )}`;

        const res = await axios.get<NominatimResult[]>(url, {
          timeout: 8000,
          headers: {
            "Accept": "application/json",
            "User-Agent": "RahaDeliveryApp/1.0 (contact: admin@raha.com)",
          },
        });

        console.log("[Autocomplete] Results:", res.data.length);
        setSuggestions(res.data);
      } catch (e: any) {
        if (e.code === "ECONNABORTED") {
          console.error("Autocomplete error: Request timed out");
        } else {
          console.error("Autocomplete error:", e.message || e);
          if (!e.response) {
            console.warn(
              "Network Error: Using local fallback suggestions for testing."
            );
            // Provide some default Lagos locations as fallback for testing
            setSuggestions([
              {
                place_id: 101,
                display_name: "15 Admiralty Way, Lekki Phase 1, Lagos",
                lat: "6.4478",
                lon: "3.4737",
                name: "Admiralty Way",
              },
              {
                place_id: 102,
                display_name: "Ikeja City Mall, Obafemi Awolowo Way, Ikeja",
                lat: "6.6120",
                lon: "3.3450",
                name: "Ikeja City Mall",
              },
              {
                place_id: 103,
                display_name: "Victoria Island, Lagos, Nigeria",
                lat: "6.4281",
                lon: "3.4219",
                name: "Victoria Island",
              },
              {
                place_id: 104,
                display_name: "Murtala Muhammed International Airport, Ikeja",
                lat: "6.5770",
                lon: "3.3210",
                name: "Lagos Airport",
              },
            ] as any);
            return;
          }
        }
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [country]
  );

  const handleTextChange = (text: string) => {
    setQuery(text);
    setSelected(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 500);
  };

  /** Derive a short name from the result */
  const getShortName = (item: NominatimResult): string => {
    if (item.name && item.name.length > 0) return item.name;
    if (item.address?.road) return item.address.road;
    // Fallback: first part of display_name
    return item.display_name.split(",")[0].trim();
  };

  const handleSelect = (item: NominatimResult) => {
    const location: DeliveryLocation = {
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      shortName: getShortName(item),
    };

    setQuery(location.shortName);
    setSuggestions([]);
    setSelected(true);
    setIsFocused(false);
    onSelect(location);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setSelected(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputRowFocused,
          selected && styles.inputRowSelected,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={selected ? "#10b981" : iconColor}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 250)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color="#01656c"
            style={styles.loader}
          />
        )}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions Dropdown */}
      {isFocused && suggestions.length > 0 && !selected && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => String(item.place_id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#01656c"
                  style={styles.suggestionIcon}
                />
                <View style={styles.suggestionTextWrap}>
                  <Text style={styles.suggestionTitle} numberOfLines={1}>
                    {getShortName(item)}
                  </Text>
                  <Text style={styles.suggestionSubtitle} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    zIndex: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: "GTWalsheimPro",
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f7f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputRowFocused: {
    borderColor: "#bbcf8d",
    backgroundColor: "#fafffe",
  },
  inputRowSelected: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "GTWalsheimPro",
    color: "#1f2937",
  },
  loader: {
    marginLeft: 8,
  },
  clearBtn: {
    marginLeft: 8,
    padding: 2,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginTop: 4,
    maxHeight: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionTextWrap: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontFamily: "GTWalsheimPro-Medium",
    color: "#1f2937",
  },
  suggestionSubtitle: {
    fontSize: 12,
    fontFamily: "GTWalsheimPro",
    color: "#9ca3af",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 14,
  },
});
