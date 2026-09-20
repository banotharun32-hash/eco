import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => Promise<void>;
  onRegister: (data: { name: string; email: string; householdSize: number; location: string }) => Promise<void>;
  onQuickDemoLogin: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onQuickDemoLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [householdSize, setHouseholdSize] = useState(3);
  const [location, setLocation] = useState('Seattle, WA');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await onLogin(email || 'sarah.jenkins@ecotrack.org');
      } else {
        await onRegister({
          name: name || 'New User',
          email,
          householdSize: Number(householdSize) || 2,
          location: location || 'City, Country',
        });
      }
      onClose();
    } catch (err) {
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setIsLoading(true);
    try {
      await onQuickDemoLogin();
      onClose();
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quick Demo Banner */}
        <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Mode</span>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Want to see EcoTrack with pre-filled 6-month historical usage records?
          </p>
          <button
            onClick={handleDemoClick}
            disabled={isLoading}
            id="auth-quick-demo-button"
            className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-xl shadow transition-all mt-1"
          >
            Log In as Sarah Jenkins (Demo User)
          </button>
        </div>

        <div className="flex items-center justify-center border-b border-slate-100 pb-3 gap-6">
          <button
            onClick={() => setMode('login')}
            className={`pb-2 text-sm font-bold transition-all ${
              mode === 'login'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`pb-2 text-sm font-bold transition-all ${
              mode === 'signup'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                required
                id="auth-name-input"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              required
              id="auth-email-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              id="auth-password-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Household Size
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  id="auth-household-size"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Number(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Location
                </label>
                <input
                  type="text"
                  required
                  id="auth-location-input"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            id="auth-submit-button"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all mt-2"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
