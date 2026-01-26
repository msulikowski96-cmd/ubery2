import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { PlatformIcon } from "@/components/PlatformIcon";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { Platform as TripPlatform, getPlatformName } from "@/types/trip";

interface PlatformSelectorProps {
  selectedPlatform: TripPlatform;
  onSelectPlatform: (platform: TripPlatform) => void;
}

const platforms: TripPlatform[] = ["uber", "bolt", "freenow"];

export function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
}: PlatformSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {platforms.map((platform) => {
        const isSelected = platform === selectedPlatform;
        return (
          <Pressable
            key={platform}
            onPress={() => onSelectPlatform(platform)}
            style={[
              styles.platformButton,
              {
                backgroundColor: isSelected
                  ? theme.backgroundSecondary
                  : theme.backgroundDefault,
                borderColor: isSelected
                  ? AppColors.primaryAccent
                  : "transparent",
              },
            ]}
          >
            <PlatformIcon platform={platform} size={32} />
            <ThemedText
              style={[
                styles.platformName,
                { color: isSelected ? theme.text : theme.textSecondary },
              ]}
            >
              {getPlatformName(platform)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  platformButton: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    gap: Spacing.xs,
  },
  platformName: {
    fontSize: 12,
    fontWeight: "500",
  },
});
