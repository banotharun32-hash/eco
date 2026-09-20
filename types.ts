export interface User {
  id: string;
  name: string;
  email: string;
  householdSize: number;
  location: string;
  createdAt: string;
  ecoLevel?: string;
}

export interface ApplianceUsage {
  airConditionerHoursPerDay: number;
  refrigeratorType: 'standard' | 'energy_star' | 'old';
  washingMachineCyclesPerWeek: number;
  tvHoursPerDay: number;
  computerHoursPerDay: number;
  otherApplianceWatts: number;
}

export interface HouseholdInputs {
  month: string; // YYYY-MM
  electricityKwh: number;
  gasM3: number;
  waterLiters: number;
  carKm: number;
  carFuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  publicTransportKm: number;
  motorcycleKm: number;
  flightsCount: number;
  appliances: ApplianceUsage;
}

export interface CategoryEmissions {
  electricityKg: number;
  gasKg: number;
  waterKg: number;
  transportationKg: number;
  appliancesKg: number;
  totalKg: number;
  totalTonnes: number;
  totalEnergyKwh: number;
}

export interface CategoryPercentages {
  electricity: number;
  gas: number;
  water: number;
  transportation: number;
  appliances: number;
}

export interface UsageRecord extends HouseholdInputs {
  id: string;
  userId: string;
  emissions: CategoryEmissions;
  percentages: CategoryPercentages;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: 'electricity' | 'transportation' | 'carbon' | 'water';
  targetPercentage: number;
  startingValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  explanation: string;
  potentialCo2SavingsKg: number;
  potentialCostSavingsUsd: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Electricity' | 'Transportation' | 'Water' | 'Appliances' | 'Lifestyle';
  actionableStep: string;
}

export interface EmissionFactorsConfig {
  electricityKgPerKwh: number;
  gasKgPerM3: number;
  waterKgPerLiter: number;
  carKgPerKm: {
    petrol: number;
    diesel: number;
    hybrid: number;
    electric: number;
  };
  publicTransportKgPerKm: number;
  motorcycleKgPerKm: number;
  flightKgPerFlight: number;
  appliancePowerKw: {
    airConditioner: number;
    refrigeratorDailyKwh: {
      standard: number;
      energy_star: number;
      old: number;
    };
    washingMachineKwhPerCycle: number;
    tvKw: number;
    computerKw: number;
  };
}
