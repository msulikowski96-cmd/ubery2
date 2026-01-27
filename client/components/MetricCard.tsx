import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface MetricCardProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  color?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  color = AppColors.primaryAccent,
}: MetricCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderLeftWidth: 4,
          borderLeftColor: color,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
          <Feather name={icon} size={20} color={color} />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {label}
          </ThemedText>
          <ThemedText style={styles.value}>{value}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
});
