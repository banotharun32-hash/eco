import React, { useState, useMemo } from 'react';
import {
  Zap,
  Activity,
  Flame,
  Droplets,
  Car,
  Target,
  TrendingDown,
  TrendingUp,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { UsageRecord, Goal } from '../types';
import { formatCo2, BENCHMARKS } from '../utils/emissionFactors';

interface DashboardProps {
  records: UsageRecord[];
  goals: Goal[];
  onOpenCalculator: () => void;
  onOpenGoals: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ records, goals, onOpenCalculator, onOpenGoals }) => {
  const [timeframe, setTimeframe] = useState<'this_month' | '3_months' | '6_months' | '12_months'>('6_months');

  // Filter records based on selected timeframe
  const filteredRecords = useMemo(() => {
    if (!records || records.length === 0) return [];
    const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));

    if (timeframe === 'this_month') return sorted.slice(-1);
    if (timeframe === '3_months') return sorted.slice(-3);
    if (timeframe === '6_months') return sorted.slice(-6);
    return sorted.slice(-12);
  }, [records, timeframe]);

  // Latest record metrics
  const latestRecord = filteredRecords[filteredRecords.length - 1];
  const previousRecord = filteredRecords.length > 1 ? filteredRecords[filteredRecords.length - 2] : null;

  // Percentage change calculation helper
  const getDiff = (current: number = 0, prev: number = 0) => {
    if (!prev || prev === 0) return 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  // Active primary goal
  const primaryGoal = goals.find((g) => g.status === 'active') || goals[0];

  // Chart 1: Energy Trend Line Data
  const energyTrendData = useMemo(() => {
    return filteredRecords.map((r) => ({
      month: r.month,
      electricityKwh: r.electricityKwh,
      gasM3: r.gasM3,
      totalEnergyKwh: r.emissions.totalEnergyKwh,
      totalCarbonKg: r.emissions.totalKg,
    }));
  }, [filteredRecords]);

  // Chart 2: Category Breakdown Pie Data
  const categoryPieData = useMemo(() => {
    if (!latestRecord) return [];
    return [
      { name: 'Electricity', value: latestRecord.emissions.electricityKg, color: '#10b981' },
      { name: 'Gas', value: latestRecord.emissions.gasKg, color: '#f59e0b' },
      { name: 'Water', value: latestRecord.emissions.waterKg, color: '#06b6d4' },
      { name: 'Transportation', value: latestRecord.emissions.transportationKg, color: '#3b82f6' },
      { name: 'Appliances', value: latestRecord.emissions.appliancesKg, color: '#8b5cf6' },
    ].filter((item) => item.value > 0);
  }, [latestRecord]);

  // Chart 3: Electricity & Gas Bar Chart
  const utilityBarData = useMemo(() => {
    return filteredRecords.map((r) => ({
      month: r.month,
      Electricity: r.electricityKwh,
      Gas: r.gasM3,
    }));
  }, [filteredRecords]);

  // Chart 4: Transportation Emissions Breakdown
  const transportData = useMemo(() => {
    return filteredRecords.map((r) => {
      const carEm = r.carKm * 0.171;
      const transitEm = r.publicTransportKm * 0.038;
      const motoEm = r.motorcycleKm * 0.095;
      const flightEm = r.flightsCount * 220;
      return {
        month: r.month,
        Car: Math.round(carEm),
        Transit: Math.round(transitEm),
        Motorcycle: Math.round(motoEm),
        Flights: Math.round(flightEm),
      };
    });
  }, [filteredRecords]);

  // Goal Progress Percentage
  const goalProgressPct = useMemo(() => {
    if (!primaryGoal) return 0;
    const { startingValue, targetValue, currentValue } = primaryGoal;
    if (startingValue === targetValue) return 100;
    const totalReductionNeeded = Math.abs(startingValue - targetValue);
    const reductionAchieved = Math.abs(startingValue - currentValue);
    const pct = Math.min(100, Math.max(0, Math.round((reductionAchieved / totalReductionNeeded) * 100)));
    return pct;
  }, [primaryGoal]);

  const radialGoalData = [
    {
      name: primaryGoal?.title || 'Goal Progress',
      value: goalProgressPct,
      fill: '#10b981',
    },
  ];

  if (!records || records.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No Monthly Usage Data Yet</h3>
          <p className="text-slate-600 mt-2 text-sm">
            Enter your household electricity, gas, and travel records to view live interactive carbon footprint charts.
          </p>
          <button
            onClick={onOpenCalculator}
            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto"
          >
            <PlusCircle className="w-5 h-5" />
            Add First Usage Record
          </button>
        </div>
      </div>
    );
  }

  const carbonDiff = previousRecord ? getDiff(latestRecord.emissions.totalKg, previousRecord.emissions.totalKg) : 0;
  const energyDiff = previousRecord ? getDiff(latestRecord.emissions.totalEnergyKwh, previousRecord.emissions.totalEnergyKwh) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Interactive Sustainability Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Household Footprint Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Showing usage data for <span className="font-semibold text-slate-700">{latestRecord?.month || 'Current Month'}</span>
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          {[
            { id: 'this_month', label: 'This Month' },
            { id: '3_months', label: 'Last 3 Mo' },
            { id: '6_months', label: 'Last 6 Mo' },
            { id: '12_months', label: 'Last 12 Mo' },
          ].map((tf) => (
            <button
              key={tf.id}
              id={`timeframe-${tf.id}`}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-white text-emerald-950 shadow-sm font-bold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Carbon Footprint */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Carbon Footprint</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCo2(latestRecord.emissions.totalKg)}
            </span>
            <span className="block text-xs text-slate-500 mt-1">
              ({latestRecord.emissions.totalTonnes} tonnes CO₂e)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">vs prev month:</span>
            <span className={`font-semibold flex items-center gap-1 ${carbonDiff <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {carbonDiff <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {Math.abs(carbonDiff)}%
            </span>
          </div>
        </div>

        {/* Card 2: Total Energy Usage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Energy Usage</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {latestRecord.emissions.totalEnergyKwh.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-500 ml-1">kWh eq.</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">vs prev month:</span>
            <span className={`font-semibold flex items-center gap-1 ${energyDiff <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {energyDiff <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {Math.abs(energyDiff)}%
            </span>
          </div>
        </div>

        {/* Card 3: Electricity & Gas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Direct Utilities</span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Electricity:</span>
              <span className="text-lg font-bold text-slate-900">{latestRecord.electricityKwh} kWh</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">Gas:</span>
              <span className="text-lg font-bold text-slate-900">{latestRecord.gasM3} m³</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Water:</span>
            <span className="font-semibold text-slate-700">{latestRecord.waterLiters.toLocaleString()} L</span>
          </div>
        </div>

        {/* Card 4: Primary Goal Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Monthly Goal</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          {primaryGoal ? (
            <div className="mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-slate-900">{goalProgressPct}%</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {primaryGoal.status === 'completed' ? 'Achieved' : 'In Progress'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 truncate font-medium">{primaryGoal.title}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalProgressPct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <button
                onClick={onOpenGoals}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                + Set a reduction goal
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Monthly Footprint & Energy Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Carbon & Energy Consumption Trend</h3>
              <p className="text-xs text-slate-500">Historical monthly carbon footprint (kg CO₂e) and total energy</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="totalCarbonKg"
                  name="Carbon Footprint (kg CO₂e)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="electricityKwh"
                  name="Electricity (kWh)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown Pie/Doughnut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Emissions by Category</h3>
            <p className="text-xs text-slate-500 mb-2">Proportion of latest month emissions</p>
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} kg CO₂e`, 'Emissions']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900">{latestRecord.emissions.totalKg}</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">kg CO₂e</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {categoryPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-semibold text-slate-900 ml-auto">{item.value} kg</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Bar & Transportation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Electricity vs Gas Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Electricity & Natural Gas Usage</h3>
          <p className="text-xs text-slate-500 mb-4">Direct monthly utility inputs comparison</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilityBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Electricity" name="Electricity (kWh)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Gas" name="Gas (m³)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Transportation Emissions Stacked Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Transportation Emissions Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Travel CO₂e (kg) by driving, transit, motorcycle, and flights</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transportData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Car" name="Car Driving" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Transit" name="Public Transit" stackId="a" fill="#06b6d4" />
                <Bar dataKey="Motorcycle" name="Motorcycle" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="Flights" name="Flights" stackId="a" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-900 text-white p-6 rounded-2xl shadow-md border border-emerald-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Keep up the sustainable progress!</h4>
            <p className="text-emerald-200/80 text-xs mt-0.5">
              Your latest footprint ({latestRecord.emissions.totalKg} kg) is {latestRecord.emissions.totalKg < BENCHMARKS.averageHouseholdMonthlyKg ? 'below' : 'above'} the US household average ({BENCHMARKS.averageHouseholdMonthlyKg} kg/mo).
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenCalculator}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs shadow transition-all shrink-0 w-full sm:w-auto text-center"
          >
            Enter New Month Data
          </button>
          <button
            onClick={onOpenGoals}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-600 transition-all shrink-0 w-full sm:w-auto text-center"
          >
            Manage Goals
          </button>
        </div>
      </div>

    </div>
  );
};
