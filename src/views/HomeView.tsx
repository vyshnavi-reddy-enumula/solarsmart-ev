import React from 'react';
import { ArrowRight, MapPin, Car, SunMedium, Radio, Cpu, Layers, CheckCircle } from 'lucide-react';
import { ActiveView } from '../types/navigation';
import { useStationData } from '../context/StationDataContext';
import { HeroGeometricVisual } from '../components/common/HeroGeometricVisual';
import { WaveDivider } from '../components/common/WaveDivider';

interface HomeViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { state } = useStationData();

  return (
    <div className="space-y-16">
      {/* Hero Section — Componentry Hero Geometric Composition */}
      <section className="relative pt-4 sm:pt-8">
        <div className="hero-geometric-grid">
          {/* Left Column: Hero Narrative & Actions */}
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[var(--primitive-green)]/10 text-[var(--color-secondary)] border border-[var(--primitive-green)]/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--primitive-green)] animate-pulse" />
              <span>{state.stationName} · {state.dataSourceMode === 'demo' ? 'Simulated demo data' : 'Awaiting live data'}</span>
            </div>

            <h1 className="h1-fluid text-[var(--color-text)]">
              Intelligent Solar EV Charging,{' '}
              <span className="brand-gradient-text">Architected with Integrity</span>
            </h1>

            <p className="prose-lead prose-readable">
              SolarSmart EV upgrades a small-scale solar-powered wireless EV charging demonstration with RFID-based user identification, embedded hardware monitoring, and a responsive web application designed through the Design Thinking framework.
            </p>

            {/* Action Pathways */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('my-ev')}
                className="btn-primary"
              >
                <Car className="w-4 h-4" />
                <span>Open My EV</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => onNavigate('stations')}
                className="btn-secondary"
              >
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Find Stations</span>
              </button>
            </div>

            {/* Architectural Tags */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--color-text-muted)]">
              <span className="flex items-center space-x-1.5">
                <SunMedium className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Solar-Powered Base</span>
              </span>
              <span className="text-[var(--color-border)]">•</span>
              <span className="flex items-center space-x-1.5">
                <Radio className="w-4 h-4 text-[var(--color-secondary)]" />
                <span>Wireless Induction Coils</span>
              </span>
              <span className="text-[var(--color-border)]">•</span>
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-[var(--primitive-lime-accessible)] dark:text-[var(--primitive-lime)]" />
                <span>Arduino UNO & ESP32</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Geometric Faceted Visual */}
          <div className="w-full">
            <HeroGeometricVisual />
          </div>
        </div>
      </section>

      {/* Wave Transition Divider */}
      <WaveDivider className="text-[var(--color-border)]" />

      {/* Varied Asymmetrical Feature Pillar Section */}
      <section className="page-section space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-2">
            System Architecture
          </span>
          <h2 className="h2-fluid text-[var(--color-text)]">
            Separated Controllers & Contactless Energy Transfer
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-2">
            Engineered around discrete responsibilities between local sensing and cloud telemetry to simplify validation.
          </p>
        </div>

        {/* Asymmetrical Grid: 1 Wide Hero Feature + 2 Stacked Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Wide Card: Wireless Charging Physics */}
          <div className="lg:col-span-7 card-premium space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primitive-green)]/15 text-[var(--color-secondary)] flex items-center justify-center shadow-xs">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="h3-fluid text-[var(--color-text)]">
                Inductive Wireless Energy Transfer
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Retaining the physical foundation of the team's December 2025 prototype, primary and secondary electromagnetic induction coils transfer power across an air gap to the receiver circuit on a scaled toy electric vehicle.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-4 text-xs font-semibold text-[var(--color-text-muted)]">
              <span className="flex items-center space-x-1.5 text-[var(--color-secondary)]">
                <CheckCircle className="w-4 h-4" />
                <span>Air-Gap Power Delivery</span>
              </span>
              <span className="flex items-center space-x-1.5 text-[var(--color-secondary)]">
                <CheckCircle className="w-4 h-4" />
                <span>Boost Regulation</span>
              </span>
            </div>
          </div>

          {/* Right Column: 2 Stacked Asymmetric Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 2: RFID Authentication */}
            <div className="card-premium space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                RFID Access & Identification
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                The RC522 reader is planned to identify cards or tags for access feedback. RFID does not measure battery state of charge.
              </p>
            </div>

            {/* Card 3: Separated Microcontroller Logic */}
            <div className="card-premium space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primitive-lime)]/20 text-[#A08A12] dark:text-[var(--primitive-lime)] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Separated Controller Roles
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Planned roles: the Arduino UNO handles local sensing and indicators, while the ESP32 provides Wi-Fi communication. The link between them is still to be decided.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Boundary Notice */}
      <section className="card-flat border-l-4 border-l-[var(--color-primary)] space-y-2">
        <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
          Single Operational Prototype Boundary
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <strong>SolarSmart Base 01</strong> is the only charging prototype. Multi-station management and smart-city integrations are future scope (see Methodology).
        </p>
      </section>
    </div>
  );
};
