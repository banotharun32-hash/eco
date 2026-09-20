import React from 'react';
import { X, Info, Zap, Flame, Droplets, Car, ShieldCheck } from 'lucide-react';
import { DEFAULT_EMISSION_FACTORS } from '../utils/emissionFactors';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Calculation Methodology & Emission Factors</h3>
            <p className="text-xs text-slate-500">EPA & IPCC Standard Assumptions for EcoTrack</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            EcoTrack estimates greenhouse gas emissions expressed in <strong>kilograms of carbon dioxide equivalent (kg CO₂e)</strong> and total <strong>energy consumption equivalent (kWh)</strong>.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Assumed Emission Factors:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Electricity Grid Average</span>
                <span className="text-emerald-700 font-extrabold">{DEFAULT_EMISSION_FACTORS.electricityKgPerKwh} kg CO₂e / kWh</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Natural Gas</span>
                <span className="text-amber-700 font-extrabold">{DEFAULT_EMISSION_FACTORS.gasKgPerM3} kg CO₂e / m³</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Tap Water Supply</span>
                <span className="text-sky-700 font-extrabold">{DEFAULT_EMISSION_FACTORS.waterKgPerLiter} kg CO₂e / Liter</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Petrol Automobile</span>
                <span className="text-blue-700 font-extrabold">{DEFAULT_EMISSION_FACTORS.carKgPerKm.petrol} kg CO₂e / km</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 space-y-1">
            <span className="font-bold block text-sm">Transparency Disclaimer</span>
            <p className="text-[11px] leading-relaxed">
              All calculations are clearly labeled as estimates. Actual emissions may vary depending on local grid power mix, exact vehicle efficiency, and climate conditions.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
