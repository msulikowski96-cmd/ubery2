export type Platform = "uber" | "bolt" | "freenow";

export type ProfitabilityLevel = "profit" | "marginal" | "loss";

export interface Trip {
  id: string;
  platform: Platform;
  pickupDistance: number;
  pickupTime: number;
  tripDistance: number;
  tripTime: number;
  grossEarnings: number;
  driverPercentage: number;
  fuelConsumption: number;
  fuelPrice: number;
  timestamp: number;
}

export interface TripWithCalculations extends Trip {
  netEarnings: number;
  fuelCost: number;
  maintenanceCost: number;
  opportunityCost: number;
  profitPerKm: number;
  profitPerHour: number;
  profitability: ProfitabilityLevel;
}

export interface DriverSettings {
  fuelConsumption: number;
  fuelPrice: number;
  maintenanceCostPerKm: number;
  minHourlyWage: number;
  uberPercentage: number;
  boltPercentage: number;
  freenowPercentage: number;
  overlayTransparency: number;
  vibrationEnabled: boolean;
  displayName: string;
}

export const DEFAULT_SETTINGS: DriverSettings = {
  fuelConsumption: 8.0,
  fuelPrice: 6.5,
  maintenanceCostPerKm: 0.3,
  minHourlyWage: 25,
  uberPercentage: 75,
  boltPercentage: 80,
  freenowPercentage: 78,
  overlayTransparency: 0.95,
  vibrationEnabled: true,
  displayName: "Kierowca",
};

export function getPlatformName(platform: Platform): string {
  switch (platform) {
    case "uber":
      return "Uber";
    case "bolt":
      return "Bolt";
    case "freenow":
      return "FreeNow";
  }
}

export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case "uber":
      return "#000000";
    case "bolt":
      return "#34D186";
    case "freenow":
      return "#E30613";
  }
}

export function calculateTripDetails(
  trip: Trip,
  settings: DriverSettings
): TripWithCalculations {
  const totalDistance = trip.pickupDistance + trip.tripDistance;
  const totalTime = trip.pickupTime + trip.tripTime;

  const fuelCost =
    (totalDistance / 100) * settings.fuelConsumption * settings.fuelPrice;
  const maintenanceCost = totalDistance * settings.maintenanceCostPerKm;
  const opportunityCost = (totalTime / 60) * settings.minHourlyWage;

  const grossAfterPlatform = trip.grossEarnings * (trip.driverPercentage / 100);
  const netEarnings = grossAfterPlatform - fuelCost - maintenanceCost;

  const profitPerKm = totalDistance > 0 ? netEarnings / totalDistance : 0;
  const profitPerHour = totalTime > 0 ? (netEarnings / totalTime) * 60 : 0;

  let profitability: ProfitabilityLevel;
  if (profitPerKm >= 1.5 && profitPerHour >= settings.minHourlyWage) {
    profitability = "profit";
  } else if (profitPerKm >= 0.8 && profitPerHour >= settings.minHourlyWage * 0.7) {
    profitability = "marginal";
  } else {
    profitability = "loss";
  }

  return {
    ...trip,
    netEarnings,
    fuelCost,
    maintenanceCost,
    opportunityCost,
    profitPerKm,
    profitPerHour,
    profitability,
  };
}

export function getProfitabilityColor(level: ProfitabilityLevel): string {
  switch (level) {
    case "profit":
      return "#00D68F";
    case "marginal":
      return "#FFB946";
    case "loss":
      return "#FF4757";
  }
}
