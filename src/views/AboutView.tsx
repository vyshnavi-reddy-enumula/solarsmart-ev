import React, { useState } from 'react';
import { Layers, Lightbulb, Compass, Award, Building2, ArrowRight, ShieldCheck, SunMedium } from 'lucide-react';

export const AboutView: React.FC = () => {
  const [activeDtTab, setActiveDtTab] = useState<'empathize' | 'define' | 'ideate' | 'prototype' | 'test'>('empathize');

  return (
    <div className="space-y-16">
      {/* Title & Introduction */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] border border-[var(--primitive-teal)]/20 shadow-xs">
          <Compass className="w-3.5 h-3.5" />
          <span>Design Thinking Course-Based Project (CBP)</span>
        </div>

        <h1 className="h1-fluid text-[var(--color-text)]">
          About SolarSmart EV
        </h1>

        <p className="prose-lead prose-readable">
          SolarSmart EV bridges embedded electronics, wireless energy transfer, and modern web interfaces to address uncertainty in renewable EV charging through human-centered design.
        </p>
      </section>

      {/* Prototype Evolution: Previous vs Upgraded System */}
      <section className="card-premium space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
            Heritage & Iteration
          </span>
          <h2 className="h3-fluid text-[var(--color-text)]">
            Prototype Evolution & Lineage
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Upgrading the previous December 2025 solar wireless charging demonstration into a connected IoT monitoring station.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Base System */}
          <div className="card-flat space-y-3">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">
              Previous Foundation (Dec 2025)
            </span>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Physical Solar Wireless Charger
            </h3>
            <ul className="text-xs sm:text-sm text-[var(--color-text-secondary)] space-y-2 list-disc list-inside leading-relaxed">
              <li>Mini solar panel and charging module</li>
              <li>Lead-acid / prototype energy storage source</li>
              <li>Inductive copper coils & boost converter</li>
              <li>Toy electric vehicle on breadboard</li>
              <li>Identified IoT monitoring as key future scope</li>
            </ul>
          </div>

          {/* Upgraded System */}
          <div className="card-flat border-[var(--primitive-teal)]/30 bg-[var(--primitive-teal)]/5 dark:bg-[var(--primitive-teal)]/10 space-y-3">
            <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">
              Current Upgrade (SolarSmart EV)
            </span>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Smart IoT & Monitored Station
            </h3>
            <ul className="text-xs sm:text-sm text-[var(--color-text-secondary)] space-y-2 list-disc list-inside leading-relaxed">
              <li>Retains the proven solar wireless charging layer</li>
              <li>Adds RC522 RFID reader for user identification</li>
              <li>Arduino UNO for local hardware state logic</li>
              <li>ESP32 Wi-Fi gateway for telemetry streaming</li>
              <li>Responsive web application with light & dark themes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* System Architecture Block Diagram */}
      <section className="card-premium space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] block mb-1">
            Hardware & Cloud Topology
          </span>
          <h2 className="h3-fluid text-[var(--color-text)]">
            Layered System Architecture
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Clear separation of responsibilities across physical, local control, connectivity, and presentation layers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="card-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-primary)]">Layer 1</span>
              <SunMedium className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Physical Power</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Mini solar panel, storage source, boost converter, and inductive wireless charging coils.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-secondary)]">Layer 2</span>
              <Layers className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Local Controller</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Arduino UNO reading RC522 RFID reader and INA219 power sensors, driving local indicators.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A08A12] dark:text-[var(--primitive-lime)]">Layer 3</span>
              <Lightbulb className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">IoT Gateway</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              ESP32 DevKit receiving serial sensor data from Arduino and transmitting via Wi-Fi.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-primary)]">Layer 4</span>
              <ShieldCheck className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Presentation</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Responsive React/Tailwind application providing User and Admin monitoring dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Design Thinking Interactive 5 Stages */}
      <section className="card-premium space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] block mb-1">
            Human-Centered Process
          </span>
          <h2 className="h3-fluid text-[var(--color-text)]">
            Design Thinking Methodology
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Iterative development following the 5 core stages of the Design Thinking curriculum.
          </p>
        </div>

        {/* DT Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border-subtle)] pb-3">
          {[
            { id: 'empathize', label: '1. Empathize' },
            { id: 'define', label: '2. Define' },
            { id: 'ideate', label: '3. Ideate' },
            { id: 'prototype', label: '4. Prototype' },
            { id: 'test', label: '5. Test' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDtTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDtTab === tab.id
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DT Tab Content */}
        <div className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3 max-w-3xl">
          {activeDtTab === 'empathize' && (
            <div className="space-y-2">
              <span className="font-bold text-[var(--color-text)] block text-base">
                Empathize: Understanding EV Driver & Operator Uncertainty
              </span>
              <p>
                Interviews revealed that EV drivers experience anxiety around charging station availability and lack clear confirmation that wireless charging has commenced. Station operators expressed a need for visibility into station state and renewable generation without complicated software.
              </p>
            </div>
          )}

          {activeDtTab === 'define' && (
            <div className="space-y-2">
              <span className="font-bold text-[var(--color-text)] block text-base">
                Define: Core Problem Statement
              </span>
              <blockquote className="p-4 rounded-xl bg-[var(--color-surface-elevated)] border-l-4 border-l-[var(--color-primary)] text-[var(--color-text)] font-medium italic">
                “How might we design an affordable, sustainable charging station that allows users to authenticate easily, monitor progress in real time, and provides useful aggregated information for station management?”
              </blockquote>
            </div>
          )}

          {activeDtTab === 'ideate' && (
            <div className="space-y-2">
              <span className="font-bold text-[var(--color-text)] block text-base">
                Ideate: Exploring IoT Integration Concepts
              </span>
              <p>
                Brainstorming explored RFID card tap authorization, local buzzer/OLED feedback, inductive power coils, separated microcontroller logic, and dedicated mobile-friendly dashboards distinguishing live from simulated data.
              </p>
            </div>
          )}

          {activeDtTab === 'prototype' && (
            <div className="space-y-2">
              <span className="font-bold text-[var(--color-text)] block text-base">
                Prototype: Scaled Physical & Digital Build
              </span>
              <p>
                The team constructed the physical circuit combining the mini solar panel, wireless coils, Arduino UNO, RC522 reader, and ESP32 gateway. Simultaneously, this responsive web interface was created to reflect live station states and telemetry.
              </p>
            </div>
          )}

          {activeDtTab === 'test' && (
            <div className="space-y-2">
              <span className="font-bold text-[var(--color-text)] block text-base">
                Test: Usability & Signal Verification
              </span>
              <p>
                Initial testing validated RFID card detection latency, serial packet integrity between Arduino and ESP32, and the web interface's responsiveness across mobile and desktop viewports, leading to the strict measurement integrity boundaries adopted today.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SDG Alignment Matrix */}
      <section className="card-premium space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] block mb-1">
            Global Sustainability Impact
          </span>
          <h2 className="h3-fluid text-[var(--color-text)]">
            Sustainable Development Goals (SDG) Alignment
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Academic alignment with United Nations Sustainable Development Goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="card-flat space-y-2">
            <div className="flex items-center space-x-2 text-[var(--color-secondary)] font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>SDG 7</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Clean Energy</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Demonstrates renewable solar energy utilization for electric vehicle charging infrastructure.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center space-x-2 text-[var(--color-primary)] font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>SDG 9</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Industry & Innovation</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Combines embedded microcontrollers, wireless power transfer, and IoT software architecture.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center space-x-2 text-[#A08A12] dark:text-[var(--primitive-lime)] font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>SDG 11</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Sustainable Cities</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Enhances charging station accessibility, transparency, and infrastructure visibility.
            </p>
          </div>

          <div className="card-flat space-y-2">
            <div className="flex items-center space-x-2 text-[var(--color-text)] font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>SDG 13</span>
            </div>
            <h4 className="text-sm font-bold text-[var(--color-text)]">Climate Action</h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Fosters awareness of clean energy adoption and carbon-neutral personal transport.
            </p>
          </div>
        </div>
      </section>

      {/* Approved Smart City Concept Preview Module */}
      <section className="card-premium border-2 border-dashed border-[var(--color-border)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="text-lg font-bold text-[var(--color-text)]">
                  Smart City Concept Preview
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Non-Operational Concept
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Future municipal vision for aggregated urban charging fleet management
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
          In a full-scale deployment, multiple SolarSmart base stations would stream operational metrics to smart-city municipal planning departments. The preview below models how urban authorities could monitor renewable charging distribution across a city grid.
        </p>

        {/* Conceptual Grid Cards (Clearly Labelled as Non-Operational Model) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="card-flat space-y-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
              Conceptual Fleet Scale
            </span>
            <div className="text-xl font-bold text-[var(--color-text)]">
              12 Simulated Stations
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">
              Illustrative model • Future scope
            </span>
          </div>

          <div className="card-flat space-y-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
              Peak Utilization Window
            </span>
            <div className="text-xl font-bold text-[var(--color-primary)]">
              11:30 AM – 3:00 PM
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">
              Correlated with solar peak
            </span>
          </div>

          <div className="card-flat space-y-1.5">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block">
              Aggregate Clean Energy
            </span>
            <div className="text-xl font-bold text-[var(--color-secondary)]">
              Municipal Grid Offload
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block font-medium">
              Conceptual planning metric
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-text-muted)] card-flat flex items-center space-x-2">
          <ArrowRight className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
          <span>
            <strong className="text-[var(--color-text)]">Data Integrity Notice:</strong> All metrics in this section represent architectural design concepts for smart-city integration. Only <strong>SolarSmart Base 01</strong> is physically operational.
          </span>
        </div>
      </section>
    </div>
  );
};
