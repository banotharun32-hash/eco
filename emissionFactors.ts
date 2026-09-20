import { EmissionFactorsConfig, HouseholdInputs, CategoryEmissions, CategoryPercentages } from '../types';

/**
 * Standard Emission Factors (EPA & IPCC Based Defaults)
 * All factors clearly documented for user transparency.
 */
export const DEFAULT_EMISSION_FACTORS: EmissionFactorsConfig = {
  // Grid electricity average emission factor: 0.385 kg CO2e per kWh
  electricityKgPerKwh: 0.385,

  // Natural gas emission factor: 2.0 kg CO2e per m3
  gasKgPerM3: 2.0,

  // Tap water treatment & distribution emission factor: 0.0003 kg CO2e per Liter (0.3 kg/m3)
  waterKgPerLiter: 0.0003,

  // Vehicle tailpipe & fuel cycle emissions per km
  carKgPerKm: {
    petrol: 0.171,
    diesel: 0.165,
    hybrid: 0.102,
    electric: 0.045, // Grid powered EV average
  },

  // Public transport average (bus/metro mixed) per passenger km: 0.038 kg CO2e
  publicTransportKgPerKm: 0.038,

  // Motorcycle average per km: 0.095 kg CO2e
  motorcycleKgPerKm: 0.095,

  // Average short-to-medium haul flight per passenger trip: 220 kg CO2e
  flightKgPerFlight: 220.0,

  // Power ratings for appliances (kW)
  appliancePowerKw: {
    airConditioner: 1.2, // ~1200W
    refrigeratorDailyKwh: {
      standard: 1.5,
      energy_star: 0.9,
      old: 2.5,
    },
    washingMachineKwhPerCycle: 0.8,
    tvKw: 0.12,
    computerKw: 0.15,
  },
};

/**
 * Calculates emissions and energy totals from raw household inputs
 */
export function calculateEmissions(
  inputs: HouseholdInputs,
  factors: EmissionFactorsConfig = DEFAULT_EMISSION_FACTORS
): { emissions: CategoryEmissions; percentages: CategoryPercentages } {
  // 1. Electricity direct usage
  const electricityKg = inputs.electricityKwh * factors.electricityKgPerKwh;

  // 2. Natural Gas usage
  const gasKg = inputs.gasM3 * factors.gasKgPerM3;

  // 3. Water usage
  const waterKg = inputs.waterLiters * factors.waterKgPerLiter;

  // 4. Transportation emissions
  const carFuel = inputs.carFuelType || 'petrol';
  const carKg = inputs.carKm * (factors.carKgPerKm[carFuel] || factors.carKgPerKm.petrol);
  const transitKg = inputs.publicTransportKm * factors.publicTransportKgPerKm;
  const motoKg = inputs.motorcycleKm * factors.motorcycleKgPerKm;
  const flightKg = inputs.flightsCount * factors.flightKgPerFlight;
  const transportationKg = carKg + transitKg + motoKg + flightKg;

  // 5. Appliance usage (monthly kWh calculation)
  const acDailyKwh = (inputs.appliances?.airConditionerHoursPerDay || 0) * factors.appliancePowerKw.airConditioner;
  const fridgeDailyKwh = factors.appliancePowerKw.refrigeratorDailyKwh[inputs.appliances?.refrigeratorType || 'standard'];
  const tvDailyKwh = (inputs.appliances?.tvHoursPerDay || 0) * factors.appliancePowerKw.tvKw;
  const computerDailyKwh = (inputs.appliances?.computerHoursPerDay || 0) * factors.appliancePowerKw.computerKw;
  const washingMonthlyKwh = (inputs.appliances?.washingMachineCyclesPerWeek || 0) * 4.33 * factors.appliancePowerKw.washingMachineKwhPerCycle;
  const otherMonthlyKwh = ((inputs.appliances?.otherApplianceWatts || 0) / 1000) * 30 * 2; // assuming ~2 hrs/day average

  const applianceMonthlyKwh = (acDailyKwh + fridgeDailyKwh + tvDailyKwh + computerDailyKwh) * 30 + washingMonthlyKwh + otherMonthlyKwh;
  const appliancesKg = applianceMonthlyKwh * factors.electricityKgPerKwh;

  // Totals
  const totalKg = electricityKg + gasKg + waterKg + transportationKg + appliancesKg;
  const totalTonnes = totalKg / 1000;

  // Equivalent energy in kWh (Gas 1m3 ~ 10.55 kWh energy equivalent, Water pumping ~0.001 kWh/L)
  const gasKwhEq = inputs.gasM3 * 10.55;
  const totalEnergyKwh = inputs.electricityKwh + gasKwhEq + applianceMonthlyKwh;

  const getPercentage = (val: number) => (totalKg > 0 ? Math.round((val / totalKg) * 100) : 0);

  const percentages: CategoryPercentages = {
    electricity: getPercentage(electricityKg),
    gas: getPercentage(gasKg),
    water: getPercentage(waterKg),
    transportation: getPercentage(transportationKg),
    appliances: getPercentage(appliancesKg),
  };

  return {
    emissions: {
      electricityKg: Number(electricityKg.toFixed(1)),
      gasKg: Number(gasKg.toFixed(1)),
      waterKg: Number(waterKg.toFixed(1)),
      transportationKg: Number(transportationKg.toFixed(1)),
      appliancesKg: Number(appliancesKg.toFixed(1)),
      totalKg: Number(totalKg.toFixed(1)),
      totalTonnes: Number(totalTonnes.toFixed(2)),
      totalEnergyKwh: Number(totalEnergyKwh.toFixed(1)),
    },
    percentages,
  };
}

/**
 * Helper to format CO2e numbers nicely
 */
export function formatCo2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO₂e`;
  }
  return `${Math.round(kg)} kg CO₂e`;
}

/**
 * National benchmarks per person / household month
 */
export const BENCHMARKS = {
  averageHouseholdMonthlyKg: 850, // ~10.2 metric tonnes/year average
  ecoTargetMonthlyKg: 450, // ~5.4 metric tonnes/year sustainable target
  avgElectricityKwh: 380,
  avgGasM3: 45,
  avgWaterLiters: 12000,
};
