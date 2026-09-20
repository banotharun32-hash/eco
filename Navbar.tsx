import React, { useState } from 'react';
import { Leaf, LayoutDashboard, Calculator, History, Target, Lightbulb, User as UserIcon, LogIn, LogOut, Menu, X, Info } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'usage-log', label: 'Usage Log', icon: History },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/90 backdrop-blur-md text-white border-b border-emerald-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            id="nav-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                Eco<span className="text-emerald-400">Track</span>
              </span>
              <span className="block text-[10px] text-emerald-200/80 -mt-1 font-medium tracking-wide">
                Household Carbon & Energy
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-800/80 text-white shadow-inner border border-emerald-700/50'
                      : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-emerald-300/70'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAbout}
              id="nav-about-button"
              className="p-2 text-emerald-200/80 hover:text-white hover:bg-emerald-900/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Methodology & Emission Factors"
            >
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Methodology</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-emerald-800/80 pl-3">
                <button
                  onClick={() => handleNavClick('profile')}
                  id="nav-profile-button"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-emerald-800 text-white border-emerald-500'
                      : 'bg-emerald-900/70 text-emerald-100 border-emerald-800 hover:border-emerald-700'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-emerald-950 font-bold flex items-center justify-center text-[11px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>

                <button
                  onClick={onLogout}
                  id="nav-logout-button"
                  className="p-2 text-emerald-300/80 hover:text-rose-300 hover:bg-emerald-900/80 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                id="nav-login-button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold text-xs shadow-md shadow-emerald-950/30 transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Demo
              </button>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle"
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'text-emerald-100/80 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-emerald-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-emerald-200/90 hover:bg-emerald-900"
            >
              <Info className="w-5 h-5 text-emerald-400" />
              Methodology & Emission Factors
            </button>

            {currentUser ? (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-900 text-emerald-100"
                >
                  <UserIcon className="w-5 h-5 text-emerald-400" />
                  Profile ({currentUser.name})
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-950/40"
                >
                  <LogOut className="w-5 h-5 text-rose-400" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-emerald-950 font-bold text-sm"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Demo Mode
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
