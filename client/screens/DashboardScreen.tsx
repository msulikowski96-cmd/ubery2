import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput } from "react-native";
import * as Location from 'expo-location';
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
import { getTrips, getSettings, saveTrip } from "@/lib/storage";

type RideState = 'idle' | 'to_client' | 'with_client' | 'finished';

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

  // New tracking state
  const [rideState, setRideState] = useState<RideState>('idle');
  const [trackingData, setTrackingData] = useState<{
    startToClientAt?: number;
    endToClientAt?: number;
    startWithClientAt?: number;
    endWithClientAt?: number;
    distanceToClient: number;
    lastLocation?: Location.LocationObject;
  }>({ distanceToClient: 0 });
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [finalAmount, setFinalAmount] = useState("");

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Błąd', 'Brak uprawnień do lokalizacji');
      return;
    }

    setRideState('to_client');
    const now = Date.now();
    setTrackingData({
      startToClientAt: now,
      distanceToClient: 0,
    });

    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (location) => {
        setTrackingData(prev => {
          if (!prev.lastLocation) return { ...prev, lastLocation: location };
          const dist = calculateDistance(
            prev.lastLocation.coords.latitude,
            prev.lastLocation.coords.longitude,
            location.coords.latitude,
            location.coords.longitude
          );
          return {
            ...prev,
            distanceToClient: prev.distanceToClient + dist,
            lastLocation: location
          };
        });
      }
    );
  };

  const handleStopToClient = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setRideState('with_client');
    setTrackingData(prev => ({
      ...prev,
      endToClientAt: Date.now(),
      startWithClientAt: Date.now(),
    }));
  };

  const handleStopWithClient = () => {
    setRideState('finished');
    setTrackingData(prev => ({
      ...prev,
      endWithClientAt: Date.now(),
    }));
    setShowAmountModal(true);
  };

  const handleSaveRide = async () => {
    const amountNum = parseFloat(finalAmount.replace(',', '.'));
    if (isNaN(amountNum)) {
      Alert.alert('Błąd', 'Wpisz poprawną kwotę');
      return;
    }

    const pickupTime = trackingData.endToClientAt && trackingData.startToClientAt 
      ? Math.round((trackingData.endToClientAt - trackingData.startToClientAt) / 60000)
      : 0;
    
    const tripTime = trackingData.endWithClientAt && trackingData.startWithClientAt
      ? Math.round((trackingData.endWithClientAt - trackingData.startWithClientAt) / 60000)
      : 0;

    const newTrip: Trip = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      pickupDistance: trackingData.distanceToClient,
      pickupTime,
      tripDistance: 0, // In this simplified demo, we only track pickup distance automatically
      tripTime,
      grossEarnings: amountNum,
      driverPercentage: selectedPlatform === 'uber' ? settings.uberPercentage : selectedPlatform === 'bolt' ? settings.boltPercentage : settings.freenowPercentage,
      fuelConsumption: settings.fuelConsumption,
      fuelPrice: settings.fuelPrice,
      timestamp: Date.now(),
    };

    await saveTrip(newTrip);
    setShowAmountModal(false);
    setRideState('idle');
    setFinalAmount("");
    loadData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

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
      <View style={styles.trackingCard}>
        {rideState === 'idle' && (
          <Pressable 
            style={[styles.trackingButton, { backgroundColor: AppColors.primaryAccent }]}
            onPress={startTracking}
          >
            <Feather name="play" size={24} color="white" />
            <ThemedText style={styles.trackingButtonText}>Start Dojazdu</ThemedText>
          </Pressable>
        )}
        {rideState === 'to_client' && (
          <View style={styles.activeTracking}>
            <ThemedText style={styles.trackingInfo}>Dystans: {trackingData.distanceToClient.toFixed(2)} km</ThemedText>
            <Pressable 
              style={[styles.trackingButton, { backgroundColor: AppColors.warningAmber }]}
              onPress={handleStopToClient}
            >
              <Feather name="user" size={24} color="white" />
              <ThemedText style={styles.trackingButtonText}>Start Kursu</ThemedText>
            </Pressable>
          </View>
        )}
        {rideState === 'with_client' && (
          <View style={styles.activeTracking}>
            <ThemedText style={styles.trackingInfo}>Kurs w trakcie...</ThemedText>
            <Pressable 
              style={[styles.trackingButton, { backgroundColor: AppColors.lossRed }]}
              onPress={handleStopWithClient}
            >
              <Feather name="square" size={24} color="white" />
              <ThemedText style={styles.trackingButtonText}>Stop</ThemedText>
            </Pressable>
          </View>
        )}
      </View>

      <Modal visible={showAmountModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.modalTitle}>Podaj kwotę za kurs</ThemedText>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              placeholder="0.00"
              keyboardType="numeric"
              value={finalAmount}
              onChangeText={setFinalAmount}
              autoFocus
            />
            <Pressable style={[styles.trackingButton, { backgroundColor: AppColors.profitGreen }]} onPress={handleSaveRide}>
              <ThemedText style={styles.trackingButtonText}>Zapisz</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ThemedText style={styles.sectionTitle}>Tryb Nakładki</ThemedText>
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
  trackingCard: {
    marginBottom: Spacing.xl,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  trackingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  activeTracking: {
    gap: Spacing.md,
  },
  trackingInfo: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    fontSize: 18,
    textAlign: 'center',
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
