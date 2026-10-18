import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

type DtTab = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';

const DT: { id: DtTab; label: string; title: string; body: string }[] = [
  { id: 'empathize', label: 'Empathize', title: 'Stakeholders', body: 'EV users need clear status and access feedback. Operators need station state and usage information. Authorities may later need aggregated data. Interview or questionnaire evidence has not been recorded in this interface.' },
  { id: 'define', label: 'Define', title: 'Problem statement', body: 'How might we make the state of a small solar-powered wireless charging prototype easier to identify and monitor through RFID feedback, validated hardware readings, and a clear user and admin interface?' },
  { id: 'ideate', label: 'Ideate', title: 'Ideas considered', body: 'RFID identification, sensor monitoring, local indicators, user and admin dashboards, and clear separation of live and simulated data.' },
  { id: 'prototype', label: 'Prototype', title: 'Physical and digital', body: 'The physical foundation is the existing solar wireless charging model. This web interface is the digital prototype and currently runs on simulated data. Added hardware is planned and not confirmed.' },
  { id: 'test', label: 'Test', title: 'Planned testing', body: 'Planned levels are hardware, software and user testing. No test results are recorded or claimed in this interface.' },
];

const LAYERS = [
  { n: 'Physical power', s: 'Existing prototype', d: 'Mini solar panel, charging circuit, wireless coils, toy vehicle. Working condition to be verified.' },
  { n: 'Local controller', s: 'Planned', d: 'Arduino UNO reading selected inputs and driving indicators. Wiring is not confirmed.' },
  { n: 'Gateway', s: 'Planned', d: 'ESP32 for Wi-Fi communication. The protocol is an open decision.' },
  { n: 'Web interface', s: 'Built', d: 'This responsive app, running on simulated data until a source is connected.' },
];

const SDGS = [
  ['SDG 7', 'Affordable and clean energy', 'Solar-powered charging concept.'],
  ['SDG 9', 'Industry, innovation, infrastructure', 'Connected embedded prototype.'],
  ['SDG 11', 'Sustainable cities', 'Visible charging infrastructure.'],
  ['SDG 13', 'Climate action', 'Awareness of renewable energy use.'],
];

export const MethodologyDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<DtTab>('empathize');

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  const active = DT.find((t) => t.id === tab)!;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-title"
        className="drawer-panel absolute right-0 top-0 h-full w-full sm:w-[34rem] overflow-y-auto bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-[var(--shadow-lg)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <h2 id="methodology-title" className="h3-fluid text-[var(--color-text)]">Methodology</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close methodology" className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-8 space-y-10">
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">About the prototype</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              SolarSmart EV is a Design Thinking course project. It upgrades a small solar-powered wireless charging demonstration with RFID identification, hardware monitoring and a web interface. It uses a toy vehicle and is not a commercial EV charger.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Architecture</h3>
            <ol className="space-y-3">
              {LAYERS.map((l, i) => (
                <li key={l.n} className="card-flat space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[var(--color-text)]">{i + 1}. {l.n}</span>
                    <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">{l.s}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{l.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Design Thinking</h3>
            <div className="flex flex-wrap gap-2" role="tablist">
              {DT.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === t.id
                      ? 'bg-[var(--color-primary)] text-white dark:text-[#0B1319]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="space-y-2">
              <span className="text-sm font-bold text-[var(--color-text)] block">{active.title}</span>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{active.body}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">SDG alignment</h3>
            <ul className="space-y-2">
              {SDGS.map(([g, t, d]) => (
                <li key={g} className="card-flat flex gap-3 items-baseline">
                  <span className="text-xs font-bold text-[var(--color-secondary)] w-12 flex-shrink-0">{g}</span>
                  <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed"><strong className="text-[var(--color-text)]">{t}.</strong> {d}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--color-text-muted)]">Intended alignment only, not measured environmental impact.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Future scope</h3>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Session history, multi-station monitoring and aggregated analytics are not implemented. Only SolarSmart Base 01 exists.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
