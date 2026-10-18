import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="app-container py-3">
        <div className="flex items-start sm:items-center space-x-3 text-xs sm:text-sm">
          <div className="p-1.5 rounded-md bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex-shrink-0 mt-0.5 sm:mt-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-[var(--color-text-secondary)] leading-relaxed">
            <span className="font-bold text-[var(--color-text)]">
              Demonstration Prototype:
            </span>{' '}
            SolarSmart EV is a scaled educational proof-of-concept using a mini solar panel, wireless charging coils, and a toy electric vehicle. It does not represent commercial high-power EV charging infrastructure.
          </div>
        </div>
      </div>
    </div>
  );
};
