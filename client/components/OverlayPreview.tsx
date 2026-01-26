import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { PlatformIcon } from "@/components/PlatformIcon";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { Platform as TripPlatform, ProfitabilityLevel } from "@/types/trip";

interface OverlayPreviewProps {
  platform: TripPlatform;
  earnings: number;
  pickupDistance: number;
  pickupTime: number;
  tripDistance: number;
  tripTime: number;
  profitability: ProfitabilityLevel;
}

export function OverlayPreview({
  platform,
  earnings,
  pickupDistance,
  pickupTime,
  tripDistance,
  tripTime,
  profitability,
}: OverlayPreviewProps) {
  const { theme } = useTheme();

  const getBackgroundTint = () => {
    switch (profitability) {
      case "profit":
        return "rgba(0, 214, 143, 0.08)";
      case "marginal":
        return "rgba(255, 185, 70, 0.08)";
      case "loss":
        return "rgba(255, 71, 87, 0.08)";
    }
  };

  const getEarningsColor = () => {
    switch (profitability) {
      case "profit":
        return AppColors.profitGreen;
      case "marginal":
        return AppColors.warningAmber;
      case "loss":
        return AppColors.lossRed;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: getEarningsColor() + "40",
        },
      ]}
    >
      <View style={[styles.overlay, { backgroundColor: getBackgroundTint() }]}>
        <View style={styles.leftSection}>
          <PlatformIcon platform={platform} size={28} />
          <View style={styles.earningsSection}>
            <ThemedText
              style={[styles.earningsValue, { color: getEarningsColor() }]}
            >
              {earnings.toFixed(2)}
            </ThemedText>
            <ThemedText
              style={[styles.earningsLabel, { color: theme.textSecondary }]}
            >
              zl netto
            </ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <ThemedText
                style={[styles.metricLabel, { color: theme.textSecondary }]}
              >
                Dojazd
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {pickupDistance.toFixed(1)} km
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText
                style={[styles.metricLabel, { color: theme.textSecondary }]}
              >
                Czas
              </ThemedText>
              <ThemedText style={styles.metricValue}>{pickupTime} min</ThemedText>
            </View>
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <ThemedText
                style={[styles.metricLabel, { color: theme.textSecondary }]}
              >
                Kurs
              </ThemedText>
              <ThemedText style={styles.metricValue}>
                {tripDistance.toFixed(1)} km
              </ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText
                style={[styles.metricLabel, { color: theme.textSecondary }]}
              >
                Czas
              </ThemedText>
              <ThemedText style={styles.metricValue}>{tripTime} min</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  overlay: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  earningsSection: {
    alignItems: "flex-start",
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  earningsLabel: {
    fontSize: 11,
    marginTop: -2,
  },
  divider: {
    width: 1,
    height: 50,
    marginHorizontal: Spacing.lg,
  },
  metricsGrid: {
    flex: 1,
    gap: Spacing.sm,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
  },
});
