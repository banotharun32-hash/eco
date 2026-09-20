import React, { useState } from 'react';
import { Lightbulb, DollarSign, Leaf, Zap, Car, Droplets, Tv, Home, CheckCircle2, ArrowUpRight, Sparkles, PlusCircle } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
  onAddGoalFromRecommendation: (rec: Recommendation) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  onAddGoalFromRecommendation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [implementedIds, setImplementedIds] = useState<string[]>([]);

  const categories = ['All', 'Electricity', 'Transportation', 'Water', 'Appliances', 'Lifestyle'];

  const filteredRecs = recommendations.filter((rec) => {
    if (selectedCategory !== 'All' && rec.category !== selectedCategory) return false;
    return true;
  });

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case 'Electricity':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Transportation':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'Water':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'Appliances':
        return <Tv className="w-5 h-5 text-purple-500" />;
      default:
        return <Home className="w-5 h-5 text-emerald-500" />;
    }
  };

  const difficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  const toggleImplemented = (id: string) => {
    setImplementedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI & Rule-Based Eco Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Personalized Recommendations</h1>
          <p className="text-emerald-100/80 text-sm mt-2 leading-relaxed">
            Tailored household tips calculated from your electricity, gas, water, and travel patterns to maximize carbon reduction and lower utility bills.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`rec-filter-${cat.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec) => {
          const isImplemented = implementedIds.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`bg-white p-6 rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                isImplemented ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200">
                      {categoryIcon(rec.category)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {rec.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{rec.title}</h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${difficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">{rec.explanation}</p>

                {/* Actionable Step Box */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 font-medium mb-5">
                  <strong className="text-slate-900 block font-bold mb-0.5">Actionable Step:</strong>
                  {rec.actionableStep}
                </div>

                {/* Savings Badges */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
                    <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">CO₂ Savings</span>
                      <span className="text-sm font-extrabold text-emerald-950">~{rec.potentialCo2SavingsKg} kg/mo</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">Bill Savings</span>
                      <span className="text-sm font-extrabold text-amber-950">~${rec.potentialCostSavingsUsd}/mo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleImplemented(rec.id)}
                  id={`toggle-implemented-${rec.id}`}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isImplemented
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isImplemented ? 'Marked as Done' : 'Mark Implemented'}
                </button>

                <button
                  onClick={() => onAddGoalFromRecommendation(rec)}
                  id={`add-goal-from-rec-${rec.id}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-colors"
                  title="Turn into a reduction goal"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  <span>Set Goal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
