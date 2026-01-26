import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
}

export function ToggleSwitch({
  value,
  onValueChange,
  label,
  description,
}: ToggleSwitchProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.backgroundSecondary, AppColors.profitGreen]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(progress.value * 20, {
          damping: 15,
          stiffness: 200,
        }),
      },
    ],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.textContainer}>
        {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
        {description ? (
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </ThemedText>
        ) : null}
      </View>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
