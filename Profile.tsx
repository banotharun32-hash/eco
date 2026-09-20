import React, { useState } from 'react';
import { User as UserIcon, Mail, Home, MapPin, Award, ShieldCheck, CheckCircle2, Save, Sparkles, Trophy } from 'lucide-react';
import { User, UsageRecord, Goal } from '../types';

interface ProfileProps {
  currentUser: User | null;
  records: UsageRecord[];
  goals: Goal[];
  onUpdateProfile: (data: Partial<User>) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({
  currentUser,
  records,
  goals,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.jenkins@ecotrack.org');
  const [householdSize, setHouseholdSize] = useState(currentUser?.householdSize || 3);
  const [location, setLocation] = useState(currentUser?.location || 'Seattle, WA, USA');
  const [isSaving, setIsSaving] = useState(false);

  // Statistics calculation
  const totalRecords = records.length;
  const avgFootprintKg = totalRecords > 0
    ? Math.round(records.reduce((acc, r) => acc + r.emissions.totalKg, 0) / totalRecords)
    : 0;

  const totalEnergyKwh = records.reduce((acc, r) => acc + r.emissions.totalEnergyKwh, 0);
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name,
        email,
        householdSize: Number(householdSize) || 1,
        location,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 font-extrabold text-2xl flex items-center justify-center shadow-md">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-300 text-[11px] font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {currentUser?.ecoLevel || 'Eco Champion'}
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentUser?.name}</h1>
            <p className="text-emerald-200/80 text-xs mt-0.5">{currentUser?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          id="profile-toggle-edit-button"
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs border border-emerald-700 transition-colors shrink-0"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Stats Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Monthly Average Footprint
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{avgFootprintKg} kg</span>
          <span className="block text-xs text-emerald-600 font-semibold mt-1">CO₂e / Month</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Logged Energy
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{Math.round(totalEnergyKwh).toLocaleString()}</span>
          <span className="block text-xs text-amber-600 font-semibold mt-1">kWh Equivalent</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Completed Goals
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{completedGoalsCount}</span>
          <span className="block text-xs text-purple-600 font-semibold mt-1">Sustainability Milestones</span>
        </div>
      </div>

      {/* Main Profile Info / Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          Household & Profile Details
        </h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                required
                id="profile-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                required
                id="profile-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Household Size</label>
                <input
                  type="number"
                  min="1"
                  required
                  id="profile-household-size-input"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Number(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Location (City, Country)</label>
                <input
                  type="text"
                  required
                  id="profile-location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                id="profile-save-button"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <UserIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Name</span>
                <span className="text-sm font-bold text-slate-900">{currentUser?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
                <span className="text-sm font-bold text-slate-900">{currentUser?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Home className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Household Size</span>
                <span className="text-sm font-bold text-slate-900">{currentUser?.householdSize} Members</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                <span className="text-sm font-bold text-slate-900">{currentUser?.location}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
