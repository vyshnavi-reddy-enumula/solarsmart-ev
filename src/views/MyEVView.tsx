import React from 'react';
import { Radio, Clock, Car } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';
import { Notice } from '../components/common/Notice';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { useReadingKind } from '../hooks/useReadingKind';

export const MyEVView: React.FC = () => {
  const { isDemo, baseKind, r } = useReadingKind();

  return (
    <div className="space-y-12">
      <PageHeader title="My EV" description="RFID access feedback, session state and vehicle presence at the charging point." />
      <DataSourceNotice />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">RFID access</span>
            <DataBadge kind={isDemo ? 'simulated' : 'unavailable'} />
          </div>
          <div className="p-8 rounded-xl bg-[var(--color-surface-elevated)] border border-dashed border-[var(--color-border)] flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <Radio className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {isDemo ? 'Simulated reader: no card input is processed' : 'Reader status unavailable'}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              Access results appear here only when the system reports them.
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
            RFID identifies a card or tag. It does not measure battery level.
          </p>
        </div>

        <div className="space-y-8">
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Session</span>
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div className="font-tabular text-3xl font-semibold text-center py-5 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
              —
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--color-text-muted)]">No session reported. Duration starts only when one is.</p>
              <DataBadge kind="unavailable" />
            </div>
          </div>

          <div className="card-premium flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-[var(--color-text)] block">Vehicle presence</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {r.vehicleDetected === null ? 'Presence sensor not integrated' : r.vehicleDetected ? 'Detected' : 'Not detected'}
                </span>
              </div>
            </div>
            <DataBadge kind={r.vehicleDetected === null ? 'unavailable' : baseKind} />
          </div>
        </div>
      </div>

      <Notice title="Not shown on purpose">
        Battery level, charging completion and delivered energy are not displayed, because no verified measurement method exists for them yet.
      </Notice>
    </div>
  );
};
