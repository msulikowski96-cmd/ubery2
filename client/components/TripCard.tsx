import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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

interface TripCardProps {
  trip: TripWithCalculations;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TripCard({ trip, onPress }: TripCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const profitColor = getProfitabilityColor(trip.profitability);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.platformInfo}>
          <PlatformIcon platform={trip.platform} size={36} />
          <View style={styles.platformText}>
            <ThemedText style={styles.platformName}>
              {getPlatformName(trip.platform)}
            </ThemedText>
            <ThemedText
              style={[styles.timestamp, { color: theme.textSecondary }]}
            >
              {formatTime(trip.timestamp)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.earningsContainer}>
          <ThemedText style={[styles.earnings, { color: profitColor }]}>
            {trip.netEarnings.toFixed(2)} zl
          </ThemedText>
          <ProfitIndicator level={trip.profitability} size={20} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <ThemedText
            style={[styles.metricLabel, { color: theme.textSecondary }]}
          >
            Dojazd
          </ThemedText>
          <ThemedText style={styles.metricValue}>
            {trip.pickupDistance.toFixed(1)} km
          </ThemedText>
        </View>
        <View style={styles.metric}>
          <ThemedText
            style={[styles.metricLabel, { color: theme.textSecondary }]}
          >
            Kurs
          </ThemedText>
          <ThemedText style={styles.metricValue}>
            {trip.tripDistance.toFixed(1)} km
          </ThemedText>
        </View>
        <View style={styles.metric}>
          <ThemedText
            style={[styles.metricLabel, { color: theme.textSecondary }]}
          >
            Brutto
          </ThemedText>
          <ThemedText style={styles.metricValue}>
            {trip.grossEarnings.toFixed(0)} zl
          </ThemedText>
        </View>
        <View style={styles.metric}>
          <ThemedText
            style={[styles.metricLabel, { color: theme.textSecondary }]}
          >
            Zysk/km
          </ThemedText>
          <ThemedText style={[styles.metricValue, { color: profitColor }]}>
            {trip.profitPerKm.toFixed(2)} zl
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platformInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  platformText: {
    gap: 2,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
  },
  earningsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  earnings: {
    fontSize: 20,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
