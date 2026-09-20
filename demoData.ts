import { User, UsageRecord, Goal, Recommendation, HouseholdInputs } from '../types';
import { calculateEmissions } from '../utils/emissionFactors';

export const INITIAL_DEMO_USER: User = {
  id: 'usr_demo_101',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@ecotrack.org',
  householdSize: 3,
  location: 'Seattle, WA, USA',
  createdAt: '2026-01-01T08:00:00.000Z',
  ecoLevel: 'Eco Champion (Level 3)',
};

const rawHistoricalInputs: HouseholdInputs[] = [
  {
    month: '2026-01',
    electricityKwh: 420,
    gasM3: 65,
    waterLiters: 11500,
    carKm: 650,
    carFuelType: 'petrol',
    publicTransportKm: 120,
    motorcycleKm: 0,
    flightsCount: 1,
    appliances: {
      airConditionerHoursPerDay: 1,
      refrigeratorType: 'standard',
      washingMachineCyclesPerWeek: 4,
      tvHoursPerDay: 4,
      computerHoursPerDay: 8,
      otherApplianceWatts: 300,
    },
  },
  {
    month: '2026-02',
    electricityKwh: 390,
    gasM3: 58,
    waterLiters: 11000,
    carKm: 580,
    carFuelType: 'petrol',
    publicTransportKm: 150,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 0,
      refrigeratorType: 'standard',
      washingMachineCyclesPerWeek: 3,
      tvHoursPerDay: 3.5,
      computerHoursPerDay: 7,
      otherApplianceWatts: 250,
    },
  },
  {
    month: '2026-03',
    electricityKwh: 360,
    gasM3: 45,
    waterLiters: 10200,
    carKm: 520,
    carFuelType: 'petrol',
    publicTransportKm: 180,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 0,
      refrigeratorType: 'energy_star',
      washingMachineCyclesPerWeek: 3,
      tvHoursPerDay: 3,
      computerHoursPerDay: 6.5,
      otherApplianceWatts: 220,
    },
  },
  {
    month: '2026-04',
    electricityKwh: 330,
    gasM3: 35,
    waterLiters: 9800,
    carKm: 450,
    carFuelType: 'hybrid',
    publicTransportKm: 210,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 1,
      refrigeratorType: 'energy_star',
      washingMachineCyclesPerWeek: 3,
      tvHoursPerDay: 2.5,
      computerHoursPerDay: 6,
      otherApplianceWatts: 200,
    },
  },
  {
    month: '2026-05',
    electricityKwh: 310,
    gasM3: 28,
    waterLiters: 9200,
    carKm: 390,
    carFuelType: 'hybrid',
    publicTransportKm: 240,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 2,
      refrigeratorType: 'energy_star',
      washingMachineCyclesPerWeek: 2,
      tvHoursPerDay: 2,
      computerHoursPerDay: 6,
      otherApplianceWatts: 180,
    },
  },
  {
    month: '2026-06',
    electricityKwh: 295,
    gasM3: 22,
    waterLiters: 8900,
    carKm: 340,
    carFuelType: 'hybrid',
    publicTransportKm: 280,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 2.5,
      refrigeratorType: 'energy_star',
      washingMachineCyclesPerWeek: 2,
      tvHoursPerDay: 2,
      computerHoursPerDay: 5.5,
      otherApplianceWatts: 150,
    },
  },
];

export const INITIAL_DEMO_RECORDS: UsageRecord[] = rawHistoricalInputs.map((input, idx) => {
  const { emissions, percentages } = calculateEmissions(input);
  return {
    ...input,
    id: `rec_2026_0${idx + 1}`,
    userId: INITIAL_DEMO_USER.id,
    emissions,
    percentages,
    createdAt: new Date(2026, idx, 15).toISOString(),
  };
});

export const INITIAL_DEMO_GOALS: Goal[] = [
  {
    id: 'goal_01',
    userId: INITIAL_DEMO_USER.id,
    title: 'Reduce Electricity Consumption by 15%',
    type: 'electricity',
    targetPercentage: 15,
    startingValue: 420,
    targetValue: 357,
    currentValue: 295,
    unit: 'kWh',
    deadline: '2026-08-31',
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'goal_02',
    userId: INITIAL_DEMO_USER.id,
    title: 'Cut Driving Emissions by 20%',
    type: 'transportation',
    targetPercentage: 20,
    startingValue: 111, // ~650km petrol kg CO2
    targetValue: 88,
    currentValue: 34.6, // ~340km hybrid kg CO2
    status: 'completed',
    unit: 'kg CO₂e',
    deadline: '2026-06-30',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'goal_03',
    userId: INITIAL_DEMO_USER.id,
    title: 'Lower Total Monthly Carbon Footprint to under 350 kg',
    type: 'carbon',
    targetPercentage: 25,
    startingValue: 625,
    targetValue: 350,
    currentValue: 326,
    unit: 'kg CO₂e',
    deadline: '2026-09-30',
    status: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'goal_04',
    userId: INITIAL_DEMO_USER.id,
    title: 'Reduce Household Water Usage by 10%',
    type: 'water',
    targetPercentage: 10,
    startingValue: 11500,
    targetValue: 10350,
    currentValue: 8900,
    unit: 'Liters',
    deadline: '2026-07-31',
    status: 'completed',
    createdAt: '2026-02-10T10:00:00.000Z',
  },
];

