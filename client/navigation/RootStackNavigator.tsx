import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import AddTripScreen from "@/screens/AddTripScreen";
import TripDetailScreen from "@/screens/TripDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { TripWithCalculations } from "@/types/trip";

export type RootStackParamList = {
  Main: undefined;
  AddTrip: undefined;
  TripDetail: { trip: TripWithCalculations };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTrip"
        component={AddTripScreen}
        options={{
          presentation: "modal",
          headerTitle: "Dodaj kurs",
        }}
      />
      <Stack.Screen
        name="TripDetail"
        component={TripDetailScreen}
        options={{
          headerTitle: "Szczegoly kursu",
        }}
      />
    </Stack.Navigator>
  );
}
