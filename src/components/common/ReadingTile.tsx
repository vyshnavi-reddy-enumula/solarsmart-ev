import React from 'react';
import { ReadingKind } from '../../types/station';
import { DataBadge } from './DataBadge';

interface ReadingTileProps {
  label: string;
  value: string | null;
  unit?: string;
  kind: ReadingKind;
  note?: string;
}

/** A single labelled reading. Null values render as an em dash, never as zero. */
export const ReadingTile: React.FC<ReadingTileProps> = ({ label, value, unit, kind, note }) => (
  <div className="card-flat space-y-3">
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
      <DataBadge kind={value === null ? 'unavailable' : kind} />
    </div>
    <div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">
      {value === null ? '—' : value}
      {value !== null && unit && (
        <span className="ml-1 text-sm font-medium text-[var(--color-text-muted)]">{unit}</span>
      )}
    </div>
    {note && <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{note}</p>}
  </div>
);
