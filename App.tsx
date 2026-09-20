import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { UsageLog } from './components/UsageLog';
import { Goals } from './components/Goals';
import { Recommendations } from './components/Recommendations';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { AboutModal } from './components/AboutModal';
import { Toast, ToastMessage } from './components/Toast';
import { api } from './services/api';
import { User, UsageRecord, Goal, Recommendation, HouseholdInputs } from './types';
import {
  INITIAL_DEMO_USER,
  INITIAL_DEMO_RECORDS,
  INITIAL_DEMO_GOALS,
  generateRecommendations,
} from './data/demoData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_DEMO_USER);
  const [records, setRecords] = useState<UsageRecord[]>(INITIAL_DEMO_RECORDS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_DEMO_GOALS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    generateRecommendations(INITIAL_DEMO_RECORDS)
  );

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);

  // Initial load from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [recordsRes, goalsRes, recsRes] = await Promise.all([
          api.getRecords().catch(() => ({ records: INITIAL_DEMO_RECORDS })),
          api.getGoals().catch(() => ({ goals: INITIAL_DEMO_GOALS })),
          api.getRecommendations().catch(() => ({
            recommendations: generateRecommendations(INITIAL_DEMO_RECORDS),
          })),
        ]);

        if (recordsRes.records?.length > 0) setRecords(recordsRes.records);
        if (goalsRes.goals?.length > 0) setGoals(goalsRes.goals);
        if (recsRes.recommendations?.length > 0) setRecommendations(recsRes.recommendations);
      } catch (err) {
        console.warn('Backend API warming up, initialized with demo data:', err);
      }
    }
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({
      id: `toast_${Date.now()}`,
      type,
      title,
      message,
    });
  };

  // Auth Handlers
  const handleLogin = async (email: string) => {
    try {
      const { user } = await api.login(email);
      setCurrentUser(user);
      showToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
    } catch (err) {
      showToast('error', 'Login Failed', 'Please check credentials and retry.');
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    householdSize: number;
    location: string;
  }) => {
    try {
      const { user } = await api.register(data);
      setCurrentUser(user);
      showToast('success', 'Account Created!', `Welcome to EcoTrack, ${user.name}`);
    } catch (err) {
      showToast('error', 'Registration Failed', 'Please try again.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setCurrentUser(INITIAL_DEMO_USER);
    setRecords(INITIAL_DEMO_RECORDS);
    setGoals(INITIAL_DEMO_GOALS);
    setRecommendations(generateRecommendations(INITIAL_DEMO_RECORDS));
    setActiveTab('dashboard');
    showToast('success', 'Demo User Active', 'Loaded Sarah Jenkins with 6 months of historical data.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showToast('info', 'Signed Out', 'You have been signed out successfully.');
  };

  // Usage Record CRUD Handlers
  const handleSaveRecord = async (input: HouseholdInputs) => {
    try {
      const { record } = await api.createRecord(input);
      setRecords((prev) => {
        const idx = prev.findIndex((r) => r.month === input.month);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = record;
          return updated;
        }
        return [...prev, record].sort((a, b) => a.month.localeCompare(b.month));
      });

      // Refresh recommendations
      const newRecs = generateRecommendations([...records, record]);
      setRecommendations(newRecs);

      showToast('success', 'Record Saved!', `Monthly record for ${input.month} updated.`);
    } catch (err) {
      showToast('error', 'Failed to save record', 'Please try again.');
    }
  };

  const handleUpdateRecord = async (id: string, input: Partial<HouseholdInputs>) => {
    try {
      const { record } = await api.updateRecord(id, input);
      setRecords((prev) => prev.map((r) => (r.id === id ? record : r)));
      showToast('success', 'Record Updated', `Usage log entry for ${record.month} saved.`);
    } catch (err) {
      showToast('error', 'Update Failed', 'Could not update usage record.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast('info', 'Record Deleted', 'The monthly usage entry was removed.');
    } catch (err) {
      showToast('error', 'Delete Failed', 'Could not remove record.');
    }
  };

  // Goal CRUD Handlers
  const handleCreateGoal = async (goal: Partial<Goal>) => {
    try {
      const { goal: newGoal } = await api.createGoal(goal);
      setGoals((prev) => [...prev, newGoal]);
      showToast('success', 'Goal Created', `New goal "${newGoal.title}" added.`);
    } catch (err) {
      showToast('error', 'Failed to create goal');
    }
  };

  const handleUpdateGoal = async (id: string, goalData: Partial<Goal>) => {
    try {
      const { goal: updatedGoal } = await api.updateGoal(id, goalData);
      setGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));
      showToast('success', 'Goal Updated', 'Goal details saved.');
    } catch (err) {
      showToast('error', 'Update Failed');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      showToast('info', 'Goal Deleted');
    } catch (err) {
      showToast('error', 'Delete Failed');
    }
  };

  // Profile Update
  const handleUpdateProfile = async (profileData: Partial<User>) => {
    try {
      const { profile } = await api.updateProfile(profileData);
      setCurrentUser(profile);
      showToast('success', 'Profile Updated', 'Your household details have been saved.');
    } catch (err) {
      showToast('error', 'Profile Update Failed');
    }
  };

  // Add goal from recommendation card
  const handleAddGoalFromRecommendation = async (rec: Recommendation) => {
    const newGoalData: Partial<Goal> = {
      title: rec.title,
      type: rec.category === 'Electricity' ? 'electricity' : 'carbon',
      targetPercentage: 15,
      startingValue: 400,
      targetValue: 340,
      currentValue: 400,
      unit: rec.category === 'Electricity' ? 'kWh' : 'kg CO₂e',
      deadline: '2026-09-30',
      status: 'active',
    };

    await handleCreateGoal(newGoalData);
    setActiveTab('goals');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-emerald-200">
      
      {/* Primary Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAbout={() => setAboutModalOpen(true)}
      />

      {/* View Switcher Container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onStartTracking={() => setActiveTab('calculator')}
            onViewDemo={handleQuickDemoLogin}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            records={records}
            goals={goals}
            onOpenCalculator={() => setActiveTab('calculator')}
            onOpenGoals={() => setActiveTab('goals')}
          />
        )}

        {activeTab === 'calculator' && (
          <Calculator
            onSaveRecord={handleSaveRecord}
            onOpenAbout={() => setAboutModalOpen(true)}
          />
        )}

        {activeTab === 'usage-log' && (
          <UsageLog
            records={records}
            onAddRecord={handleSaveRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activeTab === 'goals' && (
          <Goals
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'recommendations' && (
          <Recommendations
            recommendations={recommendations}
            onAddGoalFromRecommendation={handleAddGoalFromRecommendation}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            currentUser={currentUser}
            records={records}
            goals={goals}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Global Toast Manager */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onQuickDemoLogin={handleQuickDemoLogin}
      />

      {/* Methodology Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

    </div>
  );
}
