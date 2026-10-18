import React from 'react';

export const DisclaimerBanner: React.FC = () => (
  <div className="w-full bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
    <p className="app-container py-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
      <span className="font-semibold text-[var(--color-text)]">Demonstration prototype.</span>{' '}
      Toy vehicle and mini solar panel, not a commercial EV charger.
    </p>
  </div>
);
