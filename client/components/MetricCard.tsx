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
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});
