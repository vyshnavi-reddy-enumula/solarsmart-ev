import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { DemoRoleSwitcher } from './components/layout/DemoRoleSwitcher';
import { MagneticDock } from './components/layout/MagneticDock';
import { Footer } from './components/layout/Footer';
import { MethodologyDrawer } from './components/layout/MethodologyDrawer';
import { HomeView } from './views/HomeView';
import { MyEVView } from './views/MyEVView';
import { StationsView } from './views/StationsView';
import { EnergyView } from './views/EnergyView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ActiveView } from './types/navigation';
import { useRole } from './context/RoleContext';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const { setRole, isOperator } = useRole();

  // Station Management is only offered to the demo Operator role (not secure access control).
  const view: ActiveView = activeView === 'manage' && !isOperator ? 'home' : activeView;

  const handleRoleChange = (role: 'user' | 'operator') => {
    setRole(role);
    if (role === 'operator' && activeView === 'my-ev') setActiveView('manage');
    else if (role === 'user' && activeView === 'manage') setActiveView('my-ev');
  };

  const handleNavigate = (next: ActiveView) => {
    setActiveView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-geometric-grid transition-colors duration-200">
      <Header onOpenMethodology={() => setMethodologyOpen(true)} />
      <DisclaimerBanner />
      <DemoRoleSwitcher onRoleChange={handleRoleChange} />

      <main className="flex-1 app-container page-content-padding">
        {view === 'home' && <HomeView onNavigate={handleNavigate} onOpenMethodology={() => setMethodologyOpen(true)} />}
        {view === 'my-ev' && <MyEVView />}
        {view === 'stations' && <StationsView />}
        {view === 'energy' && <EnergyView />}
        {view === 'manage' && <AdminDashboardView />}
      </main>

      <MagneticDock activeView={view} onNavigate={handleNavigate} />
      <Footer activeView={view} onNavigate={handleNavigate} onOpenMethodology={() => setMethodologyOpen(true)} />
      <MethodologyDrawer open={methodologyOpen} onClose={() => setMethodologyOpen(false)} />
    </div>
  );
};
