import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import DashboardPetani from './views/DashboardPetani';
import DashboardDistributor from './views/DashboardDistributor';
import DashboardPembeli from './views/DashboardPembeli';
import DashboardAdmin from './views/DashboardAdmin';
import Sidebar from './components/Sidebar';

function AppContent() {
  const { currentUser, logout } = useContext(AppContext);
  const [page, setPage] = useState('landing'); // 'landing', 'login', 'dashboard'
  const [activeTab, setActiveTab] = useState('');

  const handleLoginSuccess = (user) => {
    setPage('dashboard');
    // Set default tab based on user role
    if (user.role === 'petani') {
      setActiveTab('dashboard');
    } else if (user.role === 'distributor') {
      setActiveTab('dashboard_stok');
    } else if (user.role === 'pembeli') {
      setActiveTab('beranda');
    } else if (user.role === 'admin') {
      setActiveTab('control_center');
    }
  };

  const handleLogout = () => {
    logout();
    setPage('landing');
  };

  // Fallback to login if currentUser is missing on dashboard page
  if (page === 'dashboard' && !currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToLanding={() => setPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      {page === 'landing' && (
        <LandingPage
          onEnterSystem={() => setPage('login')}
          onNavigateToTrace={() => {
            // Direct link to tracking/traceability simulation
            setPage('login');
          }}
        />
      )}

      {page === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setPage('landing')}
        />
      )}

      {page === 'dashboard' && currentUser && (
        <div className="flex w-full min-h-screen overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            role={currentUser.role}
            userName={currentUser.nama}
            onLogout={handleLogout}
          />

          {/* Main Workspace */}
          <main className="flex-1 bg-slate-50 overflow-y-auto h-screen flex flex-col">
            {/* Top Workspace Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-500 text-xs font-semibold">RiceChain Jaringan Ledger Distribusi Beras</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600">
                  <span className="text-[10px]">🔒 SMART CONTRACT ESCROW ACTIVE</span>
                </div>
                <span>Role: <strong className="text-emerald-700 uppercase font-bold">{currentUser.role}</strong></span>
              </div>
            </header>

            {/* Role Dashboards router */}
            <div className="flex-1">
              {currentUser.role === 'petani' && (
                <DashboardPetani activeTab={activeTab} />
              )}

              {currentUser.role === 'distributor' && (
                <DashboardDistributor activeTab={activeTab} />
              )}

              {currentUser.role === 'pembeli' && (
                <DashboardPembeli activeTab={activeTab} setActiveTab={setActiveTab} />
              )}

              {currentUser.role === 'admin' && (
                <DashboardAdmin activeTab={activeTab} />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
