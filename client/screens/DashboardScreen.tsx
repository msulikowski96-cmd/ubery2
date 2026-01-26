import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { OverlayPreview } from "@/components/OverlayPreview";
import { PlatformSelector } from "@/components/PlatformSelector";
import { MetricCard } from "@/components/MetricCard";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import {
  Platform as TripPlatform,
  Trip,
  DriverSettings,
  DEFAULT_SETTINGS,
  calculateTripDetails,
} from "@/types/trip";
import { getTrips, getSettings } from "@/lib/storage";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<TripPlatform>("uber");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [settings, setSettings] = useState<DriverSettings>(DEFAULT_SETTINGS);

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

  const handleToggleOverlay = (value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOverlayEnabled(value);
  };

  const todayTrips = trips.filter((trip) => {
    const today = new Date();
    const tripDate = new Date(trip.timestamp);
    return tripDate.toDateString() === today.toDateString();
  });

  const todayTripsWithCalc = todayTrips.map((trip) =>
    calculateTripDetails(trip, settings)
  );

  const todayEarnings = todayTripsWithCalc.reduce(
    (sum, trip) => sum + trip.netEarnings,
    0
  );
  const todayDistance = todayTrips.reduce(
    (sum, trip) => sum + trip.pickupDistance + trip.tripDistance,
    0
  );
  const todayFuelCost = todayTripsWithCalc.reduce(
    (sum, trip) => sum + trip.fuelCost,
    0
  );

  const samplePreviewData = {
    pickupDistance: 2.5,
    pickupTime: 8,
    tripDistance: 12.3,
    tripTime: 22,
    earnings: 35.5,
  };

  const sampleTripForPreview: Trip = {
    id: "preview",
    platform: selectedPlatform,
    pickupDistance: samplePreviewData.pickupDistance,
    pickupTime: samplePreviewData.pickupTime,
    tripDistance: samplePreviewData.tripDistance,
    tripTime: samplePreviewData.tripTime,
    grossEarnings: samplePreviewData.earnings,
    driverPercentage:
      selectedPlatform === "uber"
        ? settings.uberPercentage
        : selectedPlatform === "bolt"
        ? settings.boltPercentage
        : settings.freenowPercentage,
    fuelConsumption: settings.fuelConsumption,
    fuelPrice: settings.fuelPrice,
    timestamp: Date.now(),
  };

  const previewCalc = calculateTripDetails(sampleTripForPreview, settings);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.overlayToggleCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.overlayToggleHeader}>
          <View
            style={[
              styles.overlayIconContainer,
              {
                backgroundColor: overlayEnabled
                  ? AppColors.profitGreen + "20"
                  : theme.backgroundSecondary,
              },
            ]}
          >
            <Feather
              name="layers"
              size={24}
              color={overlayEnabled ? AppColors.profitGreen : theme.textSecondary}
            />
          </View>
          <View style={styles.overlayToggleText}>
            <ThemedText style={styles.overlayToggleTitle}>
              Tryb Nakładki
            </ThemedText>
            <ThemedText
              style={[
                styles.overlayToggleStatus,
                {
                  color: overlayEnabled
                    ? AppColors.profitGreen
                    : theme.textSecondary,
                },
              ]}
            >
              {overlayEnabled ? "Aktywny" : "Nieaktywny"}
            </ThemedText>
          </View>
        </View>
        <ToggleSwitch value={overlayEnabled} onValueChange={handleToggleOverlay} />
      </View>

      <ThemedText style={styles.sectionTitle}>Podglad nakładki</ThemedText>
      <OverlayPreview
        platform={selectedPlatform}
        earnings={previewCalc.netEarnings}
        pickupDistance={samplePreviewData.pickupDistance}
        pickupTime={samplePreviewData.pickupTime}
        tripDistance={samplePreviewData.tripDistance}
        tripTime={samplePreviewData.tripTime}
        profitability={previewCalc.profitability}
      />

      <ThemedText style={styles.sectionTitle}>Aktywna platforma</ThemedText>
      <PlatformSelector
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
      />

      <ThemedText style={styles.sectionTitle}>Dzisiejsze statystyki</ThemedText>
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <MetricCard
            icon="navigation"
            label="Kursy"
            value={todayTrips.length.toString()}
            color={AppColors.primaryAccent}
          />
          <View style={{ width: Spacing.sm }} />
          <MetricCard
            icon="dollar-sign"
            label="Zarobek"
            value={`${todayEarnings.toFixed(0)} zl`}
            color={AppColors.profitGreen}
          />
        </View>
        <View style={styles.statsRow}>
          <MetricCard
            icon="map"
            label="Dystans"
            value={`${todayDistance.toFixed(1)} km`}
            color={AppColors.warningAmber}
          />
          <View style={{ width: Spacing.sm }} />
          <MetricCard
            icon="droplet"
            label="Paliwo"
            value={`${todayFuelCost.toFixed(0)} zl`}
            color={AppColors.lossRed}
          />
        </View>
      </View>

      <View
        style={[
          styles.infoCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <Feather name="info" size={20} color={AppColors.primaryAccent} />
        <ThemedText
          style={[styles.infoText, { color: theme.textSecondary }]}
        >
          Dodaj kursy w zakladce Historia, aby sledzic swoje zarobki i analizowac
          oplacalnosc.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayToggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  overlayToggleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  overlayIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayToggleText: {
    gap: 2,
  },
  overlayToggleTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  overlayToggleStatus: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
    opacity: 0.7,
  },
  statsGrid: {
    gap: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xl,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
