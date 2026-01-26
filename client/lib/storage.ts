import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip, DriverSettings, DEFAULT_SETTINGS } from "@/types/trip";

const TRIPS_KEY = "@ridecalc_trips";
const SETTINGS_KEY = "@ridecalc_settings";

export async function getTrips(): Promise<Trip[]> {
  try {
    const data = await AsyncStorage.getItem(TRIPS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading trips:", error);
    return [];
  }
}

export async function saveTrip(trip: Trip): Promise<void> {
  try {
    const trips = await getTrips();
    trips.unshift(trip);
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Error saving trip:", error);
    throw error;
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  try {
    const trips = await getTrips();
    const filtered = trips.filter((t) => t.id !== tripId);
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

export async function getSettings(): Promise<DriverSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: DriverSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TRIPS_KEY, SETTINGS_KEY]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}
