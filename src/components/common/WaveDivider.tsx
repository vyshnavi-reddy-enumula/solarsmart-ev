import React from 'react';

interface WaveDividerProps {
  className?: string;
  flip?: boolean;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ className = '', flip = false }) => {
  return (
    <div
      className={`wave-divider-container select-none pointer-events-none ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="wave-divider-svg"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Subtle translucent wave contour */}
        <path
          d="M0,32 C240,64 480,12 720,38 C960,64 1200,20 1440,42 L1440,74 L0,74 Z"
          fill="currentColor"
          opacity="0.45"
        />
        {/* Layer 2: Foreground crisp contour */}
        <path
          d="M0,48 C320,16 640,68 960,34 C1200,12 1360,52 1440,46 L1440,74 L0,74 Z"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};
