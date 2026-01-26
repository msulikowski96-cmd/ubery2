import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Platform as TripPlatform, getPlatformColor } from "@/types/trip";
import { BorderRadius } from "@/constants/theme";

interface PlatformIconProps {
  platform: TripPlatform;
  size?: number;
}

export function PlatformIcon({ platform, size = 32 }: PlatformIconProps) {
  const color = getPlatformColor(platform);
  const iconSize = size * 0.6;

  const getIcon = (): React.ComponentProps<typeof Feather>["name"] => {
    switch (platform) {
      case "uber":
        return "navigation";
      case "bolt":
        return "zap";
      case "freenow":
        return "truck";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 4,
          backgroundColor: color,
        },
      ]}
    >
      <Feather name={getIcon()} size={iconSize} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
