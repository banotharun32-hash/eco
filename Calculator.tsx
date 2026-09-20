import React, { useState, useMemo } from 'react';
import {
  Zap,
  Flame,
  Droplets,
  Car,
  Tv,
  Calculator as CalcIcon,
  Save,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { HouseholdInputs, ApplianceUsage } from '../types';
import { calculateEmissions, formatCo2, DEFAULT_EMISSION_FACTORS } from '../utils/emissionFactors';

interface CalculatorProps {
  onSaveRecord: (input: HouseholdInputs) => Promise<void>;
  onOpenAbout: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onSaveRecord, onOpenAbout }) => {
  const [activeTab, setActiveTab] = useState<'electricity' | 'gas' | 'water' | 'transport' | 'appliances'>('electricity');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Month selector default to current month
  const currentDate = new Date();
  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [inputs, setInputs] = useState<HouseholdInputs>({
    month: currentMonthStr,
    electricityKwh: 350,
    gasM3: 40,
    waterLiters: 10000,
    carKm: 450,
    carFuelType: 'petrol',
    publicTransportKm: 150,
    motorcycleKm: 0,
    flightsCount: 0,
    appliances: {
      airConditionerHoursPerDay: 1.5,
      refrigeratorType: 'standard',
      washingMachineCyclesPerWeek: 3,
      tvHoursPerDay: 3,
      computerHoursPerDay: 6,
      otherApplianceWatts: 200,
    },
  });

  // Calculate emissions live in memory
  const { emissions, percentages } = useMemo(() => {
    return calculateEmissions(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof HouseholdInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleApplianceChange = (field: keyof ApplianceUsage, value: any) => {
    setInputs((prev) => ({
      ...prev,
      appliances: {
        ...prev.appliances,
        [field]: value,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveRecord(inputs);
      setSavedSuccess(true);
    } catch (err) {
      console.error('Failed to save calculator inputs:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time Footprint Engine
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Carbon & Energy Calculator</h1>
            <p className="text-emerald-100/80 text-sm mt-2 leading-relaxed">
              Enter your monthly utility consumption and travel distances. All estimates use EPA & IPCC standard emission factors.
            </p>
          </div>

          <button
            onClick={onOpenAbout}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2 border border-emerald-700 transition-colors shrink-0"
          >
            <Info className="w-4 h-4 text-emerald-400" />
            View Emission Factors
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Month & Year Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <label htmlFor="calc-month-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Target Record Month
              </label>
              <p className="text-xs text-slate-500">Select month for this usage entry</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <input
                type="month"
                id="calc-month-select"
                value={inputs.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Calculator Input Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {[
              { id: 'electricity', label: 'Electricity', icon: Zap },
              { id: 'gas', label: 'Gas', icon: Flame },
              { id: 'water', label: 'Water', icon: Droplets },
              { id: 'transport', label: 'Transport', icon: Car },
              { id: 'appliances', label: 'Appliances', icon: Tv },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`calc-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content 1: Electricity */}
          {activeTab === 'electricity' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Monthly Electricity Usage</h3>
                <span className="text-xs text-slate-500 font-medium">Factor: 0.385 kg CO₂/kWh</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Electricity Consumption (kWh / month)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    id="input-electricity-kwh"
                    value={inputs.electricityKwh}
                    onChange={(e) => handleInputChange('electricityKwh', Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    kWh
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Check your monthly utility bill for kilowatt-hours (kWh). US average is ~380 kWh/month.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <span className="font-bold block">Electricity Carbon Impact:</span>
                <p>
                  {inputs.electricityKwh} kWh × 0.385 kg ={' '}
                  <strong className="text-emerald-950">{emissions.electricityKg} kg CO₂e</strong>
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Gas */}
          {activeTab === 'gas' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Monthly Natural Gas</h3>
                <span className="text-xs text-slate-500 font-medium">Factor: 2.0 kg CO₂/m³</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Natural Gas Usage (m³ / month)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    id="input-gas-m3"
                    value={inputs.gasM3}
                    onChange={(e) => handleInputChange('gasM3', Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    m³
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Used for heating, hot water, or gas stove cooking.</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Gas Carbon Impact:</span>
                <p>
                  {inputs.gasM3} m³ × 2.0 kg = <strong className="text-amber-950">{emissions.gasKg} kg CO₂e</strong>
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 3: Water */}
          {activeTab === 'water' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Monthly Tap Water Usage</h3>
                <span className="text-xs text-slate-500 font-medium">Factor: 0.0003 kg CO₂/L</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Water Consumption (Liters / month)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    id="input-water-liters"
                    value={inputs.waterLiters}
                    onChange={(e) => handleInputChange('waterLiters', Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Liters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  1 cubic meter (m³) = 1,000 Liters. Average household uses ~10,000–12,000 L/month.
                </p>
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-1">
                <span className="font-bold block">Water Treatment & Pumping Impact:</span>
                <p>
                  {inputs.waterLiters.toLocaleString()} L × 0.0003 kg ={' '}
                  <strong className="text-sky-950">{emissions.waterKg} kg CO₂e</strong>
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 4: Transport */}
          {activeTab === 'transport' && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-base">Monthly Travel & Transportation</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Car Distance (km / month)</label>
                  <input
                    type="number"
                    min="0"
                    id="input-car-km"
                    value={inputs.carKm}
                    onChange={(e) => handleInputChange('carKm', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Car Fuel Type</label>
                  <select
                    id="select-fuel-type"
                    value={inputs.carFuelType}
                    onChange={(e) => handleInputChange('carFuelType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="petrol">Petrol / Gasoline (0.171 kg/km)</option>
                    <option value="diesel">Diesel (0.165 kg/km)</option>
                    <option value="hybrid">Hybrid (0.102 kg/km)</option>
                    <option value="electric">Electric EV (0.045 kg/km)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Public Transit (km)</label>
                  <input
                    type="number"
                    min="0"
                    id="input-transit-km"
                    value={inputs.publicTransportKm}
                    onChange={(e) => handleInputChange('publicTransportKm', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Motorcycle (km)</label>
                  <input
                    type="number"
                    min="0"
                    id="input-moto-km"
                    value={inputs.motorcycleKm}
                    onChange={(e) => handleInputChange('motorcycleKm', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Flights (trips/mo)</label>
                  <input
                    type="number"
                    min="0"
                    id="input-flights-count"
                    value={inputs.flightsCount}
                    onChange={(e) => handleInputChange('flightsCount', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-xs text-blue-900">
                <span className="font-bold block mb-0.5">Transportation Emissions Total:</span>
                <p>
                  Total: <strong className="text-blue-950">{emissions.transportationKg} kg CO₂e</strong>
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 5: Appliances */}
          {activeTab === 'appliances' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-base">Appliance & Device Usage Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Air Conditioner (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    id="input-ac-hours"
                    value={inputs.appliances.airConditionerHoursPerDay}
                    onChange={(e) => handleApplianceChange('airConditionerHoursPerDay', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Refrigerator Model</label>
                  <select
                    id="select-fridge-type"
                    value={inputs.appliances.refrigeratorType}
                    onChange={(e) => handleApplianceChange('refrigeratorType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="energy_star">Energy Star Certified (Efficient ~0.9 kWh/day)</option>
                    <option value="standard">Standard Modern Fridge (~1.5 kWh/day)</option>
                    <option value="old">Older Fridge (10+ yrs old) (~2.5 kWh/day)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Washing Machine (cycles/wk)</label>
                  <input
                    type="number"
                    min="0"
                    id="input-washing-cycles"
                    value={inputs.appliances.washingMachineCyclesPerWeek}
                    onChange={(e) => handleApplianceChange('washingMachineCyclesPerWeek', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">TV (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    id="input-tv-hours"
                    value={inputs.appliances.tvHoursPerDay}
                    onChange={(e) => handleApplianceChange('tvHoursPerDay', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Computer/Laptop (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    id="input-computer-hours"
                    value={inputs.appliances.computerHoursPerDay}
                    onChange={(e) => handleApplianceChange('computerHoursPerDay', Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900">
                <span className="font-bold block mb-0.5">Appliance Footprint Impact:</span>
                <p>
                  Estimated Appliance Emissions: <strong className="text-purple-950">{emissions.appliancesKg} kg CO₂e</strong>
                </p>
              </div>
            </div>
          )}

          {/* Action Button: Save to Monthly Record Log */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Saves record to Express API backend database for month {inputs.month}.
            </p>

            <button
              onClick={handleSave}
              disabled={isSaving}
              id="calc-save-record-button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <span>Saving to Database...</span>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save to Monthly Usage Log
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Calculated Results Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Calculated Output</span>
              <span className="text-[11px] text-slate-400 font-mono">ID: {inputs.month}</span>
            </div>

            {/* Total CO2 Display */}
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <span className="text-xs text-slate-400 block font-semibold">Total Estimated Footprint</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">{emissions.totalKg}</span>
                <span className="text-sm font-bold text-emerald-400">kg CO₂e</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Equal to <strong className="text-slate-200">{emissions.totalTonnes} metric tons</strong> CO₂e / month
              </p>
            </div>

            {/* Total Energy Equivalent */}
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs">
              <span className="text-slate-400 font-medium">Total Energy Equivalent:</span>
              <span className="font-bold text-amber-300 text-sm">{emissions.totalEnergyKwh.toLocaleString()} kWh</span>
            </div>

            {/* Category Percentages Breakdown Progress Bars */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Emission Contribution</h4>

              {[
                { label: 'Electricity', val: emissions.electricityKg, pct: percentages.electricity, color: 'bg-emerald-500' },
                { label: 'Natural Gas', val: emissions.gasKg, pct: percentages.gas, color: 'bg-amber-500' },
                { label: 'Water Usage', val: emissions.waterKg, pct: percentages.water, color: 'bg-sky-500' },
                { label: 'Transportation', val: emissions.transportationKg, pct: percentages.transportation, color: 'bg-blue-500' },
                { label: 'Appliances', val: emissions.appliancesKg, pct: percentages.appliances, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-slate-400 font-semibold">
                      {item.val} kg ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-300`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-800/60 text-xs text-emerald-200 space-y-1">
              <span className="font-bold text-emerald-300 block">Calculation Method Assumption:</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                Calculations multiply activity metrics (kWh, m³, L, km) by established EPA & IPCC emission factors. Values are estimates to guide household reductions.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
