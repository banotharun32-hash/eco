import React from 'react';
import { Leaf, ArrowRight, Activity, Zap, Lightbulb, Target, ShieldCheck, BarChart3, Users, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartTracking: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartTracking, onViewDemo }) => {
  const featureCards = [
    {
      icon: Activity,
      title: 'Carbon Footprint Calculator',
      description: 'Accurately convert electricity, natural gas, water, vehicle driving, and flights into standardized kg CO₂e emissions.',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-600',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
    },
    {
      icon: Zap,
      title: 'Energy & Utility Tracking',
      description: 'Monitor monthly electricity (kWh), natural gas, and water consumption trends across interactive charts.',
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
    },
    {
      icon: Lightbulb,
      title: 'Personalized Recommendations',
      description: 'Smart rule-based engine analyzes your household usage to suggest high-impact energy and cost saving actions.',
      color: 'from-sky-500/20 to-blue-500/10 text-sky-600',
      borderColor: 'border-sky-200 hover:border-sky-400',
    },
    {
      icon: Target,
      title: 'Monthly Reduction Goals',
      description: 'Set realistic reduction targets (e.g. 15% lower electricity) and track step-by-step progress towards sustainability.',
      color: 'from-green-500/20 to-emerald-500/10 text-green-600',
      borderColor: 'border-green-200 hover:border-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>EcoTrack Household Footprint Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Track Your Impact.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Reduce Your Footprint.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            EcoTrack empowers individuals and families to measure, analyze, and lower monthly electricity, gas, water,
            transportation, and appliance footprint with transparent calculation factors and personalized goals.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartTracking}
              id="hero-start-tracking-button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-base shadow-lg shadow-emerald-950/40 hover:shadow-emerald-400/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Tracking
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onViewDemo}
              id="hero-view-demo-button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-semibold text-base border border-emerald-700/60 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              View Live Demo
            </button>
          </div>

          {/* Key Stat Pills */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-emerald-800/60">
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
              <span className="block text-2xl font-bold text-emerald-300">100%</span>
              <span className="text-xs text-emerald-200/80">Transparent Calculations</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
              <span className="block text-2xl font-bold text-emerald-300">6+</span>
              <span className="text-xs text-emerald-200/80">Footprint Categories</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
              <span className="block text-2xl font-bold text-emerald-300">Real-Time</span>
              <span className="text-xs text-emerald-200/80">Interactive Dashboard</span>
            </div>
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
              <span className="block text-2xl font-bold text-emerald-300">EPA & IPCC</span>
              <span className="text-xs text-emerald-200/80">Standard Emission Factors</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Everything You Need for Sustainable Living
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Comprehensive tools to quantify utility usage, track reductions over time, and take actionable eco-friendly steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`bg-white p-6 rounded-2xl border ${feat.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feat.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Quick Preview Callout */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 border border-emerald-700/60 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2 block">
              Ready to see your carbon footprint?
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Calculate Your Household Footprint in Under 2 Minutes
            </h3>
            <p className="text-emerald-100/80 mt-3 text-sm leading-relaxed">
              No complex setup required. Enter your monthly electricity kWh, heating gas, water liters, and travel km to instantly view your emissions breakdown.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onStartTracking}
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm shadow-md transition-all hover:scale-105 text-center"
            >
              Open Calculator
            </button>
            <button
              onClick={onViewDemo}
              className="px-6 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 text-white font-medium text-sm border border-emerald-700 transition-all text-center"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">EcoTrack Sustainability SaaS</span>
          </div>
          <p>© 2026 EcoTrack Project. Built with React, Recharts, Express & EPA/IPCC Emission Factors.</p>
        </div>
      </footer>
    </div>
  );
};
