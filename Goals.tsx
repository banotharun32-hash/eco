import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingDown,
  Award,
  X,
  Edit2,
  Trophy,
} from 'lucide-react';
import { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  onCreateGoal: (goal: Partial<Goal>) => Promise<void>;
  onUpdateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
}

export const Goals: React.FC<GoalsProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New goal form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'electricity' | 'transportation' | 'carbon' | 'water'>('electricity');
  const [targetPercentage, setTargetPercentage] = useState(15);
  const [startingValue, setStartingValue] = useState(400);
  const [unit, setUnit] = useState('kWh');
  const [deadline, setDeadline] = useState('2026-09-30');

  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setType('electricity');
    setTargetPercentage(15);
    setStartingValue(400);
    setUnit('kWh');
    setDeadline('2026-09-30');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setType(goal.type);
    setTargetPercentage(goal.targetPercentage);
    setStartingValue(goal.startingValue);
    setUnit(goal.unit);
    setDeadline(goal.deadline);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const computedTargetValue = Math.round(startingValue * (1 - targetPercentage / 100));

      if (editingGoal) {
        await onUpdateGoal(editingGoal.id, {
          title,
          type,
          targetPercentage,
          startingValue,
          targetValue: computedTargetValue,
          unit,
          deadline,
        });
      } else {
        await onCreateGoal({
          title,
          type,
          targetPercentage,
          startingValue,
          targetValue: computedTargetValue,
          currentValue: startingValue,
          unit,
          deadline,
          status: 'active',
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to submit goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProgress = (goal: Goal) => {
    const { startingValue, targetValue, currentValue } = goal;
    if (startingValue === targetValue) return 100;
    const totalReductionNeeded = Math.abs(startingValue - targetValue);
    const reductionAchieved = Math.abs(startingValue - currentValue);
    const pct = Math.min(100, Math.max(0, Math.round((reductionAchieved / totalReductionNeeded) * 100)));
    return pct;
  };

  const toggleComplete = async (goal: Goal) => {
    const newStatus = goal.status === 'completed' ? 'active' : 'completed';
    await onUpdateGoal(goal.id, { status: newStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>Sustainability Goals Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Monthly Reduction Goals
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Set target percentages and track step-by-step progress towards carbon neutrality.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          id="create-goal-button"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Goal
        </button>
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const pct = calculateProgress(goal);
          const isDone = goal.status === 'completed';

          return (
            <div
              key={goal.id}
              className={`bg-white p-6 rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                isDone ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isDone ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        {goal.type} Goal
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{goal.title}</h3>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isDone ? 'Completed' : 'Active'}
                  </span>
                </div>

                {/* Encouragement banner */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium mb-5">
                  {pct >= 100 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      Goal Accomplished! Outstanding commitment to sustainability!
                    </span>
                  ) : (
                    <span className="text-slate-800 font-medium">
                      Great progress! You are <strong className="text-emerald-700 font-bold">{pct}%</strong> toward your target reduction goal.
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-slate-500 font-semibold">
                      Current: {goal.currentValue} {goal.unit}
                    </span>
                    <span className="text-slate-900 font-bold">
                      Target: {goal.targetValue} {goal.unit} ({goal.targetPercentage}% cut)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Deadline metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Target Deadline: <strong className="text-slate-700">{goal.deadline}</strong></span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => toggleComplete(goal)}
                  id={`toggle-goal-complete-${goal.id}`}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isDone ? 'Mark as Active' : 'Mark Completed'}
                </button>

                <button
                  onClick={() => handleOpenEditModal(goal)}
                  id={`edit-goal-${goal.id}`}
                  className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                  title="Edit Goal"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  id={`delete-goal-${goal.id}`}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingGoal ? 'Edit Reduction Goal' : 'Create New Reduction Goal'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Goal Title</label>
                <input
                  type="text"
                  required
                  id="goal-title-input"
                  placeholder="e.g. Reduce Electricity Usage by 15%"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Category Type</label>
                  <select
                    id="goal-type-select"
                    value={type}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setType(t);
                      if (t === 'electricity') setUnit('kWh');
                      else if (t === 'water') setUnit('Liters');
                      else setUnit('kg CO₂e');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="electricity">Electricity (kWh)</option>
                    <option value="carbon">Total Carbon (kg CO₂e)</option>
                    <option value="transportation">Transportation (kg CO₂e)</option>
                    <option value="water">Water Usage (Liters)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Target Reduction %</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    id="goal-target-pct-input"
                    value={targetPercentage}
                    onChange={(e) => setTargetPercentage(Number(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Starting Value ({unit})</label>
                  <input
                    type="number"
                    min="1"
                    required
                    id="goal-starting-value-input"
                    value={startingValue}
                    onChange={(e) => setStartingValue(Number(e.target.value) || 100)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Target Deadline</label>
                  <input
                    type="date"
                    required
                    id="goal-deadline-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                Calculated Target Value: <strong>{Math.round(startingValue * (1 - targetPercentage / 100))} {unit}</strong>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="goal-submit-button"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  {isSubmitting ? 'Saving...' : editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