/**
 * Generates personalized recommendations based on the user's latest usage record
 */
export function generateRecommendations(records: UsageRecord[]): Recommendation[] {
  if (!records || records.length === 0) {
    return [
      {
        id: 'rec_gen_01',
        title: 'Switch to High-Efficiency LED Lighting',
        explanation: 'LED bulbs use up to 85% less energy than standard incandescent lights and last 25 times longer.',
        potentialCo2SavingsKg: 25,
        potentialCostSavingsUsd: 12,
        difficulty: 'Easy',
        category: 'Electricity',
        actionableStep: 'Replace top 5 most frequently used light fixtures with 10W LED bulbs.',
      },
    ];
  }

  const latest = records[records.length - 1];
  const recs: Recommendation[] = [];

  // Electricity condition
  if (latest.electricityKwh > 300) {
    recs.push({
      id: 'rec_elec_01',
      title: 'Optimize Household Electricity & Phantom Load',
      explanation: `Your current electricity usage is ${latest.electricityKwh} kWh/mo. Unplugging standby electronics or using smart power strips can reduce standby power usage by ~10%.`,
      potentialCo2SavingsKg: Math.round(latest.electricityKwh * 0.1 * 0.385),
      potentialCostSavingsUsd: Math.round(latest.electricityKwh * 0.1 * 0.16),
      difficulty: 'Easy',
      category: 'Electricity',
      actionableStep: 'Plug entertainment and home office setups into smart power strips with auto-shutoff.',
    });
  }

  // Air Conditioner condition
  if (latest.appliances.airConditionerHoursPerDay >= 2) {
    recs.push({
      id: 'rec_ac_01',
      title: 'Adjust Thermostat & Use Smart AC Scheduling',
      explanation: `You run your AC ~${latest.appliances.airConditionerHoursPerDay} hrs/day. Raising your thermostat by 2°F (1°C) in summer cuts cooling energy by 6-8%.`,
      potentialCo2SavingsKg: 38,
      potentialCostSavingsUsd: 18,
      difficulty: 'Easy',
      category: 'Appliances',
      actionableStep: 'Set thermostat to 78°F (25.5°C) and pair with a ceiling fan for airflow.',
    });
  }

  // Transportation condition
  if (latest.carKm > 300) {
    recs.push({
      id: 'rec_trans_01',
      title: 'Combine Household Trips & Increase Transit Days',
      explanation: `Driving ${latest.carKm} km/month contributes significant emissions. Replacing 1 trip per week with public transit or cycling reduces vehicle wear and emissions.`,
      potentialCo2SavingsKg: Math.round(latest.carKm * 0.25 * 0.171),
      potentialCostSavingsUsd: Math.round(latest.carKm * 0.25 * 0.12),
      difficulty: 'Medium',
      category: 'Transportation',
      actionableStep: 'Designate two days per week for public transit, cycling, or consolidated grocery runs.',
    });
  }

  // Water condition
  if (latest.waterLiters > 9000) {
    recs.push({
      id: 'rec_water_01',
      title: 'Install Low-Flow Aerators & Showerheads',
      explanation: `At ${latest.waterLiters.toLocaleString()} L/month, installing inexpensive low-flow aerators cuts water flow rate by 30-50% without reducing water pressure.`,
      potentialCo2SavingsKg: 15,
      potentialCostSavingsUsd: 22,
      difficulty: 'Easy',
      category: 'Water',
      actionableStep: 'Screw 1.5 GPM low-flow aerators onto kitchen and bathroom faucets.',
    });
  }

  // Refrigerator / Appliances condition
  if (latest.appliances.refrigeratorType === 'old' || latest.appliances.refrigeratorType === 'standard') {
    recs.push({
      id: 'rec_app_01',
      title: 'Upgrade Refrigerator to Energy Star Certified Unit',
      explanation: 'Older refrigerators consume over 700 kWh/year. Energy Star models consume 40% less energy.',
      potentialCo2SavingsKg: 28,
      potentialCostSavingsUsd: 15,
      difficulty: 'Hard',
      category: 'Appliances',
      actionableStep: 'Look for local utility rebates when upgrading to an Energy Star rated refrigerator.',
    });
  }

  // Gas heating
  if (latest.gasM3 > 30) {
    recs.push({
      id: 'rec_gas_01',
      title: 'Lower Water Heater Temperature to 120°F (49°C)',
      explanation: 'Most factory water heaters are set to 140°F. Lowering to 120°F saves gas and prevents scalding.',
      potentialCo2SavingsKg: 30,
      potentialCostSavingsUsd: 14,
      difficulty: 'Easy',
      category: 'Lifestyle',
      actionableStep: 'Turn down the dial on your gas water heater to 120°F or "Normal" mode.',
    });
  }

  return recs;
}
