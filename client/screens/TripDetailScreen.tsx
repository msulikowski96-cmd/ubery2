import React from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { PlatformIcon } from "@/components/PlatformIcon";
import { ProfitIndicator } from "@/components/ProfitIndicator";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import {
  TripWithCalculations,
  getPlatformName,
  getProfitabilityColor,
} from "@/types/trip";
import { deleteTrip } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<TripDetailRouteProp>();
  const { trip } = route.params;

  const profitColor = getProfitabilityColor(trip.profitability);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Usun kurs", "Czy na pewno chcesz usunac ten kurs?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usun",
        style: "destructive",
        onPress: async () => {
          await deleteTrip(trip.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          navigation.goBack();
        },
      },
    ]);
  };

  const MetricRow = ({
    icon,
    label,
    value,
    valueColor,
  }: {
    icon: React.ComponentProps<typeof Feather>["name"];
    label: string;
    value: string;
    valueColor?: string;
  }) => (
    <View style={styles.metricRow}>
      <View style={styles.metricLeft}>
        <Feather name={icon} size={18} color={theme.textSecondary} />
        <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
      </View>
      <ThemedText style={[styles.metricValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </ThemedText>
    </View>
  );

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View
        style={[
          styles.headerCard,
          { backgroundColor: profitColor + "15" },
        ]}
      >
        <View style={styles.headerTop}>
          <PlatformIcon platform={trip.platform} size={48} />
          <ProfitIndicator level={trip.profitability} size={40} />
        </View>
        <ThemedText style={[styles.netEarnings, { color: profitColor }]}>
          {trip.netEarnings.toFixed(2)} zl
        </ThemedText>
        <ThemedText style={[styles.netLabel, { color: theme.textSecondary }]}>
          Zarobek netto
        </ThemedText>
        <View style={styles.profitMetrics}>
          <View style={styles.profitMetric}>
            <ThemedText style={[styles.profitValue, { color: profitColor }]}>
              {trip.profitPerKm.toFixed(2)} zl
            </ThemedText>
            <ThemedText style={[styles.profitLabel, { color: theme.textSecondary }]}>
              za km
            </ThemedText>
          </View>
          <View style={[styles.profitDivider, { backgroundColor: theme.border }]} />
          <View style={styles.profitMetric}>
            <ThemedText style={[styles.profitValue, { color: profitColor }]}>
              {trip.profitPerHour.toFixed(0)} zl
            </ThemedText>
            <ThemedText style={[styles.profitLabel, { color: theme.textSecondary }]}>
              za godzine
            </ThemedText>
          </View>
        </View>
      </View>

      <View
        style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <View style={styles.platformRow}>
          <PlatformIcon platform={trip.platform} size={24} />
          <ThemedText style={styles.platformName}>
            {getPlatformName(trip.platform)}
          </ThemedText>
        </View>
        <ThemedText style={[styles.timestamp, { color: theme.textSecondary }]}>
          {formatDate(trip.timestamp)}
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Dojazd</ThemedText>
      <View
        style={[styles.metricsCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <MetricRow
          icon="navigation"
          label="Dystans dojazdu"
          value={`${trip.pickupDistance.toFixed(1)} km`}
        />
        <MetricRow
          icon="clock"
          label="Czas dojazdu"
          value={`${trip.pickupTime} min`}
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Kurs</ThemedText>
      <View
        style={[styles.metricsCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <MetricRow
          icon="map"
          label="Dystans kursu"
          value={`${trip.tripDistance.toFixed(1)} km`}
        />
        <MetricRow
          icon="clock"
          label="Czas kursu"
          value={`${trip.tripTime} min`}
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Finanse</ThemedText>
      <View
        style={[styles.metricsCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <MetricRow
          icon="dollar-sign"
          label="Kwota brutto"
          value={`${trip.grossEarnings.toFixed(2)} zl`}
        />
        <MetricRow
          icon="percent"
          label="Procent dla kierowcy"
          value={`${trip.driverPercentage}%`}
        />
        <MetricRow
          icon="droplet"
          label="Koszt paliwa"
          value={`-${trip.fuelCost.toFixed(2)} zl`}
          valueColor={AppColors.lossRed}
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Ustawienia uzyte</ThemedText>
      <View
        style={[styles.metricsCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <MetricRow
          icon="droplet"
          label="Spalanie"
          value={`${trip.fuelConsumption} l/100km`}
        />
        <MetricRow
          icon="dollar-sign"
          label="Cena paliwa"
          value={`${trip.fuelPrice.toFixed(2)} zl/l`}
        />
      </View>

      <Pressable
        onPress={handleDelete}
        style={[styles.deleteButton, { borderColor: AppColors.lossRed }]}
      >
        <Feather name="trash-2" size={18} color={AppColors.lossRed} />
        <ThemedText style={{ color: AppColors.lossRed }}>Usun kurs</ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.lg,
  },
  netEarnings: {
    fontSize: 40,
    fontWeight: "700",
  },
  netLabel: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  profitMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  profitMetric: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  profitValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  profitLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  profitDivider: {
    width: 1,
    height: 40,
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  platformRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
    opacity: 0.7,
  },
  metricsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  metricLabel: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginTop: Spacing["3xl"],
  },
});
