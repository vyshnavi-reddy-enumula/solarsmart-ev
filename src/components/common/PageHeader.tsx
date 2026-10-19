import React from 'react';
import { DataBadge } from './DataBadge';
import { useStationData } from '../../context/StationDataContext';

interface PageHeaderProps {
  title: string;
  description: string;
  /** Replaces the default data-source badge. */
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, badge }) => {
  const { state } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[var(--color-border)]">
      <div className="space-y-2">
        <h1 className="h2-fluid text-[var(--color-text)]">{title}</h1>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xl">{description}</p>
      </div>
      {badge ?? <DataBadge kind={isDemo ? 'simulated' : 'unavailable'} label={isDemo ? 'Simulated demo data' : 'No live data source'} />}
    </div>
  );
};

