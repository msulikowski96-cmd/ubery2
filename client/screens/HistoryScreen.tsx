import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { TripCard } from "@/components/TripCard";
import { FilterChip } from "@/components/FilterChip";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import {
  Trip,
  TripWithCalculations,
  DriverSettings,
  DEFAULT_SETTINGS,
  calculateTripDetails,
  Platform as TripPlatform,
} from "@/types/trip";
import { getTrips, getSettings } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type FilterType = "all" | "uber" | "bolt" | "freenow" | "week";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [settings, setSettings] = useState<DriverSettings>(DEFAULT_SETTINGS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [loadedTrips, loadedSettings] = await Promise.all([
      getTrips(),
      getSettings(),
    ]);
    setTrips(loadedTrips);
    setSettings(loadedSettings);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFilterChange = (newFilter: FilterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const handleAddTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("AddTrip");
  };

  const handleTripPress = (trip: TripWithCalculations) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("TripDetail", { trip });
  };

  const filteredTrips = trips.filter((trip) => {
    if (filter === "all") return true;
    if (filter === "week") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return trip.timestamp >= weekAgo;
    }
    return trip.platform === filter;
  });

  const tripsWithCalculations: TripWithCalculations[] = filteredTrips.map(
    (trip) => calculateTripDetails(trip, settings)
  );

  const renderItem = ({ item }: { item: TripWithCalculations }) => (
    <TripCard trip={item} onPress={() => handleTripPress(item)} />
  );

  const renderEmpty = () => (
    <EmptyState
      title="Brak kursow"
      description="Dodaj swoj pierwszy kurs, aby rozpoczac sledzenie zarobkow i analize oplacalnosci."
      imageSource={require("../../assets/images/empty-history.png")}
    />
  );

  const renderHeader = () => (
    <View style={styles.filtersContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={
          [
            { key: "all", label: "Wszystkie" },
            { key: "week", label: "Ten tydzien" },
            { key: "uber", label: "Uber" },
            { key: "bolt", label: "Bolt" },
            { key: "freenow", label: "FreeNow" },
          ] as { key: FilterType; label: string }[]
        }
        renderItem={({ item }) => (
          <View style={styles.chipWrapper}>
            <FilterChip
              label={item.label}
              selected={filter === item.key}
              onPress={() => handleFilterChange(item.key)}
            />
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtersList}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={tripsWithCalculations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl + 80,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={AppColors.primaryAccent}
          />
        }
      />

      <Pressable
        onPress={handleAddTrip}
        style={[
          styles.fab,
          {
            backgroundColor: AppColors.primaryAccent,
            bottom: tabBarHeight + Spacing.lg,
          },
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  filtersContainer: {
    marginBottom: Spacing.lg,
  },
  filtersList: {
    gap: Spacing.sm,
  },
  chipWrapper: {
    marginRight: Spacing.sm,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
