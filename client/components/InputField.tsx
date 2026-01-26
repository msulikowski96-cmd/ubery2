import React from "react";
import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: React.ComponentProps<typeof Feather>["name"];
  suffix?: string;
  error?: string;
}

export function InputField({
  label,
  icon,
  suffix,
  error,
  style,
  ...props
}: InputFieldProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: error ? AppColors.lossRed : theme.border,
          },
        ]}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={theme.textSecondary}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            style,
          ]}
          placeholderTextColor={theme.textSecondary}
          keyboardAppearance="dark"
          {...props}
        />
        {suffix ? (
          <ThemedText style={[styles.suffix, { color: theme.textSecondary }]}>
            {suffix}
          </ThemedText>
        ) : null}
      </View>
      {error ? (
        <ThemedText style={[styles.error, { color: AppColors.lossRed }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  suffix: {
    fontSize: 14,
    marginLeft: Spacing.sm,
  },
  error: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
