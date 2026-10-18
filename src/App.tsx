import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { DemoRoleSwitcher } from './components/layout/DemoRoleSwitcher';
import { MagneticDock } from './components/layout/MagneticDock';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView } from './views/AboutView';
import { ActiveView } from './types/navigation';
import { useRole } from './context/RoleContext';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const { setRole } = useRole();

  const handleRoleChange = (role: 'user' | 'operator') => {
    setRole(role);
    // When switching role explicitly, optionally suggest or navigate to the relevant view if on a dashboard
    if (role === 'operator' && activeView === 'user') {
      setActiveView('admin');
    } else if (role === 'user' && activeView === 'admin') {
      setActiveView('user');
    }
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    // Smoothly scroll to top of viewport on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-geometric-grid transition-colors duration-200">
      {/* Top Application Header */}
      <Header />

      {/* Academic Scope Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Client-Side Demo Role Switcher */}
      <DemoRoleSwitcher onRoleChange={handleRoleChange} />

      {/* Main Content Area with Strict Bottom Clearance */}
      <main className="flex-1 app-container page-content-padding">
        {activeView === 'home' && <HomeView onNavigate={handleNavigate} />}
        {activeView === 'user' && <UserDashboardView />}
        {activeView === 'admin' && <AdminDashboardView />}
        {activeView === 'about' && <AboutView />}
      </main>

      {/* Responsive Floating Magnetic Navigation Dock */}
      <MagneticDock activeView={activeView} onNavigate={handleNavigate} />

      {/* Application Footer */}
      <Footer activeView={activeView} onNavigate={handleNavigate} />
    </div>
  );
};
