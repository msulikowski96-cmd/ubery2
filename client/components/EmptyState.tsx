import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  description: string;
  imageSource?: any;
}

export function EmptyState({ title, description, imageSource }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      ) : null}
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
