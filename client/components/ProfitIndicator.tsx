import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ProfitabilityLevel, getProfitabilityColor } from "@/types/trip";

interface ProfitIndicatorProps {
  level: ProfitabilityLevel;
  size?: number;
}

export function ProfitIndicator({ level, size = 24 }: ProfitIndicatorProps) {
  const color = getProfitabilityColor(level);
  const iconSize = size * 0.6;

  const getIcon = (): React.ComponentProps<typeof Feather>["name"] => {
    switch (level) {
      case "profit":
        return "trending-up";
      case "marginal":
        return "minus";
      case "loss":
        return "trending-down";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + "20",
        },
      ]}
    >
      <Feather name={getIcon()} size={iconSize} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
