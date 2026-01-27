import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { InputField } from "@/components/InputField";
import { PlatformSelector } from "@/components/PlatformSelector";
import { Button } from "@/components/Button";
import { OverlayPreview } from "@/components/OverlayPreview";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import {
  Platform as TripPlatform,
  Trip,
  DriverSettings,
  DEFAULT_SETTINGS,
  calculateTripDetails,
} from "@/types/trip";
import { saveTrip, getSettings } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function AddTripScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [platform, setPlatform] = useState<TripPlatform>("uber");
  const [pickupDistance, setPickupDistance] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [tripDistance, setTripDistance] = useState("");
  const [tripTime, setTripTime] = useState("");
  const [grossEarnings, setGrossEarnings] = useState("");
  const [settings, setSettings] = useState<DriverSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
  };

  const getDriverPercentage = () => {
    switch (platform) {
      case "uber":
        return settings.uberPercentage;
      case "bolt":
        return settings.boltPercentage;
      case "freenow":
        return settings.freenowPercentage;
    }
  };

  const currentTrip: Trip = {
    id: "preview",
    platform,
    pickupDistance: parseFloat(pickupDistance) || 0,
    pickupTime: parseFloat(pickupTime) || 0,
    tripDistance: parseFloat(tripDistance) || 0,
    tripTime: parseFloat(tripTime) || 0,
    grossEarnings: parseFloat(grossEarnings) || 0,
    driverPercentage: getDriverPercentage(),
    fuelConsumption: settings.fuelConsumption,
    fuelPrice: settings.fuelPrice,
    timestamp: Date.now(),
  };

  const tripCalc = calculateTripDetails(currentTrip, settings);

  const isValid =
    pickupDistance &&
    pickupTime &&
    tripDistance &&
    tripTime &&
    grossEarnings &&
    parseFloat(grossEarnings) > 0;

  const handleSave = async () => {
    if (!isValid) {
      Alert.alert("Blad", "Wypelnij wszystkie pola.");
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newTrip: Trip = {
      id: Date.now().toString(),
      platform,
      pickupDistance: parseFloat(pickupDistance),
      pickupTime: parseFloat(pickupTime),
      tripDistance: parseFloat(tripDistance),
      tripTime: parseFloat(tripTime),
      grossEarnings: parseFloat(grossEarnings),
      driverPercentage: getDriverPercentage(),
      fuelConsumption: settings.fuelConsumption,
      fuelPrice: settings.fuelPrice,
      timestamp: Date.now(),
    };

    try {
      await saveTrip(newTrip);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Blad", "Nie udalo sie zapisac kursu.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={styles.sectionHeader}>
        <Feather name="layers" size={18} color={theme.textSecondary} />
        <ThemedText style={styles.sectionTitle}>Platforma</ThemedText>
      </View>
      <PlatformSelector
        selectedPlatform={platform}
        onSelectPlatform={setPlatform}
      />

      <View style={styles.sectionHeader}>
        <Feather name="navigation" size={18} color={theme.textSecondary} />
        <ThemedText style={styles.sectionTitle}>Dane dojazdu</ThemedText>
      </View>
      <View
        style={[
          styles.inputCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <InputField
              label="Dystans dojazdu"
              icon="navigation"
              value={pickupDistance}
              onChangeText={setPickupDistance}
              suffix="km"
              keyboardType="decimal-pad"
              placeholder="0.0"
            />
          </View>
          <View style={styles.inputHalf}>
            <InputField
              label="Czas dojazdu"
              icon="clock"
              value={pickupTime}
              onChangeText={setPickupTime}
              suffix="min"
              keyboardType="number-pad"
              placeholder="0"
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Feather name="map" size={18} color={theme.textSecondary} />
        <ThemedText style={styles.sectionTitle}>Dane kursu</ThemedText>
      </View>
      <View
        style={[
          styles.inputCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <InputField
              label="Dystans kursu"
              icon="map"
              value={tripDistance}
              onChangeText={setTripDistance}
              suffix="km"
              keyboardType="decimal-pad"
              placeholder="0.0"
            />
          </View>
          <View style={styles.inputHalf}>
            <InputField
              label="Czas kursu"
              icon="clock"
              value={tripTime}
              onChangeText={setTripTime}
              suffix="min"
              keyboardType="number-pad"
              placeholder="0"
            />
          </View>
        </View>
        <InputField
          label="Kwota brutto (z napiwkiem)"
          icon="dollar-sign"
          value={grossEarnings}
          onChangeText={setGrossEarnings}
          suffix="zl"
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
      </View>

      {parseFloat(grossEarnings) > 0 ? (
        <>
          <ThemedText style={styles.sectionTitle}>Podglad</ThemedText>
          <OverlayPreview
            platform={platform}
            earnings={tripCalc.netEarnings}
            pickupDistance={parseFloat(pickupDistance) || 0}
            pickupTime={parseFloat(pickupTime) || 0}
            tripDistance={parseFloat(tripDistance) || 0}
            tripTime={parseFloat(tripTime) || 0}
            profitability={tripCalc.profitability}
          />

          <View
            style={[
              styles.summaryCard,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View style={styles.summaryRow}>
              <ThemedText style={{ color: theme.textSecondary }}>
                Koszt paliwa
              </ThemedText>
              <ThemedText style={{ color: AppColors.lossRed }}>
                -{tripCalc.fuelCost.toFixed(2)} zl
              </ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={{ color: theme.textSecondary }}>
                Prowizja platformy
              </ThemedText>
              <ThemedText style={{ color: AppColors.warningAmber }}>
                -{(tripCalc.grossEarnings * (1 - tripCalc.driverPercentage / 100)).toFixed(2)} zl
              </ThemedText>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.border }]}
            />
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Zysk/km</ThemedText>
              <ThemedText
                style={[
                  styles.summaryValue,
                  {
                    color:
                      tripCalc.profitPerKm >= 1.5
                        ? AppColors.profitGreen
                        : tripCalc.profitPerKm >= 0.8
                        ? AppColors.warningAmber
                        : AppColors.lossRed,
                  },
                ]}
              >
                {tripCalc.profitPerKm.toFixed(2)} zl
              </ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Zysk/h</ThemedText>
              <ThemedText
                style={[
                  styles.summaryValue,
                  {
                    color:
                      tripCalc.profitPerHour >= 40
                        ? AppColors.profitGreen
                        : tripCalc.profitPerHour >= 25
                        ? AppColors.warningAmber
                        : AppColors.lossRed,
                  },
                ]}
              >
                {tripCalc.profitPerHour.toFixed(0)} zl
              </ThemedText>
            </View>
          </View>
        </>
      ) : null}

      <Button
        onPress={handleSave}
        disabled={!isValid || saving}
        style={styles.saveButton}
      >
        {saving ? "Zapisywanie..." : "Zapisz kurs"}
      </Button>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    marginTop: 0,
    marginBottom: 0,
  },
  inputCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  saveButton: {
    marginTop: Spacing.xl,
  },
});
