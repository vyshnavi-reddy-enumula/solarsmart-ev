import React from 'react';
import { ConnectorType } from '../../data/demoData';

/** Simplified connector face (pin layout only). Always shown next to a text label. */
export const ConnectorIcon: React.FC<{ type: ConnectorType; size?: number }> = ({ type, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    {type === 'Type 2' ? (
      <>
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        {[[16, 9.5], [10.5, 13], [21.5, 13], [10.5, 19], [21.5, 19], [16, 22.5]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill="currentColor" />
        ))}
        <circle cx="16" cy="16" r="1.4" fill="currentColor" />
      </>
    ) : (
      <>
        <circle cx="16" cy="11" r="9.5" stroke="currentColor" strokeWidth="2" />
        {[[16, 5.8], [11.4, 8.4], [20.6, 8.4], [11.4, 13.6], [20.6, 13.6], [16, 16.2]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.4" fill="currentColor" />
        ))}
        <rect x="5" y="22" width="22" height="8" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="11" cy="26" r="2.3" fill="currentColor" />
        <circle cx="21" cy="26" r="2.3" fill="currentColor" />
      </>
    )}
  </svg>
);
