import React, { useState, useCallback } from "react";
import { View, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { InputField } from "@/components/InputField";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { DriverSettings, DEFAULT_SETTINGS } from "@/types/trip";
import { getSettings, saveSettings, clearAllData } from "@/lib/storage";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [settings, setSettings] = useState<DriverSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    const loadedSettings = await getSettings();
    setSettings(loadedSettings);
    setHasChanges(false);
  };

  const updateSetting = <K extends keyof DriverSettings>(
    key: K,
    value: DriverSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await saveSettings(settings);
    setHasChanges(false);
  };

  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Usun dane",
      "Czy na pewno chcesz usunac wszystkie dane? Ta operacja jest nieodwracalna.",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usun",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await loadSettings();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Image
          source={require("../../assets/images/avatar-driver.png")}
          style={styles.avatar}
          resizeMode="cover"
        />
        <InputField
          label="Nazwa wyswietlana"
          value={settings.displayName}
          onChangeText={(text) => updateSetting("displayName", text)}
          placeholder="Twoje imie"
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Ustawienia paliwa</ThemedText>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <InputField
          label="Spalanie"
          icon="droplet"
          value={settings.fuelConsumption.toString()}
          onChangeText={(text) =>
            updateSetting("fuelConsumption", parseFloat(text) || 0)
          }
          suffix="l/100km"
          keyboardType="decimal-pad"
        />
        <InputField
          label="Cena paliwa"
          icon="dollar-sign"
          value={settings.fuelPrice.toString()}
          onChangeText={(text) =>
            updateSetting("fuelPrice", parseFloat(text) || 0)
          }
          suffix="zl/l"
          keyboardType="decimal-pad"
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Prowizje platform</ThemedText>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <InputField
          label="Uber - procent dla kierowcy"
          value={settings.uberPercentage.toString()}
          onChangeText={(text) =>
            updateSetting("uberPercentage", parseFloat(text) || 0)
          }
          suffix="%"
          keyboardType="decimal-pad"
        />
        <InputField
          label="Bolt - procent dla kierowcy"
          value={settings.boltPercentage.toString()}
          onChangeText={(text) =>
            updateSetting("boltPercentage", parseFloat(text) || 0)
          }
          suffix="%"
          keyboardType="decimal-pad"
        />
        <InputField
          label="FreeNow - procent dla kierowcy"
          value={settings.freenowPercentage.toString()}
          onChangeText={(text) =>
            updateSetting("freenowPercentage", parseFloat(text) || 0)
          }
          suffix="%"
          keyboardType="decimal-pad"
        />
      </View>

      <ThemedText style={styles.sectionTitle}>Preferencje</ThemedText>
      <View
        style={[
          styles.settingsCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ToggleSwitch
          value={settings.vibrationEnabled}
          onValueChange={(value) => updateSetting("vibrationEnabled", value)}
          label="Wibracje"
          description="Wibruj przy nowych kursach"
        />
      </View>

      {hasChanges ? (
        <Button onPress={handleSave} style={styles.saveButton}>
          Zapisz zmiany
        </Button>
      ) : null}

      <View style={styles.dangerZone}>
        <ThemedText
          style={[styles.dangerTitle, { color: AppColors.lossRed }]}
        >
          Strefa niebezpieczna
        </ThemedText>
        <Pressable
          onPress={handleClearData}
          style={[
            styles.dangerButton,
            { borderColor: AppColors.lossRed },
          ]}
        >
          <Feather name="trash-2" size={18} color={AppColors.lossRed} />
          <ThemedText style={{ color: AppColors.lossRed }}>
            Usun wszystkie dane
          </ThemedText>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <ThemedText
          style={[styles.footerText, { color: theme.textSecondary }]}
        >
          RideCalc Pro v1.0.0
        </ThemedText>
        <ThemedText
          style={[styles.footerText, { color: theme.textSecondary }]}
        >
          Wszystkie dane przechowywane lokalnie
        </ThemedText>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
    opacity: 0.7,
  },
  settingsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  saveButton: {
    marginTop: Spacing.xl,
  },
  dangerZone: {
    marginTop: Spacing["3xl"],
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,71,87,0.2)",
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 12,
  },
});
